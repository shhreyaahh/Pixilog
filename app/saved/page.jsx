"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SaveButton from '@/components/SaveButtonClient.tsx';

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.username);
      } catch (e) {
        console.error('Token decode error', e);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/posts/saved', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.savedPosts) {
          setSavedPosts(data.savedPosts);
        }
        setLoading(false);
      })
      .catch(console.error);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg opacity-70">Loading saved posts...</p>
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-10 pb-24 md:pb-6 text-center">
        <h1 className="text-3xl font-pixel font-bold mb-4">Saved Posts</h1>
        <p className="opacity-70">No saved posts yet. Save public posts to find them here later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 pb-24 md:pb-6">
      <h1 className="text-3xl font-pixel font-bold mb-8">Saved Posts</h1>
      {savedPosts.map((post) => (
        <div key={post._id} className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <Link
              href={`/users/${post.authorUsername || post.userId}`}
              className="font-outfit font-medium hover:underline text-sm"
            >
              @{post.authorUsername || post.userId}
            </Link>
            <p className="opacity-60">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          <div
            className="p-6 rounded-lg border cursor-default"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
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
            <p className="mb-3 font-outfit font-medium">
              {post.content}
            </p>
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
            <div className="flex items-end justify-between gap-3">
              <Link
                href={`/users/${post.authorUsername || post.userId}`}
                className="text-sm opacity-70 font-outfit font-medium hover:underline"
              >
                by @{post.authorUsername || post.userId}
              </Link>
              {currentUser && (
                <SaveButton
                  postId={post._id}
                  className="ml-auto"
                  onSavedChange={(isSaved) => {
                    if (!isSaved) {
                      setSavedPosts(savedPosts.filter((savedPost) => savedPost._id !== post._id));
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
