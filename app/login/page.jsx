"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/register";

      const body = isLogin
        ? {
            username:
              formData.username || formData.email,
            password: formData.password,
          }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          router.push("/dashboard");
        } else {
          setSuccess(
            "Account created! Please login."
          );

          setIsLogin(true);

          setFormData({
            username: "",
            email: "",
            password: "",
          });
        }
      } else {
        setError(
          data.message ||
            "Something went wrong"
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
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <h1
          className="text-3xl font-bold text-center mb-5"
          style={{
            fontFamily:
              "var(--font-pixel)",
          }}
        >
          {isLogin
            ? "Welcome Back! ✨"
            : "Join Pixilog 📝"}
        </h1>

        
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              style={inputStyle}
              required
            />
          )}

          <input
            type="text"
            name={
              isLogin
                ? "username"
                : "email"
            }
            placeholder={
              isLogin
                ? "Username or Email"
                : "Email"
            }
            value={
              isLogin
                ? formData.username
                : formData.email
            }
            onChange={handleChange}
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            style={inputStyle}
            required
          />

          {isLogin && (
            <a
              href="/forgot-password"
              className="text-sm text-right underline -mt-1"
              style={{
                color: "var(--accent)",
              }}
            >
              Forgot Password?
            </a>
          )}

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
            className="p-3 rounded-lg font-bold mt-2 transition"
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
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p
            className="opacity-70 mb-2"
            style={{
              color:
                "var(--muted-text)",
            }}
          >
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>

          <button
            onClick={() => {
              setIsLogin(!isLogin);

              setError("");
              setSuccess("");

              setFormData({
                username: "",
                email: "",
                password: "",
              });
            }}
            className="underline font-bold"
            style={{
              color:
                "var(--accent)",
            }}
          >
            {isLogin
              ? "Register here"
              : "Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}