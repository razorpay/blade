---
"@razorpay/blade": minor
---

feat(blade): add React Native implementation for FileUpload component

### Platform differences

**`onChange` / `onUploadPress` semantics:** On web, `onChange` fires after the user picks files and passes the selected `fileList`. On React Native, tapping the upload area fires **`onUploadPress` only** — use it to open your own file picker (e.g. `react-native-document-picker`). FileUpload does **not** fire `onChange` on tap; update `fileList` yourself after the picker returns. Prefer controlled mode (`fileList` + updating it after the picker resolves). `onUploadPress` is typed with `Platform.Select` so it is native-only.

**Built-in validation (`accept`, `maxCount`, `maxSize`):** On web, these props are enforced internally (file-type filtering, count limits, size limits with inline error messages). On React Native they have no effect — validation must be handled by the consumer after the picker returns.

**`labelPosition`:** On web, `labelPosition="left"` renders the label beside the upload area. On React Native, labels always render above the upload area; `labelPosition="left"` is ignored with a `__DEV__` warning.

**`ref`:** Supported on native via `forwardRef`, but attaches to the outer container `BaseBox` (not a hidden file input as on web).

**Not supported on React Native:** `_motionMeta` (motion ref wiring is web-only), `onDrop` (no drag-and-drop), and `data-analytics-*` / `elementtiming` props (on web these are attached to the hidden file input). Passing unsupported props emits a `__DEV__` warning on native.

**Types:** `BladeFile` is platform-split (`bladeFile.ts` / `bladeFile.web.ts`). Web still extends the DOM `File` API; native is a plain object (`type` is optional because pickers may omit MIME types). Callbacks (`onPreview` / `onRemove` / `onReupload` / `onDismiss`) take `{ file: BladeFile }`.
