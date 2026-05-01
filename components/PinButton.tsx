"use client";

import { useRouter } from "next/navigation";

export default function PinButton({ id, isPinned }: { id: string; isPinned: boolean }) {
  const router = useRouter();

  async function handlePin() {
    const res = await fetch(`/api/posts/${id}/pin`, {
      method: "POST",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handlePin}
      className="px-4 py-1 rounded text-sm border"
    >
      {isPinned ? "📌 Pinned" : "📌 Pin"}
    </button>
  );
}

