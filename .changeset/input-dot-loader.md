---
'@razorpay/blade': patch
---

feat(TextInput, SearchInput): show `DotLoader` instead of `Spinner` in the trailing slot when `isLoading` is set

Small and xsmall inputs use the 18px loader; medium and large use the 24px loader. On web the loader is now exposed with `role="status"` instead of `role="progressbar"`, so tests that query the loading indicator by role need updating.
