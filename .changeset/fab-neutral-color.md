---
"@razorpay/blade": minor
"@razorpay/blade-mcp": minor
---

feat(FloatingActionButton): rename the dark color from `black` to `neutral` and align it with the neutral button tokens

`<FloatingActionButton color="black" />` becomes `<FloatingActionButton color="neutral" />`. The dark FAB is now the same treatment as a filled `neutral` button — it reads its surface from `interactive.background.neutral.*` and its label, icon and spinner from `interactive.*.onNeutral.*`, so it inverts with the theme instead of always being black on white. The hover surface is now slightly translucent and the disabled surface is lighter, matching the updated design.

On focus, the filled `neutral` surface now draws its ring from `interactive.border.neutral.faded` instead of the faded primary blue used everywhere else, matching the design.

`color="black"` was never exposed on `Button` and has no consumers, so it is removed rather than deprecated.
