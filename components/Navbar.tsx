"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import {
  Home,
  Search,
  Book,
  Plus,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("token")));
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }

  async function deleteAccount() {
    const confirmed = confirm(
      "Delete your Pixilog account permanently?\nThis cannot be undone."
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    const res = await fetch("/api/users/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/register";
    } else {
      alert("Failed to delete account.");
    }
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b backdrop-blur-md overflow-visible"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--text)",
        }}
      >
        <Link href="/dashboard">
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Pixilog ✨
          </h1>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3 overflow-visible">
          {isAuthenticated && (
            <>
              <Link href="/diary">Diary</Link>
              <Link href="/new">New Post</Link>
              <Link href="/explore">Explore</Link>
            </>
          )}

          <button onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {isAuthenticated && (
            <div className="relative" ref={desktopMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopMenuOpen(!desktopMenuOpen);
                }}
                className="px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm hover:opacity-80"
                style={{
                  backgroundColor: "var(--button)",
                  color: "var(--button-text)",
                }}
              >
                Account <ChevronDown size={16} />
              </button>

              {desktopMenuOpen && (
                <div
                  className="absolute right-0 mt-2 z-[9999] w-44 rounded-lg border shadow-lg overflow-hidden"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 hover:opacity-80 cursor-pointer"
                    style={{ color: "var(--text)" }}
                  >
                    Logout
                  </button>

                  <button
                    onClick={deleteAccount}
                    className="w-full text-left px-4 py-3 text-red-500 hover:opacity-80 border-t cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile top-right */}
        <div className="flex md:hidden items-center gap-2 overflow-visible">
          <button onClick={toggleTheme}>
            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          {isAuthenticated && (
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                <LogOut size={22} />
              </button>

              {mobileMenuOpen && (
                <div
                  className="absolute right-0 mt-3 z-[9999] w-44 rounded-lg border shadow-lg overflow-hidden"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 cursor-pointer"
                    style={{ color: "var(--text)" }}
                  >
                    Logout
                  </button>

                  <button
                    onClick={deleteAccount}
                    className="w-full text-left px-4 py-3 text-red-500 border-t cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom mobile navbar */}
      {isAuthenticated && (
        <div
          className="fixed bottom-0 left-0 z-50 w-full flex justify-around py-3 border-t md:hidden"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--text)",
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
        >
          <Link href="/dashboard"><Home size={24} /></Link>
          <Link href="/explore"><Search size={24} /></Link>
          <Link href="/new"><Plus size={24} /></Link>
          <Link href="/diary"><Book size={24} /></Link>
        </div>
      )}
    </>
  );
}