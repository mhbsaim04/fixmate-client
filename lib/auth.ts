/**
 * BetterAuth server instance (runs inside this Next.js app).
 * - Stores users in the same MongoDB your Express API reads from.
 * - Adds role / phone / area / bio to the user via additionalFields.
 * - Issues short-lived JWTs (jwt plugin) that the Express API verifies through the JWKS endpoint:
 *     GET {BETTER_AUTH_URL}/api/auth/jwks
 */
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { __fixmateMongo?: MongoClient };

const client =
  globalForMongo.__fixmateMongo ??
  new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
if (process.env.NODE_ENV !== "production") globalForMongo.__fixmateMongo = client;

const db = client.db("fixmate");

const SIGNUP_ROLES = ["customer", "technician"];
const ADMIN_EMAILS = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAIL2]
  .filter(Boolean)
  .map((e) => (e ?? "").toLowerCase());

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      area: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Nobody can sign up as admin: anything except customer/technician becomes customer.
        before: async (user) => {
          const requested = (user as { role?: string }).role;
          const email = (user as { email?: string }).email?.toLowerCase();
          const role = ADMIN_EMAILS.includes(email ?? "")
            ? "admin"
            : SIGNUP_ROLES.includes(requested ?? "")
              ? requested
              : "customer";
          return {
            data: { ...user, role },
          };
        },
      },
      update: {
        // Users can never change their own role through updateUser.
        before: async (user) => {
          const { role: _ignored, ...rest } = user as Record<string, unknown>;
          void _ignored;
          return { data: rest };
        },
      },
    },
  },
  plugins: [jwt(), nextCookies()],
});
