---
'@razorpay/blade': patch
---

fix(Table): vertically centre the TableEditableDropdownCell trigger with its icons

- Inside a TableEditableDropdownCell, the SelectInput/AutoComplete trigger already occupies the full input height (36px) and the tag slot is clamped to that height. The slot's 4px vertical padding pushed the trigger 4px down and clipped it, so the selected value and the placeholder sat 4px below the leading icon, validation icon and chevron. The tag slot no longer adds vertical padding inside a table editable cell.
- No change to row height, and no change to SelectInput/AutoComplete outside tables.
