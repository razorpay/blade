# SegmentedControl: Design Decisions

## Why a separate component instead of extending Tabs?

The Tabs decisions doc anticipated SegmentedControl as a potential no-panel use-case of Tabs' filled variant. We chose to implement it as a separate component for the following reasons:

### ARIA Semantics

- **Tabs** use `role="tablist"` + `role="tab"` with `aria-controls` pointing to `tabpanel` elements. The tab pattern implies content panels that are shown/hidden.
- **SegmentedControl** uses `role="radiogroup"` + `role="radio"` with `aria-checked`. This pattern represents a value selection within a form, not content switching.

Screen readers announce these fundamentally differently. A tab says "tab, 1 of 3, selected"; a radio says "radio button, checked". Using the wrong ARIA pattern would confuse assistive technology users about the interaction model.

### Form Integration

SegmentedControl is a form field — it supports `label`, `helpText`, `errorText`, `validationState`, `necessityIndicator`, and `isRequired`, following the same pattern as RadioGroup and ChipGroup. Tabs are not form fields.

### API Surface

SegmentedControl's API is simpler (no TabPanel, no lazy loading, no vertical orientation, no bordered/borderless variants). Extending Tabs with a `variant="segmented"` would either:

- Require awkward prop restrictions (no `isVertical`, no `children` of type `TabPanel`)
- Or create a confusing API where some props work only with certain variants

A dedicated component with a clean, purpose-built API is clearer for consumers.

---

## API Decisions

### `leading` prop naming (not `icon`)

We use `leading` (matching TabItem) because a `trailing` slot is planned for a future iteration (e.g. badge/count indicator). Using `icon` would make future extension inconsistent (`icon` + `trailingIcon`?). The `leading`/`trailing` naming convention allows clean extension without a breaking rename.

### `onChange` signature: `({ name, value })` object pattern

Follows RadioGroup's `onChange` convention so consumers using multiple form fields can identify which field changed. This is consistent with ChipGroup's `({ name, values })` pattern.

### `necessityIndicator` and `isRequired` are separate props

This is the established pattern across all Blade form-field components (RadioGroup, CheckboxGroup, TextInput, etc.). `necessityIndicator` controls the visual label decoration (asterisk or 'optional' text) while `isRequired` drives `aria-required`. They are separate because: (1) some forms show 'optional' on non-required fields rather than asterisks on required ones, (2) design may require hiding the indicator while still enforcing semantic required state for validation libraries.

### Always full-width (no `isFullWidth` prop in v1)

The design spec prescribes SegmentedControl always fills its container — same default as RadioGroup and ChipGroup. Consumers constrain width using `<Box maxWidth="...">` wrapping (established Blade pattern). Adding `isFullWidth` is additive and non-breaking; deferred to a follow-up if usage patterns demonstrate demand.

### No `StyledPropsBlade` in v1

Deferred to a follow-up after v1 stabilizes. Adding it is additive and non-breaking. SegmentedControl's primary use case is full-width form fields where direct layout props are less relevant. We'll evaluate after initial adoption.

### `validationState` supports `'error' | 'none'` only

SegmentedControl is a value selector — unlike text inputs, it rarely needs a "success" validation state since there's no user-entered text to validate. Adding `'success'` is additive and non-breaking; deferred to a follow-up.

### Hardcoded 6px border radius for `small` size

Intentional design decision confirmed with the designer. The 6px value sits between `xsmall` (4px) and `small` (8px) token values to achieve the specific visual proportion needed at this size. Documented with a code comment.
