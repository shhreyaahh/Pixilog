import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    console.log("DB connected successfully");

    // Get current user from token (optional for now)
    const authHeader = req.headers.get("authorization");
    let decoded = null;
    
    if (authHeader && process.env.JWT_SECRET) {
      try {
        const token = authHeader.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", decoded.username);
      } catch (e) {
        console.log("Invalid token:", e.message);
        // Continue without user filter
      }
    } else {
      console.log("No auth header or JWT_SECRET");
    }

    // Show all public posts
    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log(`Found ${posts.length} public posts`);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed", details: error.message },
      { status: 500 }
    );
  }
}
