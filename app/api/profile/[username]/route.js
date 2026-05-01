export const dynamic = "force-dynamic";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  try {
    console.log("[API] /api/profile/", params?.username);
    await connectDB();

    const user = await User.findOne({ username: params.username })
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({
      userId: params.username,
      isPublic: true
    }).sort({ createdAt: -1 });

    return Response.json({
      username: user.username,
      followers: user.followers || [],
      following: user.following || [],
      posts: posts || []
    });
  } catch (err) {
    console.error("/api/profile/[username] error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
