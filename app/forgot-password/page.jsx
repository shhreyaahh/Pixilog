"use client";

import { useState } from "react";
import Link from "next/link";

export default function Password() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          data.message ||
            "If an account exists, a reset link has been sent."
        );
        setEmail("");
      } else {
        setError(
          data.message ||
            "Something went wrong."
        );
      }
    } catch (error) {
      setError(
        "Something went wrong. Please try again."
      );
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
    <div className="flex justify-center items-center min-h-[85vh] px-4">
      <div
        className="w-full max-w-md p-8 rounded-2xl border shadow-lg"
        style={{
          backgroundColor:
            "var(--card)",
          borderColor:
            "var(--border)",
        }}
      >
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{
            fontFamily:
              "var(--font-pixel)",
          }}
        >
          Reset Password ✨
        </h1>

        <p
          className="text-center text-sm mb-6 opacity-70"
          style={{
            color:
              "var(--muted-text)",
          }}
        >
          Enter your email and we’ll
          send you a reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            style={inputStyle}
            required
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-500 text-center">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="p-3 rounded-lg font-bold transition"
            style={{
              backgroundColor:
                "var(--button)",
              color:
                "var(--button-text)",
              opacity: loading
                ? 0.7
                : 1,
            }}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="underline font-bold"
            style={{
              color:
                "var(--accent)",
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}