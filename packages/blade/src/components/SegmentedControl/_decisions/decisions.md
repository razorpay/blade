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

## API

```jsx
import { SegmentedControl, SegmentedControlItem } from '@razorpay/blade/components';

<SegmentedControl defaultValue="daily" label="Time Period">
  <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
  <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
  <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
</SegmentedControl>;
```

### Props

#### SegmentedControl

```typescript
type SegmentedControlProps = {
  /**
   * The content of the SegmentedControl, accepts `SegmentedControlItem` components.
   */
  children: React.ReactNode;
  /**
   * The controlled selected value.
   */
  value?: string;
  /**
   * The default value when uncontrolled.
   */
  defaultValue?: string;
  /**
   * Callback fired when the selected value changes.
   */
  onChange?: ({ name, value }: { name: string | undefined; value: string }) => void;
  /**
   * The size of the segmented control.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If `true`, the entire segmented control is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Name attribute for form identification.
   */
  name?: string;
  /**
   * Renders the label of the segmented control. Required unless `accessibilityLabel` is provided.
   */
  label?: string;
  /**
   * Accessibility label for the segmented control (required when no visible `label`).
   */
  accessibilityLabel?: string;
  /**
   * Sets the position of the label.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Help text displayed below the segmented control.
   */
  helpText?: string;
  /**
   * Error text displayed when `validationState` is set to 'error'. Overrides `helpText`.
   */
  errorText?: string;
  /**
   * Sets the validation state of the segmented control.
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after the label.
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the required state of the segmented control.
   * @default false
   */
  isRequired?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;
```

#### SegmentedControlItem

```typescript
type SegmentedControlItemProps = {
  /**
   * The unique value for this item.
   */
  value: string;
  /**
   * A leading icon component.
   */
  leading?: IconComponent;
  /**
   * The label content of the item. Optional for icon-only items — `accessibilityLabel` is
   * required in that case.
   */
  children?: React.ReactNode;
  /**
   * Accessibility label for the item. Required when `children` is omitted (icon-only item).
   */
  accessibilityLabel?: string;
  /**
   * If `true`, this item is disabled.
   * @default false
   */
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute;
```

### Examples

#### Icon-only items

```jsx
<SegmentedControl defaultValue="grid" accessibilityLabel="Layout view">
  <SegmentedControlItem value="grid" leading={LayoutIcon} accessibilityLabel="Grid view" />
  <SegmentedControlItem value="list" leading={ListIcon} accessibilityLabel="List view" />
</SegmentedControl>
```

#### Controlled, with validation

```jsx
<SegmentedControl
  label="Billing Cycle"
  value={billingCycle}
  onChange={({ value }) => setBillingCycle(value)}
  validationState={hasError ? 'error' : 'none'}
  errorText="Please select a billing cycle"
  isRequired
>
  <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
  <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
</SegmentedControl>
```

### Accessibility

- Root container uses `role="radiogroup"`, each item uses `role="radio"` with `aria-checked`.
- Only one item is in the tab sequence at a time (`tabIndex=0` on the selected item, or the first enabled item when uncontrolled and unselected); the rest are `tabIndex=-1`.
- Arrow keys (`ArrowRight`/`ArrowDown`/`ArrowLeft`/`ArrowUp`) move focus and selection between enabled items, wrapping at the ends — matching native `radiogroup` behavior.
- `label`/`accessibilityLabel` is mandatory (enforced via the discriminated prop union in `types.ts`) so the group always has an accessible name.

## API Decisions

### `leading` prop naming (not `icon`)

We use `leading` (matching TabItem) because a `trailing` slot is planned for a future iteration (e.g. badge/count indicator). Using `icon` would make future extension inconsistent (`icon` + `trailingIcon`?). The `leading`/`trailing` naming convention allows clean extension without a breaking rename.

### `onChange` signature: `({ name, value })` object pattern

Follows RadioGroup's `onChange` convention so consumers using multiple form fields can identify which field changed. This is consistent with ChipGroup's `({ name, values })` pattern.

### `necessityIndicator` and `isRequired` are separate props

This is the established pattern across all Blade form-field components (RadioGroup, CheckboxGroup, TextInput, etc.). `necessityIndicator` controls the visual label decoration (asterisk or 'optional' text) while `isRequired` drives `aria-required`. They are separate because: (1) some forms show 'optional' on non-required fields rather than asterisks on required ones, (2) design may require hiding the indicator while still enforcing semantic required state for validation libraries.

### Always full-width (no `isFullWidth` prop in v1)

The design spec prescribes SegmentedControl always fills its container — same default as RadioGroup and ChipGroup. Consumers constrain width using `<Box maxWidth="...">` wrapping (established Blade pattern). Adding `isFullWidth` is additive and non-breaking; deferred to a follow-up if usage patterns demonstrate demand.

### `validationState` supports `'error' | 'none'` only

SegmentedControl is a value selector — unlike text inputs, it rarely needs a "success" validation state since there's no user-entered text to validate. Adding `'success'` is additive and non-breaking; deferred to a follow-up.

### Hardcoded 6px border radius for `small` size

Intentional design decision confirmed with the designer. The 6px value sits between `xsmall` (4px) and `small` (8px) token values to achieve the specific visual proportion needed at this size. Documented with a code comment.
