## Component Name

Checkbox

## Description

Checkbox is a form control for selecting one or more independent options, or for confirming a single binary choice that takes effect on submit (for example "I accept the terms"). It supports checked, unchecked, indeterminate, disabled and error states, with help and error text. `CheckboxGroup`, documented here, wraps several checkboxes with a shared label, validation, size and a managed `string[]` value.

## Important Constraints

- Inside `CheckboxGroup`, a `Checkbox` must not set `validationState`, `name`, `defaultChecked`, `isChecked` or `onChange`; Checkbox logs `[Blade Checkbox]: Cannot set ... on <Checkbox /> when it's inside <CheckboxGroup />` and the group state wins. Set these on the group instead
- Inside `CheckboxGroup`, every `Checkbox` needs a unique `value`; without it Checkbox logs an error and never becomes checked
- Inside `CheckboxGroup`, the group's `size` overrides the checkbox's own `size`
- `errorText` renders only when `validationState` is `'error'` (on the Checkbox or inherited from the group)
- `isIndeterminate` only changes the visual and `aria-checked="mixed"`; it does not change `isChecked`
- A disabled `CheckboxGroup` ignores all toggles and does not call `onChange`
- `CheckboxGroup` requires either `label` or `accessibilityLabel`
- Use `bind:this` to get a `CheckboxInstance` with a `focus()` method

## TypeScript Types

These are the props the Checkbox and CheckboxGroup components accept.

```typescript
type CheckboxSize = 'small' | 'medium' | 'large';

/**
 * Payload passed to the `onChange` callback when a Checkbox toggles.
 */
type CheckboxOnChange = (event: { isChecked: boolean; value?: string; event?: Event }) => void;

/**
 * Payload passed to the CheckboxGroup `onChange` callback.
 */
type CheckboxGroupOnChange = (event: { name: string; values: string[] }) => void;

interface CheckboxProps extends StyledPropsBlade {
  /**
   * If `true`, the checkbox will be checked. This also makes the checkbox controlled.
   * Use `onChange` to update its value.
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked. This also makes the checkbox uncontrolled.
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: CheckboxOnChange;
  /**
   * Sets the label of the checkbox.
   */
  children?: Snippet | string;
  /**
   * Accessible label for the checkbox when no visible `children` label is provided.
   * Mirrors the React `accessibilityLabel` prop.
   */
  accessibilityLabel?: string;
  /**
   * Help text for the checkbox.
   */
  helpText?: string;
  /**
   * Error text for the checkbox.
   *
   * Renders when `validationState` is set to 'error'.
   */
  errorText?: string;
  /**
   * If `true`, the checkbox will be indeterminate.
   * This does not modify the isChecked property.
   *
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * The name of the input field in a checkbox (useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the checkbox will be disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the checkbox input is marked as required, and `required` attribute will be added.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `error`, the checkbox input is marked as invalid, and `invalid` attribute will be added.
   */
  validationState?: 'error' | 'none';
  /**
   * Size of the checkbox.
   *
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * Sets the tab-index property on the checkbox input element.
   */
  tabIndex?: number;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type CheckboxGroupPropsCommon = StyledPropsBlade & {
  /**
   * Accepts multiple checkboxes as children.
   */
  children: Snippet;
  /**
   * Help text of the checkbox group.
   */
  helpText?: string;
  /**
   * Error text of the checkbox group.
   * Renders when `validationState` is set to 'error'. Overrides helpText.
   */
  errorText?: string;
  /**
   * Sets the error state of the CheckboxGroup.
   * If set to `error` it will render the `errorText` of the group,
   * and propagate `invalid` prop to every checkbox.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after CheckboxGroup label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the CheckboxGroup.
   * If set to `true` it propagates down to all the checkboxes.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the CheckboxGroup.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Sets the position of the label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial value of the checkbox group (uncontrolled).
   */
  defaultValue?: string[];
  /**
   * Value of the checkbox group (controlled). Use `onChange` to update its value.
   */
  value?: string[];
  /**
   * The callback invoked when any of the checkbox's state changes.
   */
  onChange?: CheckboxGroupOnChange;
  /**
   * The name of the input field in a checkbox (useful for form submission).
   */
  name?: string;
  /**
   * Size of the checkboxes within the group.
   *
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * Orientation of the checkbox group.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Controls wrapping of the checkbox options container.
   *
   * @default 'nowrap'
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /**
   * Snippet rendered immediately after the group label (e.g. an info tooltip).
   */
  labelSuffix?: Snippet;
  /**
   * Snippet rendered trailing the group label, pushed to the far end (e.g. a link).
   */
  labelTrailing?: Snippet;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};

type CheckboxGroupPropsWithLabel = {
  /** Visible label for the checkbox group. */
  label: string;
  /** Additional accessibility label, rendered as screen-reader-only text alongside the visible label. */
  accessibilityLabel?: string;
};

type CheckboxGroupPropsWithA11yLabel = {
  label?: undefined;
  /** Accessibility label used as the group's accessible name when no visible label is provided. */
  accessibilityLabel: string;
};

type CheckboxGroupProps = (CheckboxGroupPropsWithLabel | CheckboxGroupPropsWithA11yLabel) &
  CheckboxGroupPropsCommon;

/**
 * Imperative handle exposed via `bind:this={instance}`.
 * Mirrors React's `BladeElementRef` for the Checkbox component.
 */
interface CheckboxInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: (options?: FocusOptions) => void;
}
```

## Usage Guidelines

**Do**

- Use `Checkbox` when users can pick several independent options, especially when labels are long or uneven in length.
- Use a single `Checkbox` for a binary choice that needs a separate submit action, such as accepting terms before creating a payment link.
- Use `CheckboxGroup` for related options so label, validation, size and value are managed in one place.
- Keep the group controlled with `value` and `onChange={({ values }) => ...}` when other UI depends on the selection; use `defaultValue` when only the submitted form needs it.
- Use `isIndeterminate` on a "Select all" checkbox when some, but not all, items are selected.
- Pass `accessibilityLabel` when a Checkbox has no visible label, for example a row-selection checkbox in a table.
- Use `orientation="horizontal"` with `flexWrap="wrap"` for short option lists that should sit in one row.

**Don't**

- Don't use `Checkbox` when only one option can be selected from a set; use `RadioGroup`.
- Don't use `Checkbox` for settings that apply instantly without a submit action; use `Switch`.
- Don't use `Checkbox` for compact multi-select filters with short 1-2 word labels; use `ChipGroup` with `selectionType="multiple"`.
- Don't set `isChecked`, `defaultChecked`, `onChange`, `name` or `validationState` on a Checkbox inside a group; set `value`/`defaultValue`, `onChange`, `name` and `validationState` on `CheckboxGroup`.
- Don't pass both `isChecked` and `defaultChecked` to the same Checkbox; pick controlled (`isChecked` + `onChange`) or uncontrolled (`defaultChecked`).

## Examples

### Terms confirmation

A standalone controlled checkbox that gates a submit button and shows an error until it is checked.

```svelte
<script lang="ts">
  import { Box, Button, Checkbox } from '@razorpay/blade-svelte/components';

  let hasAccepted = $state(false);
  let hasSubmitted = $state(false);

  const showError = $derived(hasSubmitted && !hasAccepted);

  function handleSubmit(): void {
    hasSubmitted = true;
  }
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <Checkbox
    name="terms"
    isChecked={hasAccepted}
    onChange={({ isChecked }) => (hasAccepted = isChecked)}
    isRequired
    validationState={showError ? 'error' : 'none'}
    errorText="Accept the terms to activate international payments"
    helpText="You can review the terms in account settings at any time"
    data-analytics-section="international-payments-terms"
  >
    I agree to the international payments terms
  </Checkbox>
  <Button variant="primary" onClick={handleSubmit}>Activate</Button>
</Box>
```

### Payment methods with select all

A controlled `CheckboxGroup` driven by a "Select all" checkbox that turns indeterminate on partial selection.

```svelte
<script lang="ts">
  import { Box, Checkbox, CheckboxGroup } from '@razorpay/blade-svelte/components';

  const methods = [
    { value: 'card', label: 'Cards', helpText: 'Visa, Mastercard, RuPay' },
    { value: 'upi', label: 'UPI', helpText: 'Collect and intent flows' },
    { value: 'netbanking', label: 'Netbanking', helpText: '50+ banks' },
  ];

  let selected = $state<string[]>(['card', 'upi']);

  const allSelected = $derived(selected.length === methods.length);
  const someSelected = $derived(selected.length > 0 && !allSelected);
  const noneSelected = $derived(selected.length === 0);
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <Checkbox
    isChecked={allSelected}
    isIndeterminate={someSelected}
    onChange={({ isChecked }) => (selected = isChecked ? methods.map((m) => m.value) : [])}
  >
    Enable all payment methods
  </Checkbox>
  <CheckboxGroup
    label="Payment methods"
    name="payment-methods"
    necessityIndicator="required"
    value={selected}
    onChange={({ values }) => (selected = values)}
    validationState={noneSelected ? 'error' : 'none'}
    errorText="Select at least one payment method"
    helpText="Customers see only the methods you enable"
  >
    {#each methods as method (method.value)}
      <Checkbox value={method.value} helpText={method.helpText}>{method.label}</Checkbox>
    {/each}
  </CheckboxGroup>
</Box>
```

### Uncontrolled notification preferences

A horizontal, uncontrolled group with a default selection, small size and a label trailing link.

```svelte
<script lang="ts">
  import { Checkbox, CheckboxGroup, Link } from '@razorpay/blade-svelte/components';

  function savePreferences(values: string[]): void {
    console.log('Settlement alerts via', values);
  }
</script>

<CheckboxGroup
  label="Settlement alerts"
  name="settlement-alerts"
  size="small"
  orientation="horizontal"
  flexWrap="wrap"
  defaultValue={['email']}
  onChange={({ values }) => savePreferences(values)}
  necessityIndicator="optional"
>
  {#snippet labelTrailing()}
    <Link size="small" href="https://razorpay.com/docs/settlements/">Learn more</Link>
  {/snippet}
  <Checkbox value="email">Email</Checkbox>
  <Checkbox value="sms">SMS</Checkbox>
  <Checkbox value="whatsapp">WhatsApp</Checkbox>
</CheckboxGroup>
```
