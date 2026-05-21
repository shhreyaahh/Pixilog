import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Diary from "@/models/Diary";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const tags = formData.get("tags");
    const image = formData.get("image");

    let imagePath = null;

    if (image && image.name) {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "pixilog",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  imagePath = result.secure_url;
}

    const diary = await Diary.create({
      userId: decoded.id,
      title,
      content,
      tags,
      image: imagePath
    });

    return NextResponse.json(diary);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating diary" },
      { status: 500 }
    );
  }
}