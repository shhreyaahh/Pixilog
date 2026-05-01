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
    <>
      {/* Top Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b backdrop-blur-md"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--text)",
          backdropFilter: "blur(8px)"
        }}
      >
        {/* Logo */}
        <Link href="/dashboard">
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Pixilog ✨
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/diary"
            className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
            style={{
              backgroundColor: "var(--button)",
              color: "var(--button-text)"
            }}
          >
            Diary
          </Link>

          <Link
            href="/new"
            className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
            style={{
              backgroundColor: "var(--button)",
              color: "var(--button-text)"
            }}
          >
            New Post
          </Link>

          <Link
            href="/explore"
            className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
            style={{
              backgroundColor: "var(--button)",
              color: "var(--button-text)"
            }}
          >
            Explore
          </Link>

          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
            style={{
              backgroundColor: "var(--button)",
              color: "var(--button-text)"
            }}
          >
            Theme: {theme}
          </button>

          <button
            onClick={logout}
            className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
            style={{
              backgroundColor: "var(--button)",
              color: "var(--button-text)"
            }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Theme + Logout */}
        <div className="flex md:hidden items-center gap-1 -mr-3">
          <button
            onClick={toggleTheme}
            className="p-3"
          >
{theme === "light" ? <Moon size={24} strokeWidth={1.5} /> : <Sun size={24} strokeWidth={1.5} />}
          </button>

          <button
            onClick={logout}
            className="p-3"
          >
<LogOut size={24} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <div
        className="fixed bottom-0 left-0 w-full flex justify-around py-3 border-t md:hidden backdrop-blur-md"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--text)",
          backdropFilter: "blur(8px)"
        }}
      >
        <Link href="/dashboard" className="p-2" aria-label="Dashboard">
          <Home size={24} strokeWidth={1.5} />
        </Link>
        <Link href="/explore" className="p-2" aria-label="Explore">
          <Search size={24} strokeWidth={2} />
        </Link>
        <Link href="/new" className="p-2" aria-label="New post">
          <Plus size={24} strokeWidth={1.5} />
        </Link>
        <Link href="/diary" className="p-2" aria-label="Diary">
          <Book size={24} strokeWidth={1.5} />
        </Link>
      </div>
    </>
  );
}
