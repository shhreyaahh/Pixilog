# TODO: Light Mode Border Visibility Fix

**Approved Plan**: Change `--border: #bdb65f` → `--border: #8b7d6b` (darker brown, high contrast).

## Breakdown:

- [x] Create TODO.md with steps
- [x] Edit `pixilog/app/globals.css` (light mode --border)
- [x] Restart dev server `cd pixilog && npm run dev`
- [x] Test /explore users/posts borders, /home
- [x] Update TODO, attempt_completion

**Status**: ✅ COMPLETE! Added Tailwind `border` → `var(--border)` mapping in tailwind.config.js. Restart dev server.
