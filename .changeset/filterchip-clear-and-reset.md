---
"@razorpay/blade": minor
---

feat(FilterChip): honour `showClearButton`, add group-level Reset support, and improve multi-select value display

- `FilterChipSelectInput` & `FilterChipDatePicker`: now respect the `showClearButton` prop (default `true`). Set `showClearButton={false}` to hide the clear (cross) button for filters that must always hold a value.
- `FilterChipGroup`: added a group-level **Reset** action alongside the existing **Clear** action. `onResetButtonClick` renders a Reset link that fires a single callback WITHOUT emptying the chips (so controlled consumers can restore their own defaults), while `onClearButtonClick`/`showClearButton` keep the existing empty-everything behaviour. Both actions can be shown together, and each has an optional custom label (`resetButtonText` / `clearButtonText`).
- Multi-select filter chips now show the selected option's name when exactly one option is selected (instead of a redundant `1` counter) and collapse to a compact counter only when more than one option is selected.

**⚠️ Behavioral/visual change (no API break):** in `selectionType="multiple"`, a single selection previously always rendered a `Counter` (showing `1`) and now renders the option name as text. This changes the chip's rendered content, width, and layout for the single-selection case, and can shift layouts for existing consumers without any code change on their side. There is no code/type break and no opt-out prop today, so consumers who need the old always-counter rendering should pin the previous version until they've verified their layouts. If demand exists we can add an explicit display-mode prop in a follow-up.
