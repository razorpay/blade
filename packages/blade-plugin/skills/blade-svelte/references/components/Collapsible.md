## Component Name

Collapsible

## Description

Collapsible shows and hides one block of secondary content behind a trigger, for patterns like "View price breakdown" or "Show more details". Compose it with one trigger, `CollapsibleButton`, `CollapsibleLink` or `CollapsibleText` (plain text with a chevron), and one `CollapsibleBody`. Content can expand downwards or upwards, and expansion can be controlled or uncontrolled.

## Important Constraints

- `CollapsibleButton`, `CollapsibleLink`, `CollapsibleText` and `CollapsibleBody` throw `[blade-svelte] <Name> must be used inside a <Collapsible> component.` when rendered outside a `Collapsible`
- In controlled mode (`isExpanded` set) the Collapsible does not change its own state; update `isExpanded` from `onExpandChange`
- `defaultIsExpanded` is read only on the first render
- A disabled `CollapsibleText` ignores clicks and key presses
- `CollapsibleButton` accepts only a subset of `Button` props (`variant`, `size`, `icon`, `iconPosition`, `isDisabled`, `accessibilityLabel`, `testID`) and does not take `onClick`

## TypeScript Types

These are the props the Collapsible component and its sub-components accept.

```typescript
type CollapsibleDirection = 'bottom' | 'top';

type CollapsibleLinkColor = 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
type CollapsibleLinkSize = 'xsmall' | 'small' | 'medium' | 'large';

/**
 * Text color token, e.g. 'surface.text.gray.normal' or 'interactive.text.primary.normal'.
 * See Tokens.md for the full list.
 */
type CollapsibleTextColor = string;
type CollapsibleTextSize = 'xsmall' | 'small' | 'medium' | 'large';
type CollapsibleTextWeight = 'regular' | 'medium' | 'semibold';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. InfoIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type CollapsibleProps = {
  /**
   * Composes `CollapsibleButton`, `CollapsibleLink`, `CollapsibleText`, `CollapsibleBody`
   */
  children: Snippet;

  /**
   * Direction in which the content expands
   *
   * @default 'bottom'
   */
  direction?: CollapsibleDirection;

  /**
   * Expands the collapsible content by default (uncontrolled)
   *
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Expands the collapsible content (controlled)
   *
   * @default undefined
   */
  isExpanded?: boolean;

  /**
   * Callback for change in collapsible's expanded state
   *
   * @default undefined
   */
  onExpandChange?: (args: { isExpanded: boolean }) => void;

  /**
   * Test ID for the root element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type CollapsibleButtonProps = {
  /**
   * Button variant that defines the visual style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Position of the icon relative to the button text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Test ID for the button
   */
  testID?: string;
  /**
   * The accessible label for the button
   */
  accessibilityLabel?: string;
  /**
   * Icon to display in the button
   */
  icon?: IconComponent;
  /**
   * Trigger content. Accepts a snippet or a plain string.
   */
  children?: Snippet | string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

type CollapsibleLinkProps = {
  /** Link color */
  color?: CollapsibleLinkColor;
  /** Link size */
  size?: CollapsibleLinkSize;
  /** Whether the link is disabled */
  isDisabled?: boolean;
  /** Test ID for the link */
  testID?: string;
  /** Accessible label for the link */
  accessibilityLabel?: string;
  /** Link content */
  children?: Snippet | string;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type CollapsibleTextProps = {
  /** Text content rendered alongside the chevron. */
  children: Snippet | string;

  /**
   * Size of the text.
   * @default 'medium'
   */
  size?: CollapsibleTextSize;

  /**
   * Weight of the text.
   * @default 'regular'
   */
  weight?: CollapsibleTextWeight;

  /**
   * Overrides the color of the text.
   */
  color?: CollapsibleTextColor;

  /**
   * Whether the trigger is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /** Accessible label for the trigger. */
  accessibilityLabel?: string;

  /** Test ID for the trigger. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type CollapsibleBodyProps = {
  /**
   * Content to render inside the collapsible body.
   */
  children: Snippet | string;

  /**
   * Width of the collapsible body content. Accepts any CSS dimension string
   * (e.g. `'100%'`, `'320px'`).
   */
  width?: string;

  /**
   * Test ID for the body element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `Collapsible` for a single show/hide toggle, such as a price breakdown or extra transaction details.
- Compose exactly one trigger (`CollapsibleButton`, `CollapsibleLink` or `CollapsibleText`) with one `CollapsibleBody`.
- Use `CollapsibleLink` or `CollapsibleText` for inline, low-emphasis disclosure and `CollapsibleButton` when the toggle is a primary action on the page.
- Use `direction="top"` when the trigger sits below the content, for example in a sticky footer summary.
- Use `onExpandChange` to track the state or fire analytics on toggle.
- Write trigger labels that describe the hidden content, such as "View price breakdown".

**Don't**

- Don't use `Collapsible` for three or more related sections; use `Accordion`.
- Don't attach your own click handler to the trigger; react to `onExpandChange` on `Collapsible`.
- Don't make the trigger full width; keep it sized to its label.
- Don't hide content users need to complete a task; show it inline instead.

## Examples

### Price breakdown

An uncontrolled Collapsible with a link trigger that reveals the fee breakdown for a payment.

```svelte
<script lang="ts">
  import {
    Box,
    Collapsible,
    CollapsibleLink,
    CollapsibleBody,
    Text,
    Amount,
  } from '@razorpay/blade-svelte/components';
</script>

<Collapsible
  onExpandChange={({ isExpanded }) => console.log('Breakdown expanded:', isExpanded)}
  data-analytics-section="price-breakdown"
>
  <CollapsibleLink size="small">View price breakdown</CollapsibleLink>
  <CollapsibleBody width="320px">
    <Box className="display-flex flex-col gap-spacing-2">
      <Box className="display-flex justify-between items-center">
        <Text>Order amount</Text>
        <Amount value={1000} />
      </Box>
      <Box className="display-flex justify-between items-center">
        <Text>Razorpay platform fee</Text>
        <Text>2%</Text>
      </Box>
      <Box className="display-flex justify-between items-center">
        <Text>GST</Text>
        <Text>18%</Text>
      </Box>
    </Box>
  </CollapsibleBody>
</Collapsible>

```

### Controlled order details

A controlled Collapsible with a button trigger whose label follows the expanded state.

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleButton,
    CollapsibleBody,
    Text,
  } from '@razorpay/blade-svelte/components';

  let isExpanded = $state(false);
</script>

<Collapsible {isExpanded} onExpandChange={(args) => (isExpanded = args.isExpanded)}>
  <CollapsibleButton variant="secondary" size="small">
    {isExpanded ? 'Hide order details' : 'Show order details'}
  </CollapsibleButton>
  <CollapsibleBody>
    <Text size="small">Order ID: order_NkP8x2Zc1</Text>
    <Text size="small">Payment ID: pay_NkP9d7Qw3</Text>
    <Text size="small" color="surface.text.gray.subtle">Captured on 28 Sep 2026, 4:12 PM</Text>
  </CollapsibleBody>
</Collapsible>
```

### Text trigger expanding upwards

A `CollapsibleText` trigger at the bottom of a summary that expands its content above itself.

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleText,
    CollapsibleBody,
    Text,
  } from '@razorpay/blade-svelte/components';
</script>

<Collapsible direction="top" defaultIsExpanded>
  <CollapsibleText weight="semibold" accessibilityLabel="Toggle settlement details">
    Settlement details
  </CollapsibleText>
  <CollapsibleBody>
    <Text size="small">3 settlements totalling ₹2,48,500 will be credited on 2 Oct.</Text>
  </CollapsibleBody>
</Collapsible>
```
