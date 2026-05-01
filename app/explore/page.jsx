"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SaveButton from "@/components/SaveButtonClient.tsx";

export default function Explore() {

  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try { } catch (e) {
        console.error('Token decode error', e);
      }
    }
  }, []);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [following, setFollowing] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    // Load saved posts on mount
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/posts/saved", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.savedPosts) {
          setSavedPosts(data.savedPosts.map(p => p._id));
        }
      })
      .catch(console.error);
    }
  }, []);

  useEffect(() => {

    const timeout = setTimeout(async () => {

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`/api/explore?search=${query}`, { headers });
      const data = await res.json();

      setPosts(data.posts || []);
      setUsers(data.users || []);
      setFollowing(data.followingIds || []);

    }, 300);

    return () => clearTimeout(timeout);

  }, [query]);

  // follow / unfollow
  const handleFollow = async (userId) => {
    const token = localStorage.getItem("token");

    if (following.includes(userId)) {
      await fetch("/api/users/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      setFollowing(following.filter(id => id !== userId));
    } else {
      await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      setFollowing([...following, userId]);
    }
  };

  // save / unsave
  const handleSave = async (postId) => {
    const token = localStorage.getItem("token");
    const url = savedPosts.includes(postId) ? "/api/posts/unsave" : "/api/posts/save";

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ postId })
    });

    // UI update
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  return (

    <div className="max-w-2xl mx-auto space-y-8">

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search users, tags, posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded border font-outfit font-medium"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--text)"
          }}
        />
      </div>

      <h1 className="text-3xl font-pixel font-medium mb-6">
        Explore
      </h1>

      {/* Suggested Users */}
      <div>

        <h2 className="text-xl font-pixel font-semibold mb-2">
          Suggested Users
        </h2>

        <div className="space-y-2">

          {users?.map((user) => (

            <div key={user._id} className="flex justify-between items-center p-2 rounded font-outfit font-medium" style={{ border: '1px solid var(--border)', }}         >      <Link href={`/users/${user.username}`}>{user.username}            </Link>

              <div className="flex items-center gap-3">

                <span className="text-sm text-gray-500 font-outfit">
                  {user.followers?.length || 0} followers
                </span>

                <button
                  onClick={() => handleFollow(user._id)}
                  className="border px-3 py-1 rounded text-sm font-outfit"
                >
                  {following.includes(user._id) ? "Unfollow" : "Follow"}
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Public Posts */}
      <div>

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-xl font-pixel font-semibold">
            Public Posts
          </h2>

          {/* Mobile dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:hidden border rounded px-2 py-1 text-sm font-outfit"
            style={{ 
              backgroundColor: "var(--input)",
              borderColor: "var(--border)",
              color: "var(--text)",
              border: '1px solid var(--border)'
            }}
          >
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Beauty">Beauty</option>
            <option value="Clothes">Clothes</option>
            <option value="Travel">Travel</option>
            <option value="Study">Study</option>
            <option value="Personal">Personal</option>
          </select>

        </div>

        {/* Desktop category pills */}
        <div className="hidden md:flex gap-2 mb-6 flex-wrap">
          {["All","Food","Beauty","Clothes","Travel","Study","Personal"].map((cat) => (
          <button
  key={cat}
  onClick={() => setSelectedCategory(cat)}
  className={`px-3 py-1 rounded-full text-sm font-outfit transition border`}
  style={{
    backgroundColor: selectedCategory === cat ? "var(--cat-active)" : "var(--cat-bg)",
    borderColor: selectedCategory === cat ? "var(--cat-active)" : "var(--border)",
    color: "var(--text)",
  }}
>
  {cat}
</button>
          ))}
        </div>

        {/* Posts */}
        {posts
          ?.filter(
            (post) =>
              selectedCategory === "All" ||
              post.category === selectedCategory
          )
          .map((post) => (

            <div key={post._id} className="space-y-1 mb-6">

              <div className="flex justify-between items-center text-xs">
                <Link
                  href={`/users/${post.userId}`}
                  className="font-outfit font-medium hover:underline text-sm"
                >
                  @{post.userId}
                </Link>

                <div className="flex items-center gap-2">
                  
                  <p className="opacity-60">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h1 className="text-xl font-pixel font-bold mb-2">
                {post.title}
              </h1>

              {post.image && (
                <img 
                  src={post.image} 
                  className="w-full rounded-lg mb-3 object-cover max-h-[400px]" 
                  alt="" 
                  loading="lazy" 
                />
              )}

              <p className="mb-3 font-outfit font-medium">
                {post.content}
              </p>

              {post.category && (
                <p className="text-sm opacity-80 mb-1 font-outfit font-medium">
                  Category: {post.category}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                              <p className="text-sm opacity-70  font-outfit font-medium mb-3">
                                Tags: {post.tags.join(", ")}
                              </p>
                            )}
              
                            {currentUser !== post.userId && <SaveButton postId={post._id} className="ml-auto mb-1" />}
              </div>

            </div>

          ))}

      </div>

    </div>

  );
}