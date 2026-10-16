## Component Name

SegmentedControl

## Description

SegmentedControl lets users pick one value from 2-5 short options shown side by side in a pill bar, such as a report time period or a chart view. It is a form field with a label, help text, error text and required state, and works controlled or uncontrolled. Each option is a `SegmentedControlItem`, documented here, showing text, an icon with text, or only an icon.

## Important Constraints

- `SegmentedControlItem` must be rendered inside `SegmentedControl`; it reads the control's context and fails outside it
- Every `SegmentedControlItem` needs a unique `value`
- `SegmentedControl` requires either `label` or `accessibilityLabel`
- Icon-only items (a `leading` icon with no children) must set `accessibilityLabel`
- `errorText` renders only when `validationState` is `'error'` and replaces `helpText`
- `isDisabled` on `SegmentedControl` disables every item; `isDisabled` on an item disables only that item
- `onChange` fires on every item click, including a click on the already selected item
- Unlike React, `SegmentedControl` does not accept styled props (`margin`, `width` and so on); wrap it in `Box` with a margin utility class, for example `<Box className="margin-top-spacing-4">`, for spacing
- `leading` only accepts an icon component exported by `@razorpay/blade-svelte/components`

## TypeScript Types

These are the props the SegmentedControl and SegmentedControlItem components accept.

```typescript
type SegmentedControlSize = 'small' | 'medium' | 'large';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CreditCardIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type SegmentedControlCommonProps = {
  /**
   * The content of the SegmentedControl, accepts `SegmentedControlItem` snippets.
   */
  children: Snippet;
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
   * @default undefined
   */
  onChange?: (params: { name: string | undefined; value: string }) => void;
  /**
   * The size of the segmented control.
   * @default 'medium'
   */
  size?: SegmentedControlSize;
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
   * Sets the position of the label.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Help text displayed below the segmented control.
   */
  helpText?: string;
  /**
   * Error text displayed when `validationState` is set to 'error'. Overrides helpText.
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
  /**
   * Test ID for automated testing.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};

type SegmentedControlPropsWithLabel = SegmentedControlCommonProps & {
  /**
   * Renders the label of the segmented control.
   */
  label: string;
  accessibilityLabel?: string;
};

type SegmentedControlPropsWithA11yLabel = SegmentedControlCommonProps & {
  label?: undefined;
  /**
   * Accessibility label for the segmented control (required when no visible label).
   */
  accessibilityLabel: string;
};

type SegmentedControlProps = SegmentedControlPropsWithLabel | SegmentedControlPropsWithA11yLabel;

type SegmentedControlItemProps = {
  /**
   * The unique value for this item.
   */
  value: string;
  /**
   * The label content of the item.
   */
  children?: Snippet;
  /**
   * A leading icon component.
   */
  leading?: IconComponent;
  /**
   * If `true`, this item is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Accessibility label for the item. Required for icon-only items.
   */
  accessibilityLabel?: string;
  /**
   * Test ID for automated testing.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `SegmentedControl` for 2-5 short, mutually exclusive options, such as Daily / Weekly / Monthly on a settlements report.
- Use `value` with `onChange={({ value }) => ...}` when the selection drives data fetching or other UI; use `defaultValue` otherwise.
- Keep item labels to one or two words so every segment fits on one line.
- Use `leading` icons consistently: either every item has one or none does.
- Pass `accessibilityLabel` on each icon-only item, and on the control when there is no visible `label`.
- Use `size="small"` inside dense toolbars and card headers; use `large` only for a primary page-level selector.

**Don't**

- Don't use `SegmentedControl` when each option shows a different content panel; use `Tabs`.
- Don't use `SegmentedControl` for more than 5 options or long labels; use `RadioGroup` or `Dropdown`.
- Don't use `SegmentedControl` for multiple selection; use `ChipGroup` with `selectionType="multiple"` or `CheckboxGroup`.
- Don't use `SegmentedControl` for a single on/off setting; use `Switch`.

## Examples

### Report time period

A controlled selector that changes the reporting window, with a disabled option and help text.

```svelte
<script lang="ts">
  import { Box, SegmentedControl, SegmentedControlItem, Text } from '@razorpay/blade-svelte/components';

  let period = $state('weekly');

  function loadSettlements(nextPeriod: string): void {
    period = nextPeriod;
    console.log(`Fetching ${nextPeriod} settlements`);
  }
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <SegmentedControl
    label="Settlement period"
    name="settlement-period"
    size="small"
    value={period}
    onChange={({ value }) => loadSettlements(value)}
    helpText="Yearly reports are available after your first year"
    data-analytics-section="settlement-period"
  >
    <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
    <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
    <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    <SegmentedControlItem value="yearly" isDisabled>Yearly</SegmentedControlItem>
  </SegmentedControl>
  <Text size="small">Showing {period} settlements</Text>
</Box>
```

### Payment method with icons and validation

An uncontrolled, required selector with leading icons, a left label and an error state.

```svelte
<script lang="ts">
  import {
    Box,
    Button,
    SegmentedControl,
    SegmentedControlItem,
    CreditCardIcon,
    BankIcon,
    PhoneIcon,
  } from '@razorpay/blade-svelte/components';

  let method = $state<string | undefined>(undefined);
  let hasSubmitted = $state(false);
</script>

<Box className="display-flex flex-col gap-spacing-5">
  <SegmentedControl
    label="Default payment method"
    labelPosition="left"
    necessityIndicator="required"
    isRequired
    onChange={({ value }) => (method = value)}
    validationState={hasSubmitted && !method ? 'error' : 'none'}
    errorText="Select a default payment method"
  >
    <SegmentedControlItem value="card" leading={CreditCardIcon}>Card</SegmentedControlItem>
    <SegmentedControlItem value="netbanking" leading={BankIcon}>Netbanking</SegmentedControlItem>
    <SegmentedControlItem value="upi" leading={PhoneIcon}>UPI</SegmentedControlItem>
  </SegmentedControl>
  <Button variant="primary" onClick={() => (hasSubmitted = true)}>Save checkout settings</Button>
</Box>
```

### Icon-only notification channel

An icon-only selector without a visible label, so both the control and each item carry an `accessibilityLabel`.

```svelte
<script lang="ts">
  import {
    SegmentedControl,
    SegmentedControlItem,
    MailIcon,
    PhoneIcon,
    WhatsAppIcon,
  } from '@razorpay/blade-svelte/components';
</script>

<SegmentedControl
  accessibilityLabel="Payment receipt channel"
  defaultValue="email"
  size="small"
  testID="receipt-channel"
>
  <SegmentedControlItem value="email" leading={MailIcon} accessibilityLabel="Email" />
  <SegmentedControlItem value="sms" leading={PhoneIcon} accessibilityLabel="SMS" />
  <SegmentedControlItem value="whatsapp" leading={WhatsAppIcon} accessibilityLabel="WhatsApp" />
</SegmentedControl>
```
