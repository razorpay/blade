---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(FileUpload): add `size="small"` and `showDropAreaText`, and show an upload icon on the upload action

- `size="small"`: a 32px tall drop area with smaller text and corner radius
- `showDropAreaText`: set to `false` to hide the "Drag files here or" text and show only the upload action. Works with `small`, `medium` and `large`, not `variable`

**Visual change for all existing usages:** the "Upload" action inside the drop area now always shows an upload icon and uses neutral colours (dark text and icon, medium weight, still underlined) instead of the blue link, matching the Figma design. No code changes are needed, but snapshot tests that include FileUpload will need updating.

**Fix (web):** `errorText` now shows when `validationState="error"` even if `helpText` isn't set, and screen readers no longer hear "null" in place of the error.
