"use client";

import { useState } from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";

export default function ResetPasswordForm() {
  const searchParams =
    useSearchParams();

  const router = useRouter();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (!token) {
      setError(
        "Invalid reset link."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (res.ok) {
        setSuccess(
          data.message ||
            "Password reset successful!"
        );

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
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
    backgroundColor:
      "var(--input)",
    color: "var(--text)",
    borderColor:
      "var(--border)",
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
          New Password ✨
        </h1>

        <p
          className="text-center text-sm mb-6 opacity-70"
          style={{
            color:
              "var(--muted-text)",
          }}
        >
          Enter your new password
          below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={
              confirmPassword
            }
            onChange={(e) =>
              setConfirmPassword(
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
              ? "Updating..."
              : "Reset Password"}
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