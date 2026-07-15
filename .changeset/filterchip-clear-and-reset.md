---
"@razorpay/blade": minor
---

feat(FilterChip): honour `showClearButton`, add group-level Reset support, and improve multi-select value display

- `FilterChipSelectInput` & `FilterChipDatePicker`: now respect the `showClearButton` prop (default `true`). Set `showClearButton={false}` to hide the clear (cross) button for filters that must always hold a value.
- `FilterChipGroup`: added `clearButtonText` (custom label, e.g. `"Reset"`) and `clearButtonBehavior` (`'clear' | 'reset'`). In `'reset'` mode the group fires `onClearButtonClick` without emptying the chips, so controlled consumers can restore their own defaults from a single group-level action.
- Multi-select filter chips now show the selected option's name when exactly one option is selected (instead of a redundant `1` counter) and collapse to a compact counter only when more than one option is selected.
