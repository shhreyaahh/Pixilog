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
    let blockedUsernames = [];
    let blockedUserIds = [];

    const authHeader = req.headers.get("authorization");

    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUsername = decoded.username;
      } catch {}
    }

    let followingIds = [];

    if (currentUsername) {
      const currentUser = await User.findOne({ username: currentUsername })
        .populate("following", "username");

      if (currentUser) {
        const followedUsers = currentUser.following.filter(Boolean);
        const followedUsernames = followedUsers.map((user) => user.username);
        followingIds = followedUsers.map((user) => user._id.toString());
        blockedUserIds = [currentUser._id, ...followedUsers.map((user) => user._id)];
        blockedUsernames = [currentUser.username, ...followedUsernames];
      }
    }

    let postFilter = { isPublic: true };

    if (blockedUsernames.length > 0) {
      postFilter.userId = { $nin: blockedUsernames };
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

    if (blockedUserIds.length > 0) {
      userFilter._id = { $nin: blockedUserIds };
    }

    if (query) {
      userFilter.username = { $regex: query, $options: "i" };
    }

    const posts = await Post.find(postFilter)
      .sort({ createdAt: -1 })
      .limit(20);

    const users = await User.aggregate([
      { $match: userFilter },
      { $sample: { size: 5 } },
      { $project: { password: 0, email: 0, savedPosts: 0 } }
    ]);

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
