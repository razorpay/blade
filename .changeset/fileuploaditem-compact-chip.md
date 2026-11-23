---
'@razorpay/blade': patch
---

feat(FileUploadItem): compact 32px file chip for ChatInput attachments

The private `_isCompact` option of `FileUploadItem` now renders a one-line chip that is as wide as its file name. Names longer than 120px end in an ellipsis. The chip shows the file name and a single ×, which cancels an upload or removes the file. A failed file has no retry button: people remove it and attach it again. While a file uploads, a thin loader runs along the bottom, with no size or percentage. Why an upload failed shows in a Tooltip on hover or keyboard focus on web, and on tap on React Native.

Only ChatInput uses `_isCompact`, so ChatInput's attachments change too. Files there no longer show a size or a Reupload button, so ChatInput's `onFileReupload` has no button for now. `FileUpload`, and `FileUploadItem` without `_isCompact`, look the same as before, and no props changed.
