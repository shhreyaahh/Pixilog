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
  const [existingImage, setExistingImage] = useState("");

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
      setExistingImage(data.image || "");

    };

    loadPost();

  }, [postId]);

  // SUBMIT POST
  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const cleanedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    let res;

    if (postId) {
      res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags: cleanedTags,
          isPublic
        })
      });
    } else {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("isPublic", String(isPublic));

      if (image) {
        formData.append("image", image);
      }

      res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
    }

    if (res.ok) {

      alert("Post saved!");
      router.push("/diary");

    } else {

      alert("Error saving post");

    }

    setLoading(false);

  }

return ( <div className="w-full max-w-full overflow-x-hidden">


  <form
    onSubmit={handleSubmit}
    className="w-full max-w-3xl mx-auto p-5 md:p-8 rounded-lg shadow-md border"
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
      className="w-full min-w-0 p-3 mb-4 rounded border"
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
      className="w-full min-w-0 p-3 mb-4 rounded border"
      style={{
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
      required
    />


    <input
  type="text"
  placeholder="Tags (optional) • travel, food, memories"
  value={tags}
  onChange={(e) => setTags(e.target.value)}
  className="w-full min-w-0 p-3 mb-4 rounded border"
  style={{
    backgroundColor: "var(--input)",
    borderColor: "var(--border)",
    color: "var(--text)"
  }}
/>


    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full min-w-0 p-3 mb-6 rounded border"
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

      {postId && existingImage && (
  <div className="mb-4">
    <p className="text-sm mb-2 opacity-70">Current image</p>

    <img
      src={existingImage}
      alt=""
      className="w-full max-h-[320px] object-cover rounded-lg border"
      style={{ borderColor: "var(--border)" }}
    />
  </div>
)}

<input
  type="file"
  accept="image/*"
  className="w-full max-w-full mb-2"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  }}
/>

{postId && (
  <p className="text-sm opacity-70 mb-4">
    Choose a new image only if you want to replace the current one.
  </p>
)}


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
