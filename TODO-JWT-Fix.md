# JWT Token Errors Fix Plan

## Steps:

- [x] Step 1: Edit pixilog/app/api/posts/my/route.js (fix filter + error handling)
- [x] Step 2: Edit pixilog/app/api/posts/saved/route.js (add error handling)
- [x] Step 3: Edit pixilog/app/api/posts/save/route.js (add error handling)
- [x] Step 4: Edit pixilog/app/api/posts/unsave/route.js (add error handling)
- [x] Step 5: Test APIs after restart and fresh login
- [x] Step 6: Complete task

**CORRECTION**: Reverted diary query to `decoded.username` (matches Post.userId: String schema)

**✅ FULLY FIXED**
