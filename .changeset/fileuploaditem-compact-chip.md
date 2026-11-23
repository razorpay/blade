---
'@razorpay/blade': patch
---

feat(FileUploadItem): compact 32px file chip for ChatInput attachments

The private `_isCompact` option of `FileUploadItem` now renders a one-line chip that is as wide as its file name. Names longer than 120px end in an ellipsis. The chip shows the file name and ×, which cancels an upload or removes the file. A failed file also gets a retry button before × when `onReupload` is set, so ChatInput's `onFileReupload` keeps working, and × stays so a failed file can always be removed. While a file uploads, a thin loader runs along the bottom, with no size or percentage. Why an upload failed shows in a Tooltip on hover or keyboard focus on web, and on tap on React Native.

Only ChatInput uses `_isCompact`, so ChatInput's attachments change look too. `FileUpload`, and `FileUploadItem` without `_isCompact`, look the same as before, and no props changed.
