import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";

export const runtime = "nodejs";
const MAX_BYTES = 5 * 1024 * 1024;

/** Signed-in users upload an image here; we forward it to ImgBB with the server-side key. */
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Please sign in to upload images." }, { status: 401 });

  const key = process.env.IMGBB_API_KEY;
  if (!key) return NextResponse.json({ message: "IMGBB_API_KEY is not set on the server." }, { status: 500 });

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File)) return NextResponse.json({ message: "No image received." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ message: "Only image files are allowed." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ message: "Image must be smaller than 5 MB." }, { status: 400 });

  const body = new FormData();
  body.append("image", Buffer.from(await file.arrayBuffer()).toString("base64"));

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
    const json = await res.json();
    const url: string | undefined = json?.data?.url ?? json?.data?.display_url;
    if (!res.ok || !url) {
      return NextResponse.json({ message: json?.error?.message ?? "ImgBB rejected the upload." }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ message: "Could not reach ImgBB." }, { status: 502 });
  }
}
