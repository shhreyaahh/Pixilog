import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // Auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      console.log('Verify secret length:', process.env.JWT_SECRET?.length || 'UNDEFINED');
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.log("Invalid token:", e.message);
      return Response.json({ error: "Invalid/expired token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).populate({
      path: "savedPosts",
      select: "title content category tags createdAt isPublic userId image"
    });
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
  savedPosts: user.savedPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => ({
      ...post.toObject(),
      authorUsername: post.userId
    }))
});

  } catch (error) {
    console.error("Failed to load saved posts:", error.message);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
