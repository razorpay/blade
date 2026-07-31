---
'@razorpay/blade': patch
---

fix: remove personal email from useTruncationTitle JSDoc

Replaces the personal email address in the JSDoc usage example of `useTruncationTitle.web.tsx` with a generic `user@example.com` to prevent personal emails from leaking in frontend source-map files.
