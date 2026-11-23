export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please select an image file.";
  if (file.size > 5 * 1024 * 1024) return "Image must be under 5MB.";
  return null;
}

export async function uploadImage(file: File): Promise<string> {
  const apiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY || "";
  if (!apiKey) throw new Error("ImgBB API key is not configured.");

  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Image upload failed.");
  const data = await res.json();
  return data?.data?.url ?? "";
}