---
'@razorpay/blade': minor
'@razorpay/blade-plugin': minor
'@razorpay/blade-mcp': patch
---

feat(Heading): add `variant="serif"` for the agentic dashboard hero heading

- `<Heading variant="serif" />` renders in PT Serif at the 2xlarge size and regular weight (Latin subset, ~14.5 KB WOFF2). The variant fixes its own size and weight; passing a different `size` or `weight` throws in dev.
- `fonts.css` declares PT Serif plus a size-adjusted Georgia fallback to keep layout shift minimal. Browsers only download the font on pages that render a serif heading.
- PT Serif is not added to the theme's font family tokens, so it can't be used outside this heading. Web only for now; on React Native the serif variant is ignored with a dev warning.
- Blade agent plugin: the `blade` skill gets a guardrail step. Once an agent finishes its edits, it checks the lines it added for `variant="serif"` and either reverts them or marks the agentic dashboard hero heading with a `blade-allow-serif` comment.
