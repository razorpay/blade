## Component Name

Radio

## Description

RadioGroup asks one question with a few mutually exclusive answers, each a `Radio` with a label: a delivery speed, an account type, how to pay. The group is the form field: it binds the picked Radio's `value`, reports `onChange({ name, value })`, carries the label, help and error lines, and sets every Radio's size (`small`, `medium`, `large`) and the `vertical` or `horizontal` layout. A Radio can carry its own help text under its title.

## Important Constraints

- A `Radio` only works inside a `RadioGroup`; the value, `name`, size and validation live on the group
- `value` is a string on both: the group's `value` is the picked Radio's `value`. There is no `defaultValue`: pass the initial value or bind it
- `onChange` gets `{ name, value }`, never the DOM event
- The Radio's label is `children` (a snippet that receives `{ isChecked, isDisabled }`); one without `children` needs `accessibilityLabel`
- Radio has no style props and no `trailing` slot; the group's `size` and `orientation` decide the look
- The arrows move the pick and the group is one tab stop: the browser's radio behaviour
- Horizontal radios wrap onto more lines when they run out of room

## Props

```typescript
type RadioGroupSize = 'small' | 'medium' | 'large';

interface RadioGroupProps {
  /** The visible label above the radios. */
  label?: string;
  /** After the label: `*` or `(optional)`; `required` also marks the group required. @default 'none' */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** The picked Radio's `value`: initial, bound, or host-driven. */
  value?: string;
  /** A user pick. */
  onChange?: (change: { name: string | undefined; value: string }) => void;
  /** Registers the group with the app's form (`adapters.form`); the radios share it. */
  name?: string;
  /** Disables every Radio. @default false */
  isDisabled?: boolean;
  /** The app's form blocks submission until a radio is picked. @default false */
  isRequired?: boolean;
  /** Omit inside a form to mirror its error; pass it to own the state. */
  validationState?: 'none' | 'error';
  /** The line under the radios while the state is `none`. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** Names the group when there is no visible `label`. */
  accessibilityLabel?: string;
  /** On the group; each Radio's input gets `${testID}-${index}`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Every Radio's size, and the label's and hint's: circles 12, 16 or 20px. @default 'medium' (or BladeProvider's `size`) */
  size?: RadioGroupSize;
  /** The Radios. */
  children: Snippet;
}

interface RadioProps {
  /** What the group's `value` becomes when this radio is picked. */
  value: string;
  /** This radio only. @default false */
  isDisabled?: boolean;
  /** Under the title, lined up with it; describes the radio. */
  helpText?: string | Snippet;
  /** Names the radio when there are no `children`. */
  accessibilityLabel?: string;
  /** Lands on the input; else the group's `${testID}-${index}`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The label; receives `{ isChecked, isDisabled }`. */
  children?: Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
}
```

## Guidelines

- Use RadioGroup for a few exclusive answers that should all be visible; use SegmentedControl for a compact switch between views or values, ChipGroup for short tags, and CardGroup for checkout's card-style options.
- Bind `value` on the group, or read `onChange`'s `value`.
- Give the group a `label` (or `accessibilityLabel`) that asks the question.
- Use `orientation="horizontal"` only for short labels.
- Use a Radio's `helpText` for a detail about that one answer and the group's `helpText` for the question.
- Don't set `size` on a Radio: set it on the group.

## Examples

### A vertical group with help text

```svelte
<script lang="ts">
  import { Radio, RadioGroup } from '@razorpay/blade-svelte/components';

  let method = $state('qr');
</script>

<RadioGroup bind:value={method} label="Pay via" helpText="You can change this later">
  <Radio value="qr">QR code</Radio>
  <Radio value="web" helpText="Redirects to your bank">Bank website</Radio>
  <Radio value="app" isDisabled>Bank app (unavailable)</Radio>
</RadioGroup>
```

### Horizontal and small

```svelte
<script lang="ts">
  import { Radio, RadioGroup } from '@razorpay/blade-svelte/components';
</script>

<RadioGroup
  label="Settlement"
  orientation="horizontal"
  size="small"
  value="daily"
  onChange={({ value }) => console.log('Settle', value)}
>
  <Radio value="daily">Daily</Radio>
  <Radio value="weekly">Weekly</Radio>
  <Radio value="monthly">Monthly</Radio>
</RadioGroup>
```

### Required, with an error

```svelte
<script lang="ts">
  import { Button, Radio, RadioGroup } from '@razorpay/blade-svelte/components';

  let accountType = $state<string | undefined>(undefined);
  let submitted = $state(false);
</script>

<div class="flex flex-col items-start gap-blade-4">
  <RadioGroup
    bind:value={accountType}
    name="accountType"
    label="Account type"
    necessityIndicator="required"
    isRequired
    validationState={submitted && !accountType ? 'error' : 'none'}
    errorText="Pick an account type"
  >
    <Radio value="savings">Savings</Radio>
    <Radio value="current">Current</Radio>
  </RadioGroup>
  <Button onClick={() => (submitted = true)}>Continue</Button>
</div>
```
