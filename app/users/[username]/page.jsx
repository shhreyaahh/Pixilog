"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import SaveButton from "@/components/SaveButtonClient.tsx";

export default function ProfilePage({ params }) {
  const { username } = use(params);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profileUserId, setProfileUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/users/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setNotFound(true);
        } else {
          setNotFound(false);
          setProfileUserId(data._id || null);
          setPosts(data.posts || []);
          setFollowers(data.followers || []);
          setFollowing(data.following || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setNotFound(true);
        setLoading(false);
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

  if (loading) {
    return (
<div className="pb-24 md:pb-6 md:p-10 flex items-center justify-center">
        <p className="text-lg opacity-70">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
<div className="pb-24 md:pb-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
      </div>
    );
  }

  return (
<div className="pb-24 md:pb-6 md:p-10">

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
