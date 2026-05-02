import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function decryptText(text) {
  try {
    const parts = text.split(":");

    if (parts.length !== 2) return text;

    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];

    const key = crypto
      .createHash("sha256")
      .update(process.env.PRIVATE_POST_SECRET)
      .digest();

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      key,
      iv
    );

    let decrypted = decipher.update(
      encryptedText,
      "hex",
      "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return text;
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (e) {
      return Response.json(
        { error: "Invalid/expired token" },
        { status: 401 }
      );
    }

    const posts = await Post.find({
      userId: decoded.username
    }).sort({ createdAt: -1 });

    const safePosts = posts.map((post) => {
      const obj = post.toObject();

      if (!obj.isPublic) {
        obj.title = decryptText(obj.title);
        obj.content = decryptText(obj.content);
      }

      return obj;
    });

    return Response.json(safePosts);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to load posts" },
      { status: 500 }
    );
  }
}