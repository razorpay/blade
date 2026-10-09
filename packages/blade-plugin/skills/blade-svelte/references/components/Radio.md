## Component Name

Radio

## Description

Radio lets users select exactly one option from a small set of mutually exclusive choices, typically 2-5 options with descriptive labels or per-option help text. `RadioGroup`, documented here, owns the selection, label, validation, size and orientation; each `Radio` supplies a `value`, a label and optional help text.

## Important Constraints

- `Radio` only works inside `RadioGroup`; outside a group it renders but can never be selected
- Every `Radio` needs a unique `value` within its group
- Selection state, `name`, validation and required state live on `RadioGroup`; `Radio` accepts only `value`, `children`, `helpText`, `isDisabled` and `size`
- The group's `size` overrides each radio's own `size`
- A checked radio cannot be unchecked by clicking it again
- A disabled `RadioGroup` ignores clicks and does not call `onChange`
- In controlled mode, if `onChange` does not update `value`, the selection snaps back to `value`
- `errorText` renders only when `validationState` is `'error'` and replaces `helpText`
- `RadioGroup` has no `accessibilityLabel` prop; pass a visible `label` so the radiogroup has an accessible name
- Use `bind:this` on a `Radio` to get a `RadioInstance` with a `focus()` method

## TypeScript Types

These are the props the Radio and RadioGroup components accept.

```typescript
type RadioSize = 'small' | 'medium' | 'large';

interface RadioProps extends StyledPropsBlade {
  /**
   * Sets the label text of the Radio.
   * Accepts a string or a snippet.
   */
  children?: Snippet | string;
  /**
   * Help text for the Radio, rendered below the label.
   */
  helpText?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * If `true`, the Radio will be disabled.
   * Merges with the parent `RadioGroup`'s `isDisabled`.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the radio. The parent `RadioGroup`'s size takes precedence.
   *
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * Test ID for the element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

/**
 * Imperative handle exposed via `bind:this={instance}`.
 * Mirrors React's `BladeElementRef` for the Radio component.
 */
interface RadioInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: () => void;
}

/**
 * Payload passed to the `RadioGroup` `onChange` callback when selection changes.
 */
type RadioGroupOnChange = (payload: {
  name: string | undefined;
  value: string;
  event?: Event;
}) => void;

type RadioGroupProps = {
  /** Snippet children (Radio components). */
  children: Snippet;
  /** Help text of the radio group, rendered below the radios. */
  helpText?: string;
  /**
   * Error text of the radio group. Renders when `validationState` is `'error'`.
   * Overrides `helpText`.
   */
  errorText?: string;
  /**
   * Sets the validation state of the radio group.
   * When `'error'`, renders `errorText` and propagates `invalid` to every radio.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after the radio group label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the radio group.
   * Propagates down to all the radios.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the radio group.
   *
   * @default false
   */
  isRequired?: boolean;
  /** Renders the label of the radio group. */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /** Initial value of the radio group (uncontrolled). */
  defaultValue?: string;
  /** Value of the radio group (controlled). Use with `onChange`. */
  value?: string;
  /** The callback invoked when any of the radio's state changes. */
  onChange?: RadioGroupOnChange;
  /**
   * The name of the input field in a radio (useful for form submission).
   * Auto-generated if not provided.
   */
  name?: string;
  /**
   * Size of the radios.
   *
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * Orientation of the radio group.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Wrapping behaviour of the radios in the items container. Useful with
   * `orientation="horizontal"` when the radios (or radio-wrapped cards) should
   * wrap onto multiple lines instead of overflowing.
   *
   * @default 'nowrap'
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Test ID for the element. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Radio` inside `RadioGroup` when exactly one of 2-5 mutually exclusive options must be chosen.
- Use `helpText` on individual radios to explain what each option means, such as settlement timelines.
- Use `necessityIndicator` on `RadioGroup` to show whether a selection is required or optional.
- Use `value` with `onChange={({ value }) => ...}` when other UI depends on the selection; use `defaultValue` when the value is only read on submit.
- Set `name` on `RadioGroup` when the value is submitted with a native form.
- Use `orientation="horizontal"` with `flexWrap="wrap"` for two or three short options.

**Don't**

- Don't use `Radio` when multiple options can be selected; use `CheckboxGroup`.
- Don't use `Radio` for an instant on/off setting; use `Switch`.
- Don't use `Radio` for short 1-2 word options in a compact selector; use `ChipGroup` with `selectionType="single"` or `SegmentedControl`.
- Don't use `Radio` for more than 5 options; use `Dropdown`.
- Don't pass both `value` and `defaultValue` to the same `RadioGroup`; pick controlled or uncontrolled.

## Examples

### Settlement schedule

An uncontrolled group with per-option help text, a required indicator and a disabled option.

```svelte
<script lang="ts">
  import { Radio, RadioGroup } from '@razorpay/blade-svelte/components';

  function handleScheduleChange(name: string | undefined, value: string): void {
    console.log(`${name} changed to ${value}`);
  }
</script>

<RadioGroup
  label="Settlement schedule"
  name="settlement-schedule"
  helpText="Changes apply from the next settlement cycle"
  necessityIndicator="required"
  defaultValue="t2"
  onChange={({ name, value }) => handleScheduleChange(name, value)}
  data-analytics-section="settlement-schedule"
>
  <Radio value="t2" helpText="Standard, no extra fee">T+2 days</Radio>
  <Radio value="t1" helpText="0.15% fee per settlement">T+1 day</Radio>
  <Radio value="instant" helpText="Available after 3 months of activity" isDisabled>
    Instant settlements
  </Radio>
</RadioGroup>
```

### Controlled refund mode with validation

A controlled group with the label on the left that shows an error until the merchant picks an option.

```svelte
<script lang="ts">
  import { Box, Button, Radio, RadioGroup } from '@razorpay/blade-svelte/components';

  let refundSpeed = $state<string | undefined>(undefined);
  let hasSubmitted = $state(false);

  const showError = $derived(hasSubmitted && refundSpeed === undefined);
</script>

<Box className="display-flex flex-col gap-spacing-5">
  <RadioGroup
    label="Refund speed"
    labelPosition="left"
    size="small"
    value={refundSpeed}
    onChange={({ value }) => (refundSpeed = value)}
    validationState={showError ? 'error' : 'none'}
    errorText="Choose how fast refunds should reach customers"
    helpText={refundSpeed ? `Selected: ${refundSpeed}` : 'Applies to all new refunds'}
  >
    <Radio value="normal" helpText="5-7 working days">Normal</Radio>
    <Radio value="optimum" helpText="Instant where the bank supports it">Optimum</Radio>
  </RadioGroup>
  <Button variant="primary" onClick={() => (hasSubmitted = true)}>Save refund settings</Button>
</Box>
```
