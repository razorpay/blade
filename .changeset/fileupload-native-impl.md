---
"@razorpay/blade": minor
---

feat(blade): add React Native implementation for FileUpload component

### Platform differences

**`onChange` semantics:** On web, `onChange` fires after the user picks files and passes the selected `fileList`. On React Native, `onChange` fires when the user taps the upload area as a tap signal — `fileList` is always `[]` at tap time. Consumers must open their own file picker (e.g. `react-native-document-picker`) inside the callback and manage `fileList` themselves. The shared `onChange` type does not encode this difference at compile time; see JSDoc on the prop for native usage.

**Built-in validation (`accept`, `maxCount`, `maxSize`):** On web, these props are enforced internally (file-type filtering, count limits, size limits with inline error messages). On React Native they have no effect — validation must be handled by the consumer in the `onChange` callback and via their file picker configuration.

**Not supported on React Native:** `ref` (no `forwardRef` — there is no hidden input to attach to), `_motionMeta` (motion ref wiring is web-only), and `data-analytics-*` / `elementtiming` props (on web these are attached to the hidden file input). Passing `_motionMeta` or analytics props emits a `__DEV__` warning on native.
