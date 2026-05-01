"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NewPostForm() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Food");

  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  // LOAD POST IF EDITING
  useEffect(() => {

    if (!postId) return;

    const loadPost = async () => {

      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category || "Food");
      setTags(data.tags?.join(", ") || "");
      setIsPublic(data.isPublic || false);

    };

    loadPost();

  }, [postId]);

  // SUBMIT POST
  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("isPublic", String(isPublic));

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {

      alert("Post saved!");

      if (isPublic) {
        router.push("/explore");
      } else {
        router.push("/diary");
      }

    } else {

      alert("Error saving post");

    }

    setLoading(false);

  }

return ( <div className="min-h-screen pb-20 md:p-10">


  <form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto p-5 md:p-8 rounded-lg shadow-md border"
    style={{
      backgroundColor: "var(--card)",
      borderColor: "var(--border)"
    }}
  >

    <h1 className="text-3xl font-pixel font-medium mb-8">
      New Entry
    </h1>


    <input
      type="text"
      placeholder="Title..."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full p-3 mb-4 rounded border"
      style={{
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
      required
    />


    <textarea
      placeholder="Write your thoughts..."
      rows={6}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className="w-full p-3 mb-4 rounded border"
      style={{
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
      required
    />


    <input
      type="text"
      placeholder="Tags (comma separated)"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      className="w-full p-3 mb-4 rounded border"
      style={{
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
    />


    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-3 mb-6 rounded border"
      style={{
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
    >
      <option>Food</option>
      <option>Beauty</option>
      <option>Clothes</option>
      <option>Travel</option>
      <option>Study</option>
      <option>Personal</option>
    </select>

      <input
  type="file"
  accept="image/*"
  onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) setImage(file);
}}
/>


    <label className="flex items-center gap-2 mb-4 mt-4">
      <input
        type="checkbox"
        checked={isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      Make this entry public 
    </label>


    <button
      type="submit"
      disabled={loading}
      className="px-5 py-2 rounded text-xl font-pixel font-bold"
      style={{
        backgroundColor: "var(--button)",
        color: "var(--button-text)",
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? "Saving..." : "Save Post"}
    </button>

  </form>
</div>

);
}

export default function NewPost() {
  return (
    <Suspense fallback={null}>
      <NewPostForm />
    </Suspense>
  );
}
