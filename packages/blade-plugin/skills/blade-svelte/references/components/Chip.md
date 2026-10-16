## Component Name

Chip

## Description

Chip is a compact, selectable pill for short 1-2 word options such as payment method filters or quick feedback answers. Chips always live inside `ChipGroup`, documented here, which sets single (radio-like) or multiple (checkbox-like) selection, size, color, label and validation for all its chips. A chip can show an icon, a label, or both.

## Important Constraints

- `Chip` only works inside `ChipGroup`; outside a group it renders but can never be selected
- Every `Chip` needs a unique `value`; a chip without `value` cannot be toggled
- `children` is required when no `icon` is passed
- Chip size comes only from the group's `size`; `Chip` has no `size` prop
- Chip labels are truncated to one line
- `ChipGroup` passes `isDisabled`, `size`, `color`, `selectionType`, `validationState`, `necessityIndicator` and `name` to its chips once, when it mounts; later changes to these props do not reach the chips. Re-mount the group (for example with `{#key}`) if one of them must change
- `onChange` always receives `values` as a `string[]`, even with `selectionType="single"` (use `values[0]`)
- `value` and `defaultValue` accept a string for single selection and a `string[]` for multiple selection
- A disabled `ChipGroup` ignores clicks and does not call `onChange`
- `ChipGroup` requires either `label` or `accessibilityLabel`
- `icon` only accepts an icon component exported by `@razorpay/blade-svelte/components`

## TypeScript Types

These are the props the Chip and ChipGroup components accept.

```typescript
type ChipColor = 'primary' | 'positive' | 'negative';
type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CreditCardIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type ChipCommonProps = {
  /**
   * Icon component to display in the Chip.
   */
  icon?: IconComponent;
  /**
   * Color variant of the Chip.
   * Overrides the color set by parent ChipGroup.
   */
  color?: ChipColor;
  /**
   * Whether the chip is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /** Value used for selection state tracking. */
  value?: string;
  /** CSS width of the chip container. */
  width?: string;
  /** CSS max-width of the chip container. */
  maxWidth?: string;
  /** CSS min-width of the chip container. */
  minWidth?: string;
  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade;

type ChipWithoutIconProps = ChipCommonProps & {
  icon?: undefined;
  /** Text content for the chip. Required when no icon is provided. */
  children: Snippet;
};

type ChipWithIconProps = ChipCommonProps & {
  icon: IconComponent;
  /** Text content for the chip. Optional when icon is provided. */
  children?: Snippet;
};

type ChipProps = (ChipWithoutIconProps | ChipWithIconProps) & {
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};

type ChipGroupCommonProps = {
  /** Snippet children (Chip components). */
  children: Snippet;
  /**
   * Position of the label relative to the chip group.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /** Help text displayed below the chip group. */
  helpText?: string;
  /** Error text displayed below the chip group when validation fails. */
  errorText?: string;
  /**
   * Validation state of the chip group.
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Necessity indicator displayed after the label.
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** Default selected value(s) for uncontrolled usage. */
  defaultValue?: string | string[];
  /**
   * Whether all chips in the group are disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether selection is required.
   * @default false
   */
  isRequired?: boolean;
  /** Name attribute for form submission. Auto-generated if not provided. */
  name?: string;
  /** Callback fired when selection changes. */
  onChange?: (payload: { name: string; values: string[] }) => void;
  /**
   * Selection behavior: single (radio) or multiple (checkbox).
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Size of the chips in the group.
   * @default 'small'
   */
  size?: ChipSize;
  /**
   * Color variant for all chips in the group.
   * @default 'primary'
   */
  color?: ChipColor;
  /** Controlled value(s). Use with onChange. */
  value?: string | string[];
  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade;

type ChipGroupPropsWithA11yLabel = {
  label?: undefined;
  /** Accessibility label when no visible label is provided. */
  accessibilityLabel: string;
};

type ChipGroupPropsWithLabel = {
  /** Visible label for the chip group. */
  label: string;
  /** Additional accessibility label. */
  accessibilityLabel?: string;
};

type ChipGroupProps = (ChipGroupPropsWithA11yLabel | ChipGroupPropsWithLabel) &
  ChipGroupCommonProps & {
    // Analytics attributes
    [key: `data-analytics-${string}`]: string;
  };
```

## Usage Guidelines

**Do**

- Use `ChipGroup` with `selectionType="single"` for 2-5 mutually exclusive options with short, uniform labels, such as refund amounts or date ranges.
- Use `ChipGroup` with `selectionType="multiple"` for compact filters, such as payment methods on a transactions page.
- Give every group a `label`, or an `accessibilityLabel` when no visible label is shown.
- Use `color="positive"` and `color="negative"` on individual chips only when the choice itself has that meaning, such as Yes/No feedback.
- Add an `icon` when it helps recognition, for example `CreditCardIcon` for a Cards filter.
- Keep the group controlled with `value` and `onChange={({ values }) => ...}` when the selection drives a query or other UI.

**Don't**

- Don't use `Chip` for long or uneven labels; use `RadioGroup` for single selection or `CheckboxGroup` for multiple selection.
- Don't use `Chip` as a read-only label; use `Badge`.
- Don't use `Chip` for 10 or more options; use `Dropdown`.
- Don't use icon-only chips without a visible group label; chips have no `accessibilityLabel`, so keep the text label or state the options in the group label.
- Don't use a single-select `ChipGroup` to switch views within a page; use `SegmentedControl` or `Tabs`.

## Examples

### Payment method filter

A controlled multi-select filter with icons that drives a transactions query.

```svelte
<script lang="ts">
  import { Box, Chip, ChipGroup, CreditCardIcon, BankIcon, PhoneIcon, Text } from '@razorpay/blade-svelte/components';

  let methods = $state<string[]>(['card', 'upi']);

  const summary = $derived(methods.length ? methods.join(', ') : 'all methods');
</script>

<Box className="display-flex flex-col gap-spacing-3">
  <ChipGroup
    label="Payment method"
    selectionType="multiple"
    size="small"
    name="payment-method"
    value={methods}
    onChange={({ values }) => (methods = values)}
    data-analytics-section="transactions-filter"
  >
    <Chip value="card" icon={CreditCardIcon}>Cards</Chip>
    <Chip value="netbanking" icon={BankIcon}>Netbanking</Chip>
    <Chip value="upi" icon={PhoneIcon}>UPI</Chip>
    <Chip value="emi" isDisabled>EMI</Chip>
  </ChipGroup>
  <Text size="small" color="surface.text.gray.muted">Showing payments from {summary}</Text>
</Box>
```

### Required single selection

A controlled single-select group for the settlement cycle with the label on the left, a required indicator and help text.

```svelte
<script lang="ts">
  import { Chip, ChipGroup } from '@razorpay/blade-svelte/components';

  let cycle = $state('');
</script>

<ChipGroup
  label="Settlement cycle"
  labelPosition="left"
  selectionType="single"
  size="medium"
  necessityIndicator="required"
  value={cycle}
  onChange={({ values }) => (cycle = values[0] ?? '')}
  helpText="Faster cycles have a higher fee"
>
  <Chip value="t0">Same day</Chip>
  <Chip value="t1">T+1</Chip>
  <Chip value="t2">T+2</Chip>
</ChipGroup>
```

### Feedback with semantic colors

An uncontrolled Yes/No group where each chip carries its own color and icon.

```svelte
<script lang="ts">
  import { Chip, ChipGroup, CheckIcon, CloseIcon } from '@razorpay/blade-svelte/components';

  function recordFeedback(values: string[]): void {
    console.log('Settlement report helpful:', values[0]);
  }
</script>

<ChipGroup
  label="Was this settlement report helpful?"
  selectionType="single"
  defaultValue="yes"
  onChange={({ values }) => recordFeedback(values)}
>
  <Chip value="yes" color="positive" icon={CheckIcon}>Yes</Chip>
  <Chip value="no" color="negative" icon={CloseIcon}>No</Chip>
</ChipGroup>
```
