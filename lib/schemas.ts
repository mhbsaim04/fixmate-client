import { z } from "zod";
import { CATEGORIES, SERVICE_MODES } from "./constants";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Add at least one uppercase letter")
  .regex(/[a-z]/, "Add at least one lowercase letter");

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: passwordSchema,
  role: z.enum(["customer", "technician"]),
});

export const requestSchema = z.object({
  customerPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[+\d][\d\s-]{5,}$/, "Enter a valid phone number"),
  address: z.string().trim().min(8, "Enter the full service address"),
  preferredDate: z
    .string()
    .min(1, "Pick a date")
    .refine((v) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return v >= d.toISOString().slice(0, 10);
    }, "Date must be today or later"),
  problemDescription: z.string().trim().min(20, "Describe the problem in at least 20 characters"),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  category: z.enum(CATEGORIES, { error: "Choose a category" }),
  description: z.string().trim().min(20, "Describe the service in at least 20 characters"),
  basePrice: z
    .string()
    .min(1, "Price is required")
    .refine((v) => Number(v) > 0, "Price must be a positive number"),
  estimatedDuration: z.string().trim().min(2, "Add an estimated duration"),
  serviceMode: z.enum(SERVICE_MODES as [string, ...string[]], {
    error: "Choose a service mode",
  }),
  serviceArea: z.string().trim().min(2, "Add the area you cover"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z.string().trim().optional(),
  area: z.string().trim().optional(),
  bio: z.string().trim().max(400, "Keep your bio under 400 characters").optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type RequestValues = z.infer<typeof requestSchema>;
export type ServiceValues = z.infer<typeof serviceSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
