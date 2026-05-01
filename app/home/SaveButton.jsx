"use client";
import { useState, useEffect } from 'react';

export default function SaveButton({ postId, className = "" }) {

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const checkSaved = async () => {
      if (!token) return;

      try {
        const res = await fetch(`/api/posts/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setSaved(data.savedPosts.some(p => p._id === postId));
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkSaved();

  }, [postId, token]);

  const toggleSave = async () => {
    if (!token) return;
    setLoading(true);
    const url = saved ? '/api/posts/unsave' : '/api/posts/save';
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ postId })
      });

      if (res.ok) {
        setSaved(!saved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm font-medium transition-all border
        ${saved ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-600'} ${className}`}
    >
      {loading ? '...' : saved ? 'Saved ✓' : 'Save'}
    </button>
  );
}
