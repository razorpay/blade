## Component Name

Chip

## Description

ChipGroup is a choice drawn as a row of wrapping chips: one pick (`selectionType="single"`, native radios) or several (`"multiple"`, checkboxes), for short options like a business type, filters or capabilities. The group is the form field: it binds `value` (a string, or an array with `multiple`), reports `onChange({ name, value })`, carries the label, help and error lines, and sets every chip's `size` (`xsmall` to `large`) and picked `color` (`primary`, `positive`, `negative`). Each `Chip` has a label and an optional `leading` icon or asset.

## Important Constraints

- A `Chip` only works inside a `ChipGroup`; the value, `name`, `size` and validation live on the group
- `value` is a string per Chip; the group's `value` is the picked chip's value, or an array of them with `selectionType="multiple"`. There is no `defaultValue`
- `onChange` gets `{ name, value }`, `value` shaped as `bind:value` (an array with `multiple`, `null` when nothing is picked in `single`)
- The label is `children` (a snippet that receives `{ isChecked, isDisabled }`); it is optional with a `leading`, and a chip without one needs `accessibilityLabel`
- `leading` is an icon source (sized and tinted by the chip) or a snippet with an asset (an Avatar, a flag) that receives the chip's state
- A single-choice group picks as the arrows move; in a multiple group each chip is its own tab stop
- A Chip's `color` and `isDisabled` fall back to the group's; size is the group's only

## Props

```typescript
type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';
type ChipColor = 'primary' | 'positive' | 'negative';

interface ChipGroupProps {
  /** The visible label above the chips. */
  label?: string;
  /** Names the group when there is no visible `label`. */
  accessibilityLabel?: string;
  /** `single`: radios. `multiple`: checkboxes, and `value` is an array. @default 'single' */
  selectionType?: 'single' | 'multiple';
  /** The picked chip's value, or an array with `multiple`: initial, bound, or host-driven. */
  value?: string | readonly string[] | null;
  /** A user pick; `value` is shaped as `bind:value`. */
  onChange?: (change: { name: string | undefined; value: string | null | string[] }) => void;
  /** Registers the group with the app's form (`adapters.form`) under this key. */
  name?: string;
  /** Disables every chip. @default false */
  isDisabled?: boolean;
  /** @default false */
  isRequired?: boolean;
  /** After the label: `*` or `(optional)`; `required` also requires. @default 'none' */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** Omit inside a form to mirror its error; pass it to own the state. */
  validationState?: 'none' | 'error';
  /** The line under the chips while the state is `none`. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`; it replaces the help text. */
  errorText?: string | Snippet;
  /** On the root; each Chip gets `${testID}-${index}`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** Every chip's size. @default 'small' (or BladeProvider's `size`) */
  size?: ChipSize;
  /** The picked chips' colour; a Chip's own `color` wins. @default 'primary' */
  color?: ChipColor;
  /** The Chips, and anything else between them. */
  children: Snippet;
}

interface ChipProps {
  /** What the chip stands for in the group's value. */
  value: string;
  /** The label; optional with a `leading`. Receives `{ isChecked, isDisabled }`. */
  children?: Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
  /** Before the label: an icon, or a snippet with an Avatar or a flag that receives the chip's state. */
  leading?: IconSource | Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
  /** Picked colour. @default the group's */
  color?: ChipColor;
  /** @default the group's */
  isDisabled?: boolean;
  /** Names a chip with no label (a `leading` alone); required then. */
  accessibilityLabel?: string;
  /** On the chip; else the group's `${testID}-${index}`. */
  testID?: string;
  /** Placement only, width limits included. */
  class?: string;
}
```

## Guidelines

- Use ChipGroup for short, scannable options and filters; use RadioGroup or CardGroup when the options need longer labels or descriptions.
- Bind `value` on the group; use `selectionType="multiple"` for filters and multi-picks.
- Keep chip labels to a word or two.
- Give the group a `label`, or an `accessibilityLabel` when the question is clear from context.
- Use `color="positive"` or `"negative"` only when the pick carries that meaning.
- Don't put an icon in the label: use `leading`.

## Examples

### Single choice

```svelte
<script lang="ts">
  import { Chip, ChipGroup } from '@razorpay/blade-svelte/components';

  let businessType = $state<string | null>(null);
</script>

<ChipGroup label="Business type" name="businessType" bind:value={businessType} necessityIndicator="required" isRequired>
  <Chip value="proprietorship">Proprietorship</Chip>
  <Chip value="public">Public</Chip>
  <Chip value="small-business">Small Business</Chip>
</ChipGroup>
```

### Multiple choice with icons

```svelte
<script lang="ts">
  import { Chip, ChipGroup } from '@razorpay/blade-svelte/components';
  import { BankIcon, CreditCardIcon, PhoneIcon } from '@razorpay/blade-svelte/icons';

  let methods = $state<string[]>(['upi']);
</script>

<ChipGroup
  label="Accept payments by"
  selectionType="multiple"
  size="medium"
  bind:value={methods}
  onChange={({ value }) => console.log('Methods', value)}
>
  <Chip value="upi" leading={PhoneIcon}>UPI</Chip>
  <Chip value="card" leading={CreditCardIcon}>Cards</Chip>
  <Chip value="bank" leading={BankIcon} isDisabled>Netbanking</Chip>
</ChipGroup>
```

### Colours and an error

```svelte
<script lang="ts">
  import { Chip, ChipGroup } from '@razorpay/blade-svelte/components';

  let feedback = $state<string | null>(null);
</script>

<ChipGroup
  label="How was the checkout?"
  bind:value={feedback}
  validationState={feedback ? 'none' : 'error'}
  errorText="Pick one to continue"
>
  <Chip value="good" color="positive">Smooth</Chip>
  <Chip value="bad" color="negative">Confusing</Chip>
</ChipGroup>
```
