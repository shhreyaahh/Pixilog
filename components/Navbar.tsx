"use client";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { Home, Search, Book, Plus, Moon, Sun, LogOut } from "lucide-react";

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <nav
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ backgroundColor: "var(--card)", color: "var(--text)" }}
    >
      <Link href="/dashboard">
        <h1 className="text-4xl font-pixel font-bold mb-10">
          Pixilog ✨
        </h1>
      </Link>

      <div className="flex gap-3">
        <Link
          href="/diary"
          className="px-3 py-1 border rounded hover:opacity-80"
          style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}
        >
          Diary
        </Link>

        <Link
          href="/new"
          className="px-3 py-1 border rounded hover:opacity-80"
          style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}
        >
          New Post
        </Link>

        <Link
          href="/explore"
          className="px-3 py-1 border rounded hover:opacity-80"
          style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}
        >
          Explore
        </Link>
        <Link
          href="/saved"
          className="px-3 py-1 border rounded hover:opacity-80"
          style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}
        >
          Saved
        </Link>

        <button
          onClick={toggleTheme}
          className="px-3 py-1 border rounded hover:opacity-80"
          style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}
        >
          Theme: {theme}
        </button>

        <button onClick={logout}>
          Logout
    </button>
      </div>
    </nav>
  );
}
