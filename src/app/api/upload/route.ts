import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64 data" }, { status: 400 });
    }

    // Extract base64 content
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filename = `upload-${Date.now()}.png`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Make sure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
