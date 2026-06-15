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
