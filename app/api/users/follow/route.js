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

  if (currentUser._id.equals(targetUser._id)) {
    return Response.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  // already following - use string comparison for ObjectId
  const isAlreadyFollowing = currentUser.following.some(
    id => id.toString() === targetUser._id.toString()
  );
  
  if (isAlreadyFollowing) {
    return Response.json({ message: "Already following" });
  }

  currentUser.following.push(targetUser._id);
  targetUser.followers.push(currentUser._id);

  await currentUser.save();
  await targetUser.save();

  return Response.json({ message: "Followed successfully" });

}
