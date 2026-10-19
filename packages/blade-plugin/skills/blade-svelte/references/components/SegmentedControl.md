## Component Name

SegmentedControl

## Description

SegmentedControl picks one value from a few short options drawn as one joined pill with a sliding thumb: an EMI tenure, a period, a view. It is a radio group to the browser and the app's form (it binds `value`, reports `onChange({ name, value })`, and takes RadioGroup's label, hint and validation props), in three sizes (`small`, `medium`, `large`) and two colours (`neutral` over a light surface, `white` over a brand-coloured pane). Each `SegmentedControlItem` has a label, an optional `leading` icon or asset and a `trailing` Counter or Badge; a segment with no label (an icon or a `leading` snippet alone) is named by `accessibilityLabel`.

## Important Constraints

- `SegmentedControlItem`s go directly inside `SegmentedControl`; the segments share the row equally
- It picks a value and has no panels: for switching content panes with tab semantics use Tabs
- `value` is a string; there is no `defaultValue`. `onChange` gets `{ name, value }`
- `leading` is an icon source (16px, 20px at `large`) or a snippet with an asset in the icon's box; `trailing` is a snippet (a Counter or Badge). Both snippets and `children` receive `{ isChecked, isDisabled }`
- A segment with no label (a `leading` icon or snippet and no `children`) needs `accessibilityLabel`
- The arrows move the pick and the control is one tab stop: the browser's radio behaviour
- Name the control with `label` or `accessibilityLabel`

## Props

```typescript
type SegmentedControlSize = 'small' | 'medium' | 'large';
type SegmentedControlColor = 'neutral' | 'white';

interface SegmentedControlProps {
  /** The visible label above the control. */
  label?: string;
  /** After the label: `*` or `(optional)`; `required` also makes the pick required. @default 'none' */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** The picked segment's `value`: initial, bound, or host-driven. */
  value?: string;
  /** A user pick. */
  onChange?: (change: { name: string | undefined; value: string }) => void;
  /** Registers the control with the app's form (`adapters.form`) under this key. */
  name?: string;
  /** Disables every segment. @default false */
  isDisabled?: boolean;
  /** @default false */
  isRequired?: boolean;
  /** Omit inside a form to mirror its error; pass it to own the state. */
  validationState?: 'none' | 'error';
  /** The line under the segments while the state is `none`. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** Names the control when there is no visible `label`. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** Track 28, 36 or 48px tall. @default 'medium' (or BladeProvider's `size`) */
  size?: SegmentedControlSize;
  /** `white`: for a brand-coloured pane, as Button's `white`. @default 'neutral' */
  color?: SegmentedControlColor;
  /** The SegmentedControlItems. */
  children: Snippet;
}

interface SegmentedControlItemProps {
  /** What the control's `value` becomes when this segment is picked. */
  value: string;
  /** Before the label: an icon, or a snippet with an asset (a logo, an avatar) that receives the segment's state. */
  leading?: IconSource | Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
  /** After the label: a Counter or a Badge. */
  trailing?: Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
  /** This segment only. @default false */
  isDisabled?: boolean;
  /** Names an icon-only segment. */
  accessibilityLabel?: string;
  /** Lands on the radio input. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The label text; receives `{ isChecked, isDisabled }`. */
  children?: Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
}
```

## Guidelines

- Use SegmentedControl for a few short, equal options; use RadioGroup for longer answers and Tabs when each option shows its own panel of content.
- Bind `value`, or read `onChange`'s `value`.
- Keep labels to a word or two; the segments are equal width.
- Use `color="white"` only on a brand-coloured surface.
- Name icon-only segments with `accessibilityLabel`.
- Don't put an icon in `children`: use `leading`.

## Examples

### Pick a tenure

```svelte
<script lang="ts">
  import { SegmentedControl, SegmentedControlItem } from '@razorpay/blade-svelte/components';

  let tenure = $state('3');
</script>

<SegmentedControl bind:value={tenure} label="EMI tenure" helpText="No-cost EMI on 3 and 6 months" class="max-w-96">
  <SegmentedControlItem value="3">3 months</SegmentedControlItem>
  <SegmentedControlItem value="6">6 months</SegmentedControlItem>
  <SegmentedControlItem value="9" isDisabled>9 months</SegmentedControlItem>
  <SegmentedControlItem value="12">12 months</SegmentedControlItem>
</SegmentedControl>
```

### Icons, icon-only segments and a counter

```svelte
<script lang="ts">
  import { Counter, SegmentedControl, SegmentedControlItem } from '@razorpay/blade-svelte/components';
  import { BankIcon, CreditCardIcon, PhoneIcon } from '@razorpay/blade-svelte/icons';

  let method = $state('card');
  let view = $state('card');
</script>

<div class="flex flex-col gap-blade-4">
  <SegmentedControl bind:value={method} accessibilityLabel="Pay with" size="small">
    <SegmentedControlItem value="card" leading={CreditCardIcon} accessibilityLabel="Card" />
    <SegmentedControlItem value="bank" leading={BankIcon} accessibilityLabel="Netbanking" />
    <SegmentedControlItem value="upi" leading={PhoneIcon} accessibilityLabel="UPI" />
  </SegmentedControl>

  <SegmentedControl bind:value={view} accessibilityLabel="Saved methods">
    <SegmentedControlItem value="card" leading={CreditCardIcon}>Cards</SegmentedControlItem>
    <SegmentedControlItem value="upi" leading={PhoneIcon}>
      UPI
      {#snippet trailing()}<Counter value={3} size="small" />{/snippet}
    </SegmentedControlItem>
  </SegmentedControl>
</div>
```

### White, on a brand-coloured pane

```svelte
<script lang="ts">
  import { SegmentedControl, SegmentedControlItem } from '@razorpay/blade-svelte/components';

  let period = $state('month');
</script>

<div class="rounded-medium bg-interactive-primary-default p-blade-5">
  <SegmentedControl
    bind:value={period}
    color="white"
    accessibilityLabel="Period"
    onChange={({ value }) => console.log('Period', value)}
  >
    <SegmentedControlItem value="week">Week</SegmentedControlItem>
    <SegmentedControlItem value="month">Month</SegmentedControlItem>
    <SegmentedControlItem value="year">Year</SegmentedControlItem>
  </SegmentedControl>
</div>
```
