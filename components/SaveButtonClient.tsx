"use client";
import { useState, useEffect } from 'react';

interface SaveButtonProps {
  postId: string;
  className?: string;
}

export default function SaveButton({ postId, className = "" }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

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
    const checkSaved = async () => {
      if (!token) return;
      try {
        const res = await fetch(`/api/posts/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSaved(data.savedPosts.some((p:any) => p._id === postId));
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
      style={buttonStyle}
      className={`rounded-md border px px-3.5 py-1.5 text-sm font-outfit font-semibold whitespace-nowrap transition duration-200 hover:brightness-95 dark:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {loading ? 'Saving...' : saved ? 'Saved' : 'Save'}
    </button>
  );
}
