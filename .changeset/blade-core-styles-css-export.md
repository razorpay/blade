---
"@razorpay/blade-core": minor
---

feat: add `./styles.css` export for extracted component styles

Consumers can now import the full extracted stylesheet via `@razorpay/blade-core/styles.css`.
This replaces the import-time `document.head.appendChild` side effect with a pure CSS file
that consumers import once, enabling per-component tree-shaking of style JS modules.
