import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id;
    const username = user.username;

    // Delete all posts by this user
    await Post.deleteMany({ userId: username });

    // Remove user from others' followers/following
    await User.updateMany(
      {},
      {
        $pull: {
          followers: userId,
          following: userId
        }
      }
    );

    // Remove deleted user's saved posts list not needed after delete
    // Delete account
    await User.findByIdAndDelete(userId);

    return Response.json({
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}