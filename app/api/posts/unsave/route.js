import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req) {
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
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.log("Invalid token:", e.message);
      return Response.json({ error: "Invalid/expired token" }, { status: 401 });
    }
    
    const { postId } = await req.json();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return Response.json({ error: "Invalid postId" }, { status: 400 });
    }

    // Get user and remove from savedPosts
    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    await user.save();

    return Response.json({ 
      message: "Post unsaved", 
      savedCount: user.savedPosts.length 
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
