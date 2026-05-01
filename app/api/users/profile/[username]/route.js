import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(req, { params }) {

  const { username } = await params;

  console.log("USERNAME:", username);

  await connectDB();

  const user = await User.findOne({
    username: { $regex: new RegExp(`^${username}$`, "i") }
  }).select("-password")
    .populate("followers", "username")
    .populate("following", "username");

  console.log("USER FOUND:", !!user, user ? user.username : "null");

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const posts = await Post.find({
    userId: { $regex: new RegExp(`^${username}$`, "i") },
    isPublic: true
  }).sort({ createdAt: -1 });

  return Response.json({
    _id: user._id,
    username: user.username,
    followers: user.followers || [],
    following: user.following || [],
    posts: posts || []
  });
}
