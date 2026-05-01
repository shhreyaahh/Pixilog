import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { userId } = body;

  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;

  try {
    const token = authHeader.split(" ")[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const currentUser = await User.findOne({ username: decoded.username });
  const targetUser = await User.findById(userId);

  if (!currentUser || !targetUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUser._id.toString()
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUser._id.toString()
  );

  await currentUser.save();
  await targetUser.save();

  return Response.json({ message: "Unfollowed successfully" });
}
