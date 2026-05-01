"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload.username);
      } catch (e) {
        console.error("Token decode error", e);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    fetch(`/api/users?search=${query}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setFollowing(data.followingIds || []);
      });
  }, [query]);

  const handleFollowToggle = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const isFollowing = following.includes(userId);

    await fetch(
      isFollowing ? "/api/users/unfollow" : "/api/users/follow",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (isFollowing) {
      setFollowing(following.filter((id) => id !== userId));
    } else {
      setFollowing([...following, userId]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-6">
      <h1 className="text-3xl font-pixel font-bold mb-6">
        All Users
      </h1>

      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded border mb-6"
        style={{
          backgroundColor: "var(--input)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      />

      <div className="space-y-3">
        {users
          .filter((user) => user.username !== currentUser)
          .map((user) => {
            const isFollowing = following.includes(user._id);

            return (
              <div
                key={user._id}
                className="p-4 rounded-lg border shadow-sm flex items-center justify-between gap-3"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card)",
                }}
              >
                <Link
                  href={`/users/${user.username}`}
                  className="font-outfit font-medium hover:underline"
                >
                  @{user.username}
                </Link>

                <button
                  onClick={() => handleFollowToggle(user._id)}
                  className="px-3 py-1 rounded border text-sm font-outfit font-medium"
                  style={{
                    backgroundColor: isFollowing
                      ? "var(--input)"
                      : "var(--button)",
                    borderColor: "var(--border)",
                    color: isFollowing
                      ? "var(--text)"
                      : "var(--button-text)",
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}