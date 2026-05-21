"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { Home, Search, Book, Plus, Moon, Sun, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    //"This ref points to a div"
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(
      Boolean(localStorage.getItem("token"))
    );
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
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b backdrop-blur-md"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--text)",
          backdropFilter: "blur(8px)"
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

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && (
            <>
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
            </>
          )}

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

          {isAuthenticated ? (
            <div className="relative" ref={desktopMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopMenuOpen(!desktopMenuOpen);
                }}
                className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition flex items-center gap-1"
                style={{
                  backgroundColor: "var(--button)",
                  color: "var(--button-text)"
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
                    className="w-full text-left px-4 py-3 hover:opacity-80 cursor-pointer transition"
                    style={{ color: "var(--text)" }}
                  >
                    Logout
                  </button>

                  <button
                    onClick={deleteAccount}
                    className="w-full text-left px-4 py-3 text-red-500 hover:opacity-80 border-t cursor-pointer transition"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={pathname === "/login" ? "/register" : "/login"}
              className="px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition"
              style={{
                backgroundColor: "var(--button)",
                color: "var(--button-text)"
              }}
            >
              {pathname === "/login" ? "Register" : "Login"}
            </Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1 -mr-3">
          <button onClick={toggleTheme} className="p-3" aria-label="Toggle theme">
            {theme === "light" ? (
              <Moon size={24} strokeWidth={1.5} />
            ) : (
              <Sun size={24} strokeWidth={1.5} />
            )}
          </button>

          {isAuthenticated && (
            <div className="relative" ref={mobileMenuRef}>
              <button onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }} className="p-3" aria-label="Account menu">
                <LogOut size={24} strokeWidth={1.5} />
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
                    className="w-full text-left px-4 py-3 cursor-pointer transition"
                    style={{ color: "var(--text)" }}
                  >
                    Logout
                  </button>

                  <button
                    onClick={deleteAccount}
                    className="w-full text-left px-4 py-3 text-red-500 border-t cursor-pointer transition"
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

      {isAuthenticated && (
        <div
          className="fixed bottom-0 left-0 z-50 w-full flex justify-around py-3 border-t shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--text)",
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
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
      )}
    </>
  );
}
