# Progress

Loading dots, a bar and a ring are one decorative thing — "something is
coming", or how far along it is — so they are one component with a `type`.
A placeholder for loading content is a separate component, Skeleton. It has
no behaviour model behind it: the whole component
(`packages/blade/components/progress/Progress.svelte`) and its
contract (`components/progress/styles.ts`) are style-only; nothing of it is in
the core.

| Prop | Notes |
| --- | --- |
| `type` | Style axis: `dots` (default), `bar`, `ring` |
| `size` | Style axis for dots and ring. A bar takes its width from `class` |
| `accessibilityLabel` | Announces the wait as `role="status"`. Without it the visual is `aria-hidden` — right wherever something else already says "busy" |
| `class`, `testID` | As everywhere |

Dots paint with the current text colour.

## Determinate

`type="bar"` and `type="ring"` take `value`, `min` (0) and `max` (100) and are
a `role="progressbar"`, named by `accessibilityLabel`. The component stays
style-only: it sets `--progress` (the clamped fraction) and its CSS
transition moves the fill, so a value present at mount draws in place. A bar
takes its width from `class`, a ring follows `size`; both paint with the
current text colour. Reacting to completion is the caller's `$effect`.
