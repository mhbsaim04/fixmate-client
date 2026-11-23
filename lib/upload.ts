export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please select an image file.";
  if (file.size > 5 * 1024 * 1024) return "Image must be under 5MB.";
  return null;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Image upload failed.");
  }
  const data = await res.json();
  return data.url;
}