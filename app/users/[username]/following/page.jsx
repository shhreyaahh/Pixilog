import Link from "next/link";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function FollowingPage({ params }) {
  const { username } = await params;
  const uname = (username || "").trim();

  await connectDB();

  const user = await User.findOne({ username: { $regex: new RegExp(`^${uname}$`, "i") } })
    .populate("following", "username");

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-2xl font-bold mb-6">User not found</h1>
      </div>
    );
  }

  const following = user?.following || [];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold mb-6">Following</h1>

      {following.length === 0 && (
        <p className="opacity-70">Not following anyone yet.</p>
      )}

      {following.map((u) => (
        <div key={u._id.toString()} className="border p-3 rounded mb-2">
          <Link href={`/users/${u.username}`} className="hover:underline">
            @{u.username}
          </Link>
        </div>
      ))}
    </div>
  );
}
  
