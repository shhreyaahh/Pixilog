"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import SaveButton from "@/components/SaveButtonClient.tsx";

export default function ProfilePage({ params }) {
  const { username } = use(params);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.username);
      } catch (e) {
        console.error('Token decode error', e);
      }
    }
  }, []);

  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setPosts(data.posts || []);
          setFollowers(data.followers || []);
          setFollowing(data.following || []);
        }
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:p-10 flex items-center justify-center">
        <p className="text-lg opacity-70">Loading...</p>
      </div>
    );
  }

  if (posts.length === 0 && followers.length === 0) {
    return (
      <div className="min-h-screen pb-20 md:p-10">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:p-10">

      {/* PROFILE HEADER */}

      <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">

        <div
          className="shrink-0 aspect-square w-16 md:w-24 rounded-full border flex items-center justify-center text-xl md:text-2xl"
          style={{ borderColor: "var(--border)" }}
        >
          {username?.charAt(0).toUpperCase()}
        </div>

        <div>

          <h1 className="text-xl md:text-2xl font-bold mb-2 font-outfit">@{username}</h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 md:gap-6 text-sm opacity-80 font-outfit">

            <Link href={`/users/${username}/followers`}>
              {followers.length} followers
            </Link>

            <Link href={`/users/${username}/following`}>
              {following.length} following
            </Link>

            <span>{posts.length} posts</span>

          </div>

        </div>

      </div>

      {/* POSTS */}

      <div className="space-y-6">

        {posts.length === 0 && (
          <p className="opacity-70">No public posts yet.</p>
        )}

        {posts.map((post) => (
          <div key={post._id} className="space-y-1">
            <div className="flex justify-end items-center text-xs">
              <p className="opacity-60">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>

            <div
              className="p-4 md:p-6 rounded-lg border relative cursor-default"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)"
              }}
            >

              <h2 className="text-xl font-pixel font-bold mb-2">
                {post.title}
              </h2>

              {post.image && (
                <img 
                  src={post.image} 
                  className="w-full rounded-lg mb-3 object-cover max-h-[400px]" 
                  alt="" 
                  loading="lazy" 
                />
              )}

              {post.category && (
                <p className="text-sm opacity-80 mb-1 font-outfit font-medium">
                  Category: {post.category}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <p className="text-sm opacity-70 mb-3 font-outfit font-medium">
                  Tags: {post.tags.join(", ")}
                </p>
              )}

              <p className="mb-4 font-outfit font-medium">
                {post.content}
              </p>

              {currentUser !== post.userId && (
                <SaveButton postId={post._id} className="ml-auto mb-1" />
              )}

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
