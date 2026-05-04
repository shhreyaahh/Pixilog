"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  isPublic?: boolean;
  authorUsername?: string;
  userId?: string;
  image?: string | null;   
};

export default function DiaryPage() {
  const [tab, setTab] = useState("diary"); // "diary" or "saved"
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        if (tab === "diary") {
          const res = await fetch("/api/posts/my", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setPosts(data);
          }
        } else {
          const res = await fetch("/api/posts/saved", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setSavedPosts(data.savedPosts || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tab]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this post?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setPosts(posts.filter((p) => p._id !== id));
    }
  };

  const currentPosts = tab === 'diary' ? posts : savedPosts;
  const filteredPosts = currentPosts.filter((post) => {
    const q = query.toLowerCase();

    const matchesSearch =
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.tags?.join(" ").toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-2 md:gap-4 mb-6">
        <button
  onClick={() => setTab('diary')}
  className={`px-6 py-2 rounded font-pixel font-semibold transition border
  ${tab === 'diary'
    ? 'text-white shadow-lg'
    : 'hover:bg-gray-100 dark:hover:bg-gray-300'}`}
  style={{
    backgroundColor: tab === 'diary' ? 'var(--diary-accent)' : '',
    borderColor: tab === 'diary' ? 'var(--diary-accent)' : 'var(--border)',
    color: tab === 'diary' ? '#fff' : ''
  }}
>
  Diary
</button>

<button
  onClick={() => setTab('saved')}
  className={`px-6 py-2 rounded font-pixel font-semibold transition border
  ${tab === 'saved'
    ? 'text-white shadow-lg'
    : 'hover:bg-gray-100 dark:hover:bg-gray-300'}`}
  style={{
    backgroundColor: tab === 'saved' ? 'var(--saved-accent)' : '',
    borderColor: tab === 'saved' ? 'var(--saved-accent)' : 'var(--border)',
    color: tab === 'saved' ? '#fff' : ''
  }}
>
  Saved
</button>
      </div>

      {/* Title + mobile dropdown */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixel font-bold">
          {tab === 'diary' ? 'My Diary' : 'Saved Pins'}
        </h1>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="md:hidden border rounded px-2 py-1 text-sm font-outfit"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--text)",
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search your diary..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded border mb-6 font-outfit font-medium"
        style={{
          backgroundColor: "var(--input)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      />

      {loading && <p>Loading...</p>}

      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="opacity-70 font-pixel font-medium">
            No matching entries found.
          </p>
        </div>
      )}

<div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post._id}>
            <div className="flex justify-end">
              <div className="text-sm opacity-60">
                {new Date(post.createdAt).toLocaleString()}
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

              <div className="mt-2">
                {tab === 'saved' && (
                  <Link
                    href={`/users/${post.authorUsername || post.userId}`}
                    className="text-sm text-gray-500 font-outfit font-medium hover:underline"
                  >
                    by @{post.authorUsername || post.userId || "Unknown"}
                  </Link>
                )}

                {tab === 'diary' && (
                  <div className="flex gap-4">
                    <a
                      href={`/new?id=${post._id}`}
                      className="text-blue-500 text-sm font-outfit font-medium"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 text-sm font-outfit font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
