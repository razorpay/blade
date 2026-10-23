## Component Name

CounterInput

## Description

CounterInput picks a whole number between `min` and `max` with minus and plus buttons beside a typed number: a quantity in a cart, a number of guests, seats or tickets. It comes in four sizes and two emphases, clamps every step and typed value to its range, disables each button at its end, and shows a loading bar while a change is being saved (`isLoading`).

## Important Constraints

- `value` is a number; bind it with `bind:value` (no `defaultValue`); unset, it starts at `min`
- `onChange` receives `{ name, value }` on a step or a typed change
- `min` defaults to 0; `max` is unbounded unless set. A step or typed value outside the range is clamped, and the minus or plus button disables at its end
- `isLoading` and `isDisabled` both stop the buttons and disable the field; loading also draws a bar along the bottom edge
- `label` is a plain string, always above the box; without one, name it with `accessibilityLabel`
- It has no help or error text
- `size` is `xsmall`, `small`, `medium` (default) or `large` (28, 32, 36, 48px tall); `emphasis` is `subtle` (default) or `intense`

## Props

```typescript
interface CounterInputProps {
  /** Plain text above the box. */
  label?: string;
  /** Names the field when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Bindable count. @default `min` */
  value?: number;
  /** A step or typed change: `{ name, value }`. */
  onChange?: (change: { name: string | undefined; value: number }) => void;
  /** @default 0 */
  min?: number;
  /** No upper bound when unset. */
  max?: number;
  /** The key the app's form submits the count under. */
  name?: string;
  /** @default false */
  isDisabled?: boolean;
  /** A change is being saved: no input, and a bar along the bottom. @default false */
  isLoading?: boolean;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** 28, 32, 36 or 48px tall. @default 'medium' (or BladeProvider's `size`) */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** @default 'subtle' */
  emphasis?: 'subtle' | 'intense';
}
```

## Guidelines

- Set `max` from stock or a policy limit so the plus button disables there.
- Set `isLoading` while a cart update is in flight, so the user can't step past what the server has.
- Use `size="small"` or `"xsmall"` inside dense rows (a cart line), `medium` in forms.
- Don't use CounterInput for large or free numbers (an amount): use TextInput `type="number"`.

## Examples

### Quantity in a cart

```svelte
<script lang="ts">
  import { CounterInput, Text } from '@razorpay/blade-svelte/components';

  let quantity = $state(1);
  let isSaving = $state(false);

  async function save({ value }: { name: string | undefined; value: number }): Promise<void> {
    isSaving = true;
    await fetch('/api/cart', { method: 'POST', body: JSON.stringify({ quantity: value }) });
    isSaving = false;
  }
</script>

<div class="flex items-center justify-between gap-blade-4">
  <Text weight="semibold">Cotton T-shirt</Text>
  <CounterInput
    bind:value={quantity}
    accessibilityLabel="Quantity"
    min={1}
    max={10}
    size="small"
    isLoading={isSaving}
    onChange={save}
  />
</div>
```

### Sizes and emphases

```svelte
<script lang="ts">
  import { CounterInput } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-wrap items-end gap-blade-6">
  <CounterInput label="Adults" value={2} min={1} max={9} />
  <CounterInput label="Children" value={0} max={6} emphasis="intense" />
  <CounterInput label="Rooms" value={1} min={1} size="large" />
  <CounterInput label="Unavailable" value={3} isDisabled />
</div>
```
