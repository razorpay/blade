## Component Name

CardGroup

## Description

CardGroup stacks navigating, selecting, and disclosing rows into a single surface. It provides a bordered, elevated container with dividers between rows, similar to a list of cards but as one cohesive group. Each row can navigate (via `href`), select (via `onClick`/`isSelected`), or disclose (via `CardGroupCollapsibleItem`). The group itself is stateless — selection and expansion are consumer-driven.

## Important Constraints

- `CardGroup` children must be `CardGroupItem` or `CardGroupCollapsibleItem` components only
- A `CardGroupItem` either navigates (`href`) or selects (`onClick` / `isSelected`) — never both
- `CardGroupCollapsibleItem` must contain a `CardGroupItem` (the disclosure trigger) followed by a `CardGroupCollapsibleItemBody` (the revealed content)
- `CardGroupCollapsibleItemBody` can hold any content, including a nested `CardGroup`

## TypeScript Types

The following types define the props that CardGroup and its subcomponents accept:

```typescript
export type CardGroupProps = {
  /**
   * Rows of the group — compose `CardGroupItem` and `CardGroupCollapsibleItem`.
   */
  children: React.ReactNode;
  /**
   * Accessible label for the group, announced by screen readers.
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupItemProps = {
  /**
   * Row content — the free slot between the leading and trailing slots.
   */
  children?: React.ReactNode;
  /**
   * Leading content, rendered before `children` (e.g. an icon or avatar).
   */
  leading?: React.ReactNode;
  /**
   * Trailing content, rendered after `children` and before the chevron
   * (e.g. a badge or amount).
   */
  trailing?: React.ReactNode;
  /**
   * Renders the row as a navigating link. A row either navigates (`href`) or
   * selects (`onClick` / `isSelected`) — never both. Ignored when the row acts
   * as a collapsible trigger.
   *
   * @default undefined
   */
  href?: string;
  /**
   * Link target, used only with `href`.
   *
   * @default undefined
   */
  target?: string;
  /**
   * Link rel, used only with `href`.
   *
   * @default undefined
   */
  rel?: string;
  /**
   * Click handler for a selecting row. Ignored when `href` is set or when the
   * row acts as a collapsible trigger.
   *
   * @default undefined
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * Marks a selecting row as selected. Selection is consumer-driven; the group
   * does not own selection state.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * Disables the row.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Accessible label for the row.
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupCollapsibleItemProps = {
  /**
   * Compose a `CardGroupItem` (the disclosure trigger) followed by a
   * `CardGroupCollapsibleItemBody` (the revealed content).
   */
  children: React.ReactNode;
  /**
   * Expands the row (controlled).
   *
   * @default undefined
   */
  isExpanded?: boolean;
  /**
   * Expands the row by default (uncontrolled).
   *
   * @default false
   */
  defaultIsExpanded?: boolean;
  /**
   * Callback for a change in the row's expanded state.
   *
   * @default undefined
   */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupCollapsibleItemBodyProps = {
  /**
   * Revealed content — a free slot that may hold anything, including a nested
   * `CardGroup`.
   */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;
```

## Usage Guidelines

**Do**

- Use `CardGroup` to group related navigating, selecting, or disclosing rows into a single surface.
- Compose using `CardGroupItem` for plain rows and `CardGroupCollapsibleItem` for expandable rows.
- Provide `accessibilityLabel` on `CardGroup` to describe the group's purpose.
- Drive selection state externally — pass `isSelected` to each `CardGroupItem` based on your state.
- Use `leading` and `trailing` slots on `CardGroupItem` for icons, badges, or amounts.

**Don't**

- Don't pass `href` and `onClick` on the same `CardGroupItem` — a row either navigates or selects, never both.
- Don't pass arbitrary children to `CardGroup` — only `CardGroupItem` and `CardGroupCollapsibleItem` are allowed.
- Don't put a `CardGroupItem` inside `CardGroupCollapsibleItemBody` — nested interactive items inside the body are not supported.
- Don't manage expansion state inside the group — `CardGroupCollapsibleItem` is controlled or uncontrolled via its own props.

## Example

### Basic CardGroup with Navigation Rows

A simple group of navigating rows using `href` on each `CardGroupItem`.

```tsx
import {
  CardGroup,
  CardGroupItem,
  CreditCardIcon,
  BankIcon,
  Text,
} from '@razorpay/blade/components';

const NavigationExample = () => (
  <CardGroup accessibilityLabel="Settings">
    <CardGroupItem href="/profile" leading={<CreditCardIcon size="medium" color="surface.icon.gray.subtle" />}>
      <Text>Profile</Text>
    </CardGroupItem>
    <CardGroupItem href="/security" leading={<BankIcon size="medium" color="surface.icon.gray.subtle" />}>
      <Text>Security</Text>
    </CardGroupItem>
  </CardGroup>
);
```

### Selection CardGroup

A group where rows are selectable via `onClick` and `isSelected`. Selection state is managed by the consumer.

```tsx
import React from 'react';
import { CardGroup, CardGroupItem, Text } from '@razorpay/blade/components';

const SelectionExample = () => {
  const [selected, setSelected] = React.useState('cards');
  return (
    <CardGroup accessibilityLabel="Choose a plan">
      <CardGroupItem isSelected={selected === 'cards'} onClick={() => setSelected('cards')}>
        <Text>Cards</Text>
      </CardGroupItem>
      <CardGroupItem isSelected={selected === 'upi'} onClick={() => setSelected('upi')}>
        <Text>UPI</Text>
      </CardGroupItem>
      <CardGroupItem isSelected={selected === 'wallet'} onClick={() => setSelected('wallet')}>
        <Text>Wallet</Text>
      </CardGroupItem>
    </CardGroup>
  );
};
```

### Collapsible CardGroup

A group with expandable rows using `CardGroupCollapsibleItem` and `CardGroupCollapsibleItemBody`.

```tsx
import React from 'react';
import {
  CardGroup,
  CardGroupItem,
  CardGroupCollapsibleItem,
  CardGroupCollapsibleItemBody,
  Box,
  Text,
  SmartphoneIcon,
} from '@razorpay/blade/components';

const CollapsibleExample = () => (
  <CardGroup accessibilityLabel="Payment methods">
    <CardGroupItem href="/cards">
      <Text>Cards</Text>
    </CardGroupItem>

    <CardGroupCollapsibleItem defaultIsExpanded>
      <CardGroupItem leading={<SmartphoneIcon size="medium" color="surface.icon.gray.subtle" />}>
        <Text>UPI</Text>
      </CardGroupItem>
      <CardGroupCollapsibleItemBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Text>Google Pay</Text>
          <Text>PhonePe</Text>
          <Text>PayTM</Text>
        </Box>
      </CardGroupCollapsibleItemBody>
    </CardGroupCollapsibleItem>

    <CardGroupCollapsibleItem>
      <CardGroupItem>
        <Text>Pay Later</Text>
      </CardGroupItem>
      <CardGroupCollapsibleItemBody>
        <Text>Simpl, LazyPay, ICICI PayLater</Text>
      </CardGroupCollapsibleItemBody>
    </CardGroupCollapsibleItem>
  </CardGroup>
);
```
