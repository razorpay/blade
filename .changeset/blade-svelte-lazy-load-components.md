---
"@razorpay/blade-svelte": major
---

feat: lazy-load heavy sub-components to reduce bundle size

ActionListItem (Checkbox), AppBar (Tooltip), BaseButton (Avatar/AvatarGroup), and
BaseInputVisuals (Tooltip) now dynamically import their heavy sub-components only when
needed, reducing the main bundle for consumers who don't use those features.

SearchInput and TextInput retain a static Spinner import to ensure immediate loading feedback.

Also adds `sideEffects` field to package.json and includes error handling for all dynamic imports.

**Known behavior change:** Components with lazy-loaded sub-components have a two-phase render
in CSR. In SSR, lazy-loaded sub-components will not render (the parent degrades gracefully).
This is an acceptable trade-off for the bundle size savings.
