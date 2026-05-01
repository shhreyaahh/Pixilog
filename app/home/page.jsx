"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SaveButton from "@/components/SaveButtonClient.tsx";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser(payload.username);
    } catch (e) {
      console.error('Token decode error', e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    const fetchFeed = async () => {
      try {
        console.log("Fetching feed...");
        const res = await fetch("/api/feed", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        if (!res.ok) {
          try {
            const errorData = await res.json();
            console.error("API error:", errorData?.error || 'Unknown server error', errorData?.details || '');
          } catch {
            console.error("API error: Non-JSON response (500)");
          }
          setPosts([]);
          return;
        }

        const data = await res.json();
        console.log("Feed data:", data);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch feed error:", error);
        setPosts([]);
      }
    };

    fetchFeed();
  }, [router]);

  return (
<div className="max-w-2xl mx-auto space-y-4">
      <div className="mb-5 mt-2">
        <h1 className="text-3xl font-pixel font-bold leading-none">
          Home Feed
        </h1>

        {currentUser && (
          <p className="mt-1 text-sm font-outfit opacity-70 truncate">
            of {" "}
            <Link
              href={`/users/${currentUser}`}
              className="hover:underline font-medium"
              style={{ color: "var(--accent)" }}
            >
              @{currentUser}
            </Link>
            🎃
          </p>
        )}
      </div>

      {posts.length === 0 && (
        <div
          className="rounded-lg border p-6 text-center"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)"
          }}
        >
          <p className="font-outfit font-medium">No posts in your feed yet.</p>
          <p className="mt-2 text-sm opacity-70">
            Create a post or follow people from Explore to fill your Home feed.
          </p>
        </div>
      )}

      {posts?.map((post) => (
        <div key={post._id} className="space-y-1">
          <div className="flex justify-between items-center text-xs mt-8">
            <Link
              href={`/users/${post.userId}`}
              className="font-outfit font-medium hover:underline text-sm"
            >
              @{post.userId}
            </Link>
            <p className="opacity-60">
              {new Date(post.createdAt).toLocaleString()}
            </p>
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
              <p className="text-sm opacity-70 font-outfit font-medium mb-3">
                Tags: {post.tags.join(", ")}
              </p>
            )}

            {currentUser !== post.userId && <SaveButton postId={post._id} className="ml-auto mb-1" />}
          </div>
        </div>
      ))}
    </div>
  );
}
