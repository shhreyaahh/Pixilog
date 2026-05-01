"use client";
import { useState, useEffect } from 'react';

type SavedPost = {
  _id: string;
};

interface SaveButtonProps {
  postId: string;
  className?: string;
  onSavedChange?: (saved: boolean) => void;
}

export default function SaveButton({ postId, className = "", onSavedChange }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const buttonStyle = saved
    ? {
        backgroundColor: 'var(--save-active-bg)',
        color: 'var(--save-active-text)',
        borderColor: 'var(--save-active-border)',
      }
    : {
        backgroundColor: 'var(--save-idle-bg)',
        color: 'var(--save-idle-text)',
        borderColor: 'var(--save-idle-border)',
      };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
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
          setSaved(data.savedPosts.some((p: SavedPost) => p._id === postId));
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
        const nextSaved = !saved;
        setSaved(nextSaved);
        onSavedChange?.(nextSaved);
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
      style={buttonStyle}
      className={`rounded-md border px px-3.5 py-1.5 text-sm font-outfit font-semibold whitespace-nowrap transition duration-200 hover:brightness-95 dark:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {loading ? 'Saving...' : saved ? 'Saved' : 'Save'}
    </button>
  );
}
