## Component Name

CounterInput

## Description

CounterInput is a numeric field with built-in minus and plus buttons and manual typing, for small integer quantities such as item counts, subscription seats or retry attempts. It clamps values to `min` and `max`, disables the matching button at each limit, and has a loading state for async updates. It works controlled or uncontrolled, in four sizes and two emphasis levels.

## Important Constraints

- Values are integers that change by 1; typed input is parsed with `parseInt` and clamped to `min`/`max`
- `min` defaults to `0`; the uncontrolled value starts at `defaultValue`, or `min` when `defaultValue` is not set
- Empty or non-numeric typed input resets the value to `min`
- `isLoading` and `isDisabled` both block the buttons and typing, and `onChange` is not called
- In controlled mode the displayed value only changes when you update `value` from `onChange`
- `onFocus` and `onBlur` receive the value as a string (`{ name, value }`), while `onChange` receives a number (`{ value }`)
- `labelPosition="left"` applies only at 768px and wider; smaller screens fall back to `top`
- CounterInput has no help text, error text or validation state

## TypeScript Types

These are the props the CounterInput component accepts.

```typescript
/**
 * Visual emphasis of the `CounterInput`.
 */
type CounterInputEmphasis = 'subtle' | 'intense';

/**
 * Size of the `CounterInput`.
 */
type CounterInputSize = 'xsmall' | 'small' | 'medium' | 'large';

/**
 * Payload passed to the `onChange` callback when the value changes.
 */
type CounterInputOnChange = (args: { value: number }) => void;

interface CounterInputProps extends StyledPropsBlade {
  /**
   * Label to be shown for the counter input. Rendered inside a native `<label>`.
   */
  label?: string;
  /**
   * Accessibility label for the input (optional override). Exposed to screen readers
   * on the underlying spinbutton input.
   */
  accessibilityLabel?: string;
  /**
   * Position of the label relative to the counter. `left` only applies on desktop
   * (≥768px); it falls back to `top` on smaller screens.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * The name of the input field (useful for form submission).
   */
  name?: string;
  /**
   * The numerical value of the counter input. Passing this makes the component controlled.
   */
  value?: number;
  /**
   * The default numerical value when the component is uncontrolled.
   */
  defaultValue?: number;
  /**
   * Minimum allowed value. When reached, the decrement button is disabled.
   *
   * @default 0
   */
  min?: number;
  /**
   * Maximum allowed value. When reached, the increment button is disabled.
   * If not provided, the increment button is never disabled by an upper bound.
   */
  max?: number;
  /**
   * Visual emphasis of the counter input.
   *
   * @default 'subtle'
   */
  emphasis?: CounterInputEmphasis;
  /**
   * Size of the counter input.
   *
   * @default 'medium'
   */
  size?: CounterInputSize;
  /**
   * Shows a loading indicator and disables interaction.
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * If `true`, the counter input is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Called when the value changes via increment, decrement, or manual input.
   */
  onChange?: CounterInputOnChange;
  /**
   * Called when the input receives focus.
   * Receives `{ name, value }` matching the React `FormInputOnEvent` signature.
   */
  onFocus?: (args: { name?: string; value?: string; rawValue?: string }) => void;
  /**
   * Called when the input loses focus.
   * Receives `{ name, value }` matching the React `FormInputOnEvent` signature.
   */
  onBlur?: (args: { name?: string; value?: string; rawValue?: string }) => void;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string | undefined;
}
```

## Usage Guidelines

**Do**

- Use `CounterInput` for small integer quantities, typically under 100, such as team seats or payment retry attempts.
- Always set sensible `min` and `max` values so the buttons disable at the limits.
- Use `isLoading` while an async update (for example a cart or seat-count API call) is in flight, and update `value` only after it succeeds.
- Give every CounterInput a `label`; use `accessibilityLabel` when the visible label is elsewhere, such as a table column header.
- Use `size="xsmall"` or `size="small"` inside tables and cart rows; use `medium` or `large` for standalone form fields.
- Use `emphasis="intense"` only for the primary quantity on a page; keep secondary counters `subtle`.

**Don't**

- Don't use `CounterInput` for large numbers; use `TextInput` with `type="number"`.
- Don't use `CounterInput` for decimals, currency or amounts; use `TextInput` for entry and `Amount` for display.
- Don't use `CounterInput` for values that are not quantities, such as IDs or phone numbers; use `TextInput` or `PhoneNumberInput`.
- Don't pass both `value` and `defaultValue`; pick controlled or uncontrolled.

## Examples

### Subscription seats with async save

A controlled counter that shows a loading state while the new seat count is saved, and keeps the old value if the request fails.

```svelte
<script lang="ts">
  import { Box, CounterInput, Text } from '@razorpay/blade-svelte/components';

  let seats = $state(5);
  let isSaving = $state(false);
  let saveError = $state('');

  async function updateSeats({ value }: { value: number }): Promise<void> {
    isSaving = true;
    saveError = '';
    try {
      const response = await fetch('/api/subscription/seats', {
        method: 'PUT',
        body: JSON.stringify({ seats: value }),
      });
      if (!response.ok) throw new Error('Request failed');
      seats = value;
    } catch {
      saveError = 'Could not update seats. Try again.';
    } finally {
      isSaving = false;
    }
  }
</script>

<Box className="display-flex flex-col gap-spacing-3">
  <CounterInput
    label="Dashboard seats"
    name="seats"
    value={seats}
    min={1}
    max={50}
    isLoading={isSaving}
    onChange={updateSeats}
    data-analytics-section="subscription-seats"
  />
  {#if saveError}
    <Text size="small" color="feedback.text.negative.intense">{saveError}</Text>
  {/if}
</Box>
```

### Compact uncontrolled counters

Small, uncontrolled counters with left labels for payment retry settings, including a disabled field.

```svelte
<script lang="ts">
  import { Box, CounterInput } from '@razorpay/blade-svelte/components';

  function logChange(field: string, value: number): void {
    console.log(`${field} set to ${value}`);
  }
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <CounterInput
    label="Retry attempts"
    labelPosition="left"
    size="small"
    defaultValue={3}
    min={1}
    max={5}
    onChange={({ value }) => logChange('retries', value)}
  />
  <CounterInput
    label="Retry interval (hours)"
    labelPosition="left"
    size="small"
    emphasis="intense"
    defaultValue={6}
    min={1}
    max={24}
    onBlur={({ value }) => logChange('interval', Number(value))}
  />
  <CounterInput label="Max refunds per day" labelPosition="left" size="small" defaultValue={10} isDisabled />
</Box>
```
