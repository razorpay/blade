---
'@razorpay/blade': patch
---

feat(ChatInput): show attachments as compact 32px file chips

Files in ChatInput now show as one-line chips that are as wide as their name, instead of 200px cards with the file size. Each chip shows the file name and × to remove it (or cancel its upload). A failed file also gets a retry button when `onFileReupload` is set, and keeps × so it can always be removed. While a file uploads, a thin loader runs along the bottom. Why an upload failed now shows in a Tooltip on hover or keyboard focus on web, and on tap on React Native. Names longer than 120px end in an ellipsis.

This comes from the private `_isCompact` option of `FileUploadItem`, which only ChatInput uses. `FileUpload` and `FileUploadItem` without it look the same as before, and no props changed.
