---
'@razorpay/blade': patch
---

fix(Table): vertically centre the TableEditableDropdownCell trigger with its icons

- Inside a `TableEditableDropdownCell`, the `SelectInput` / `AutoComplete` trigger is height constrained by the input's tag slot, whose 4px vertical padding pushed the trigger down and out of the row. The selected value and the placeholder sat 4px below the leading icon, validation icon and chevron in the resting, error and open states.
- The tag slot now keeps its vertical padding off inside a table editable cell, so the value, placeholder, leading icon, validation icon and chevron share one vertical centre in all states. Row height is unchanged and dropdown inputs outside a table are unaffected. A multi selection (which collapses to a "N Selected" text) keeps its existing spacing.
