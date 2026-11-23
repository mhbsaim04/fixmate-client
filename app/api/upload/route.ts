import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "ImgBB API key is not configured." }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Please select an image file." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "Image must be under 5MB." }, { status: 400 });
  }

  const uploadForm = new FormData();
  uploadForm.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: uploadForm,
  });
  if (!res.ok) {
    return NextResponse.json({ message: "Image upload failed." }, { status: 502 });
  }
  const data = await res.json();
  const url = data?.data?.url;
  if (!url) {
    return NextResponse.json({ message: "Image upload failed." }, { status: 502 });
  }
  return NextResponse.json({ url });
}