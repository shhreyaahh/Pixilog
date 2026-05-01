import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    console.log("DB connected successfully");

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;

    try {
      const token = authHeader.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded.username);
    } catch (e) {
      console.log("Invalid token:", e.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findOne({ username: decoded.username })
      .populate("following", "username");

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const followedUsernames = currentUser.following
      .filter(Boolean)
      .map((user) => user.username);
    const allowedUsernames = [currentUser.username, ...followedUsernames];

    const posts = await Post.find({
      userId: { $in: allowedUsernames },
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log(`Found ${posts.length} home feed posts`);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed", details: error.message },
      { status: 500 }
    );
  }
}
