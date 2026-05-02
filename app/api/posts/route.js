import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";

function encryptText(text) {
  const iv = crypto.randomBytes(16);

  const key = crypto
    .createHash("sha256")
    .update(process.env.PRIVATE_POST_SECRET)
    .digest();

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return Response.json({ error: "Invalid/expired token" }, { status: 401 });
    }

    const formData = await req.formData();

    let title = formData.get("title");
    let content = formData.get("content");

    const category = formData.get("category");

    const tags = String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const isPublic = formData.get("isPublic") === "true";
    const image = formData.get("image");

    // Encrypt only private posts
    if (!isPublic) {
      title = encryptText(title);
      content = encryptText(content);
    }

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
      userId: decoded.username,
    });

    await post.save();

    return Response.json({ message: "Post created", post }, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}