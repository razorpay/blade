# Usecase Critique

Challenge whether the change needs to exist at all. If the feature is clearly justified with no reasonable alternative, skip it.

Look for:

- **Redundant props** — a new prop that duplicates what existing props already express (e.g. `intent="positive"` when `color="positive"` already achieves it)
- **Unnecessary abstraction** — a new component or variant that could be composed from existing primitives
- **Workarounds for missing docs** — the feature exists but isn't documented, so the author added a new API instead
- **Overfitting to one caller** — the change is shaped around a single specific use case rather than a general need
- **Props that fight the design system** — escape hatches (custom colors, sizes, styles) that undermine design token consistency

For each concern report: file, line, severity, what the redundancy or alternative is, and what to do instead or verify.
