import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json(post);
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

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    body,
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
