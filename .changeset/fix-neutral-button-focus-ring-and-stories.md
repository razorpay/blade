---
'@razorpay/blade-core': patch
'@razorpay/blade-svelte': patch
---

fix(Button): use `interactive.border.neutral.faded` for the neutral variant's focus ring instead of the shared blue ring used by primary/positive/negative

fix: correct several Button Storybook stories where Controls didn't drive the rendered output (hardcoded `asChild` demos, dead `variant`/`color` controls on loading-matrix stories)
