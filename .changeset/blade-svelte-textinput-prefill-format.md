---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): format prefilled TextInput values that already carry delimiters, and re-format when `format` arrives after mount

A `value`/`defaultValue` that already contains delimiters (e.g. `"4111 1111 1111 1111"`) is now stripped before formatting, so it renders as the full grouped number instead of losing digits to the delimiter slots. An uncontrolled TextInput whose `format` prop is set after mount (e.g. once card network detection resolves) now re-formats the text already in the field instead of blanking it.
