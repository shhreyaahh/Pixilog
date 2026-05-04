"use client";

import { useEffect, useState } from "react";
import SaveButton from "@/components/SaveButtonClient.tsx";

export default function ProfilePage({ params }) {
  const username = params.username;

  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.username);
        setCurrentUserId(payload.id);
      } catch (e) {
        console.error('Token decode error', e);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`/api/users/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileUserId(data._id || null);
        setPosts(data.posts || []);
        setFollowers(data.followers || []);
        setFollowing((data.following || []).length);
      });
  }, [username]);

  const isOwnProfile = currentUser?.toLowerCase() === username?.toLowerCase();
  const isFollowing = followers.some(
    (follower) => follower._id?.toString() === currentUserId
  );

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token || !profileUserId) return;

    const res = await fetch(isFollowing ? "/api/users/unfollow" : "/api/users/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId: profileUserId })
    });

    if (!res.ok) return;

    if (isFollowing) {
      setFollowers(followers.filter(
        (follower) => follower._id?.toString() !== currentUserId
      ));
    } else {
      setFollowers([
        ...followers,
        { _id: currentUserId, username: currentUser }
      ]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-6">

      {/* PROFILE HEADER */}

      <div className="flex items-center gap-4 md:gap-6 mb-10">

        <div
          className="w-24 h-24 rounded-full border"
          style={{ borderColor: "var(--border)" }}
        />

        <div>

          <h1 className="text-2xl font-bold mb-2 font-outfit truncate max-w-[200px]" title={username}>
            @{username}
          </h1>

          <div className="flex gap-6 text-sm opacity-80 font-outfit">

            <span>{followers.length} followers</span>
            <span>{following} following</span>
            <span>{posts.length} posts</span>

          </div>

          {currentUser && !isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className="mt-4 px-4 py-2 rounded border text-sm font-outfit font-medium"
              style={{
                backgroundColor: isFollowing ? "var(--input)" : "var(--button)",
                borderColor: "var(--border)",
                color: isFollowing ? "var(--text)" : "var(--button-text)"
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

        </div>

      </div>

      {/* POSTS */}

      <div className="space-y-6">

        {posts.length === 0 && (
          <div className="text-center py-10 opacity-70 font-pixel">
            No posts yet.
          </div>
        )}

        {posts.map((post) => (
          <div key={post._id} className="space-y-1">
            <div className="flex justify-end items-center text-xs">
              <span className="opacity-70 font-outfit">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            <div
              className="p-6 rounded-lg border relative cursor-default"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)"
              }}
            >

            {/* TITLE */}
            <h2 className="text-xl font-pixel font-bold mb-2">
              {post.title}
            </h2>

{post.image && (
  <img
    src={post.image}
    className="w-full rounded-lg mb-3 max-h-[500px] object-contain bg-gray-100"
    loading="lazy"
    alt=""
  />
)}

            {/* CONTENT */}
            <p className="mb-3 font-outfit font-medium">
              {post.content}
            </p>

            {/* CATEGORY */}
            {post.category && (
              <p className="text-sm opacity-80 mb-1 font-outfit font-medium">
                Category: {post.category}
              </p>
            )}

            {/* TAGS */}
            {post.tags && post.tags.length > 0 && (
              <p className="text-sm opacity-70 font-outfit font-medium">
                Tags: {post.tags.join(", ")}
              </p>
            )}

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

