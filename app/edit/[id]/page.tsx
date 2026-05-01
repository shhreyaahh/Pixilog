"use client";

import { ReactEventHandler, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPost() {

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {

    const fetchPost = async () => {

      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category || "");
      setTags(data.tags?.join(", ") || "");

    };

    fetchPost();

  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {

    e.preventDefault();

    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        content,
        category,
        tags: tags.split(",").map(t => t.trim())
      })
    });

    router.push("/diary");

  };

  return (

    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Edit Post
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={6}
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border p-2 rounded"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 border rounded"
        >
          Save Changes
        </button>

      </form>

    </div>

  );

}