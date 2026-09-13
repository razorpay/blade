---
'@razorpay/blade-mcp': minor
---

feat(knowledgebase): sync component docs with Blade component types

- Add docs for `ColorInput`, `AppBar`, `BottomBar`, `SegmentedControl`, `TrustBadge` and `SankeyChart`
- Add `TableEditableDropdownCell`, `FileUploadItem`, `CollapsibleText` and `ChartReferenceBand` to their parent docs
- Remove props that do not exist in code (e.g. `DatePicker` `locale`, `AutoComplete` `filter`, `FileUpload` `successText`) and fix wrong values (e.g. `DatePicker` `picker`, `Carousel` `navigationButtonVariant`)
- Add missing props and values (e.g. `xsmall` and `small` input sizes, `labelSuffix` and `labelTrailing`)
- Replace undefined types in docs with concrete types and fix type blocks that did not parse
