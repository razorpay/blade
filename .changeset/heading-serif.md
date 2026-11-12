---
'@razorpay/blade': minor
'@razorpay/blade-plugin': minor
'@razorpay/blade-mcp': patch
---

feat(Heading): add `isSerif` for the agentic dashboard hero heading

- `<Heading size="2xlarge" isSerif />` renders in PT Serif (regular weight, Latin subset, ~14.5 KB WOFF2). TypeScript only allows it with `size="2xlarge"` and regular weight.
- `fonts.css` declares PT Serif plus a size-adjusted Georgia fallback to keep layout shift minimal. Browsers only download the font on pages that render a serif heading.
- Adds a `serif` font family token, reserved for this heading. Web only for now; on React Native `isSerif` is ignored with a dev warning.
- Blade agent plugin: new `serif-guard` hook. When an agent's edit adds `isSerif` or the raw `serif` font token, it asks the agent to undo the change or mark the agentic dashboard hero heading with a `blade-allow-serif` comment.
