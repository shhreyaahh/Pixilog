import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function encryptText(text) {
  const iv = crypto.randomBytes(16);

  const key = crypto
    .createHash("sha256")
    .update(process.env.PRIVATE_POST_SECRET)
    .digest();

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    key,
    iv
  );

  let encrypted = cipher.update(
    text,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

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

export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const obj = post.toObject();

if (!obj.isPublic) {
  obj.title = decryptText(obj.title);
  obj.content = decryptText(obj.content);
}

return Response.json(obj);
}

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = await params;

  // Get and verify JWT token
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  // Find the post
  const post = await Post.findById(id);
  
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  // Check ownership
  if (post.userId !== decoded.username) {
    return Response.json({ error: "Unauthorized - you can only edit your own posts" }, { status: 403 });
  }

  const body = await req.json();
  const updates = {
  title: body.isPublic
    ? body.title
    : encryptText(body.title),

  content: body.isPublic
    ? body.content
    : encryptText(body.content),

  category: body.category,
    category: body.category,
    tags: Array.isArray(body.tags)
      ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
    isPublic: Boolean(body.isPublic)
  };

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    updates,
    { new: true }
  );

  return Response.json(updatedPost);
}

export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = await params;

  // Get and verify JWT token
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  // Find the post
  const post = await Post.findById(id);
  
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  // Check ownership
  if (post.userId !== decoded.username) {
    return Response.json({ error: "Unauthorized - you can only delete your own posts" }, { status: 403 });
  }

  // Delete the post
  await Post.findByIdAndDelete(id);

  return Response.json({ message: "Post deleted" });
}
