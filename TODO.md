# Mobile Spacing Fix Plan - User Profile Pages

## Status: [COMPLETED ✅]

### 1. Information Gathered

**Profile pages analyzed:**

- `app/users/[username]/page.jsx` - Mobile: `pb-24 md:pb-6 md:p-10`, card padding `p-4 md:p-6`
- `app/profile/[username]/page.jsx` - Mobile: `max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-6`
- `app/users/[username]/followers/page.jsx` - Mobile: `max-w-xl mx-auto p-10 pb-24 md:pb-6`
- `app/users/[username]/following/page.jsx` - Same as followers
- **Pattern:** Inconsistent `p-10`, `px-4 py-8`, `p-4 md:p-6` across mobile

**CSS (globals.css):** No mobile-specific padding overrides. Uses Tailwind responsive classes.

**Other pages (fixed):** Use consistent `max-w-2xl mx-auto p-4 pb-24 md:pb-6`

### 2. Plan

**Standardize ALL profile pages to match fixed pages:**

```
Mobile: p-4 pb-24 (top/bottom nav safe)
Desktop: p-10 pb-6 (generous but not excessive)
Container: max-w-2xl mx-auto
Cards: p-4 md:p-6 (smaller mobile touch target)
Header gaps: gap-4 md:gap-6
```

**Files to update:**

1. `app/users/[username]/page.jsx`
   - Container: `pb-24 md:pb-6 md:p-10` → `p-4 pb-24 md:pb-6`
   - Header gap: `gap-4 md:gap-6` ✓ (keep)
   - Card padding: `p-4 md:p-6` ✓ (keep)

2. `app/profile/[username]/page.jsx`
   - Container: `max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-6` → `max-w-2xl mx-auto p-4 pb-24 md:pb-6`
   - Header gap: `gap-6` → `gap-4 md:gap-6`

3. `app/users/[username]/followers/page.jsx` & `following/page.jsx`
   - Container: `max-w-xl mx-auto p-10 pb-24 md:pb-6` → `max-w-2xl mx-auto p-4 pb-24 md:pb-6`
   - List items: `border p-3 rounded mb-2` ✓ (keep)

### 3. Dependent Files

- None (pure Tailwind class changes)

### 4. Followup Steps

1. User approves plan
2. Create TODO.md with steps
3. Sequential edit_file for each page
4. Test: `npm run dev` → check `/users/shhreyaah_` on mobile viewport
5. Verify: Navbar bottom safe-area, content padding consistent

**Please confirm or suggest changes before I proceed with edits!**
