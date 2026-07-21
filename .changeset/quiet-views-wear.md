---
"@razorpay/blade": patch
---

fix(Tabs): align filled variant border-radius and small label font-size with Figma spec

- `filled` + `horizontal` container/pill border-radius for `small` and `medium` now match the latest Figma spec (container: `small` token, pill: `xsmall` token — previously `large`/`medium` and `medium`/`small`).
- `filled` + `horizontal` + `small` label now renders at `12px` (`Text size="small"`) instead of `14px`, matching Figma. All other Tabs variant/size/orientation combinations are unaffected.
- `filled` + `horizontal` + `small` container height is now pinned to `32px` and the tab item height to `24px` (previously derived from padding + line-height, which under-shot the spec by a few pixels). Left/right container padding for this combination remains the `spacing.1` (`2px`) token, unchanged.
- `filled` + `horizontal` + `small` tab item left/right padding is now `spacing.2` (`4px`), down from `spacing.3` (`8px`), matching the updated Figma spec.
- `bordered`/`borderless` + `horizontal` + `small` label now renders at `12px` (`Text size="small"`) instead of `14px`, matching Figma — same treatment as the `filled` variant.
- `bordered`/`borderless` + `horizontal` container height is now pinned to `32px` for `small` and `36px` for `medium` (both variants), matching the `filled` variant's height scale. This pins the `TabList` container height only — individual tab item height is unchanged and continues to hug its content.
