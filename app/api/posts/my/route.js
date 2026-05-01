import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req) {

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
    } catch (e) {
      console.log("Invalid token:", e.message);
      return Response.json({ error: "Invalid/expired token" }, { status: 401 });
    }

    const posts = await Post.find({
      userId: decoded.username
    }).populate('userId', 'username').sort({ createdAt: -1 });

    return Response.json(posts);

  } catch (error) {

    console.error("Failed to load user posts:", error.message);

    return Response.json({ error: "Failed to load posts" }, { status: 500 });

  }

}