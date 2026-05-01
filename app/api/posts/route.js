import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const tags = formData.get("tags");
    const isPublic = formData.get("isPublic") === "true";
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

    const post = new Post({
      title,
      content,
      category,
      tags,
      isPublic,
      image: imagePath,
      userId: decoded.username
    });

    await post.save();

    return Response.json({ message: "Post created", post }, { status: 201 });

  } catch (error) {
    console.error("POST ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
