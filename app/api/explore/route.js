import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search") || "";

    let currentUsername = null;

    const authHeader = req.headers.get("authorization");

    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUsername = decoded.username;
      } catch {}
    }

    let postFilter = { isPublic: true };

    if (currentUsername) {
      postFilter.userId = { $ne: currentUsername };
    }

    if (query) {
      postFilter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ];
    }

    let userFilter = {};

    if (currentUsername) {
      userFilter.username = { $ne: currentUsername };
    }

    if (query) {
      userFilter.username = { $regex: query, $options: "i" };
    }

    const posts = await Post.find(postFilter)
      .sort({ createdAt: -1 })
      .limit(20);

    const users = await User.find(userFilter)
      .select("-password")
      .limit(10);

    // Get current user's following list
    let followingIds = [];
    if (currentUsername) {
      const currentUser = await User.findOne({ username: currentUsername });
      if (currentUser) {
        followingIds = currentUser.following.map(id => id.toString());
      }
    }

    return Response.json({
      posts,
      users,
      followingIds
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { posts: [], users: [] },
      { status: 500 }
    );

  }

}