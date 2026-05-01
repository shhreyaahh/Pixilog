//delete on post creation

"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {

    const confirmDelete = confirm("Delete this entry?");
    if (!confirmDelete) return;

    console.log("CLIENT: id received as prop:", id);

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Response data:", data);

    if (res.ok && data.deleted) {
      router.refresh(); // refresh diary page
    } else {
      alert("Delete failed: " + JSON.stringify(data));
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-1 rounded text-sm"
      style={{
        backgroundColor: "var(--button)",
        color: "var(--button-text)"
      }}
    >
      Delete
    </button>
  );
} 