---
"@razorpay/blade": patch
---

fix(Tabs): align filled variant border-radius and small label font-size with Figma spec

- `filled` + `horizontal` container/pill border-radius for `small` and `medium` now match the latest Figma spec (container: `small` token, pill: `xsmall` token — previously `large`/`medium` and `medium`/`small`).
- `filled` + `horizontal` + `small` label now renders at `12px` (`Text size="small"`) instead of `14px`, matching Figma. All other Tabs variant/size/orientation combinations are unaffected.
- `filled` + `horizontal` + `small` container height is now pinned to `32px` and the tab item height to `24px` (previously derived from padding + line-height, which under-shot the spec by a few pixels). Left/right container padding for this combination remains the `spacing.1` (`2px`) token, unchanged.
- `filled` + `horizontal` container left/right padding is now `spacing.2` (`4px`) for every size, matching `SegmentedControl`'s `containerPadding` token. `small` previously used a more compact `spacing.1` (`2px`) inset.
