import { toast } from "sonner";
import { clearTokenCache } from "./api";
import { authClient } from "./auth-client";

export async function signOutUser(onDone?: () => void) {
  await authClient.signOut();
  clearTokenCache();
  toast.success("Signed out. See you soon!");
  onDone?.();
}
