import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  let followingIds = [];

  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id).select("following");

      if (currentUser) {
        followingIds = currentUser.following.map((id) => id.toString());
      }
    } catch (error) {
      console.log("Auth optional:", error.message);
    }
  }

  const users = await User.find({
    username: { $regex: search, $options: "i" }
  }).select("username followers");

  return Response.json({
    users,
    followingIds
  });
}