import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(req, { params }) {

  await connectDB();

  const username = params.username;

  const user = await User.findOne({ username });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const posts = await Post.find({
    userId: username,
    isPublic: true
  }).sort({ createdAt: -1 });

  return Response.json({
    username: user.username,
    followers: user.followers || [],
    following: user.following || [],
    posts: posts || []
  });

}