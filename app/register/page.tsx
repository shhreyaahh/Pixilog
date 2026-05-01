"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created");
        router.push("/login");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch {
      alert("Error creating account");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--input)",
    color: "var(--text)",
    borderColor: "var(--border)",
  };

  return (
<div className="flex justify-center items-center min-h-[100dvh] px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-8 rounded-lg border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <h1
          className="text-3xl font-bold text-center"
          style={{
            fontFamily: "var(--font-pixel)",
            color: "var(--text)",
          }}
        >
          Join Pixilog ✨
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 rounded outline-none focus:ring-2 focus:ring-blue-400"
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded outline-none focus:ring-2 focus:ring-blue-400"
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded outline-none focus:ring-2 focus:ring-blue-400"
          style={inputStyle}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="p-3 rounded font-bold transition"
          style={{
            backgroundColor: "var(--button)",
            color: "var(--button-text)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p
          className="text-center text-sm"
          style={{ color: "var(--muted-text)" }}
        >
          Already have an account?
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="underline font-bold"
          style={{ color: "var(--accent)" }}
        >
          Login here
        </button>
      </form>
    </div>
  );
}
