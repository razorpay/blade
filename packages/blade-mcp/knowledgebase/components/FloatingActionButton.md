## Component Name

FloatingActionButton

## Description

FloatingActionButton is a persistent, elevated button anchored to the bottom of the viewport, used for the single most important action on a screen. It stays in place while the page scrolls, so the primary action remains reachable at all times. It renders as a pill with a drop shadow and always carries an icon, optionally alongside a short label. On React Native it automatically respects the device's safe-area insets.

## Important Constraints

- `icon` is required — a `FloatingActionButton` is never text-only
- When `children` is omitted the button is icon-only, and `accessibilityLabel` becomes required
- There is no `size` or `variant` prop — the button always renders at the `large` size with a `primary` emphasis
- Only one `FloatingActionButton` should be rendered per screen
- The button positions itself, so it does not need to be wrapped in a positioned `Box`

## TypeScript Types

The following types represent the props that the FloatingActionButton component accepts.

```typescript
/**
 * Corner of the viewport the button is anchored to.
 *
 * Values mirror `Popover`'s `placement`, where the unsuffixed value is centered
 * and `start` / `end` name the inline edges.
 */
type FloatingActionButtonPlacement = 'bottom-end' | 'bottom-start' | 'bottom';

type FloatingActionButtonCommonProps = {
  /**
   * Icon rendered inside the button.
   *
   * Accepts an icon component from blade.
   */
  icon: IconComponent;

  /**
   * Color of the button.
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'black';

  /**
   * Corner of the viewport the button is anchored to.
   *
   * @default 'bottom-end'
   */
  placement?: FloatingActionButtonPlacement;

  /**
   * Distance between the button and the edges it is anchored to.
   *
   * @default 'spacing.5'
   */
  offset?: SpacingValueType;

  /**
   * zIndex of the button.
   *
   * Defaults to a value that sits above page content but below `BottomNav`,
   * `BottomSheet` and `Modal`.
   *
   * @default 99
   */
  zIndex?: number;

  /**
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Shows a spinner in place of the button's content.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Automatically renders the button with an `a` tag with `href` on web.
   */
  href?: string;

  /**
   * anchor target attribute
   *
   * Should only be used alongside `href`
   */
  target?: string;

  /**
   * anchor rel attribute
   *
   * Should only be used alongside `href`
   */
  rel?: string;

  /**
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit';

  onClick?: (event: React.MouseEvent<HTMLButtonElement> | GestureResponderEvent) => void;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute &
  BladeCommonEvents;

/**
 * With a label, `accessibilityLabel` is optional since the label already names
 * the action.
 */
type FloatingActionButtonWithLabelProps = FloatingActionButtonCommonProps & {
  children: StringChildrenType;
  accessibilityLabel?: string;
};

/**
 * Without a label the button is a bare icon, so it is unusable with a screen
 * reader unless `accessibilityLabel` names the action.
 */
type FloatingActionButtonIconOnlyProps = FloatingActionButtonCommonProps & {
  children?: undefined;
  accessibilityLabel: string;
};

type FloatingActionButtonProps =
  | FloatingActionButtonWithLabelProps
  | FloatingActionButtonIconOnlyProps;
```

## Usage Guidelines

**Do**

- Use `FloatingActionButton` for the single most important action on a screen, such as creating a new record.
- Always pass `accessibilityLabel` when rendering the icon-only form, so screen readers can name the action.
- Keep the label to one or two words — the button floats over content, so it should stay compact.
- Raise `offset` when the button would otherwise overlap fixed content at the bottom of the page.
- Use `color="white"` or `color="black"` when the button sits over a colored or image background that the `primary` blue would not read against.

**Don't**

- Don't render more than one `FloatingActionButton` on a screen — it dilutes the "single most important action" intent.
- Don't use it for destructive actions such as delete — it is too easy to hit by accident.
- Don't use it for secondary or tertiary actions; use `Button` inline in the page instead.
- Don't wrap it in a positioned `Box` or override `position` through styled props — the component anchors itself.
- Don't pass a long sentence as `children` — the pill grows with the label and will cover page content.
- Don't pair it with `BottomNav` at the same `placement` without raising `offset`, or the two will overlap.

## Example

This example shows a transactions screen with a labelled FloatingActionButton for the primary action, and an icon-only variant anchored to the opposite corner.

```tsx
import React, { useState } from 'react';
import {
  FloatingActionButton,
  Box,
  Text,
  Heading,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  PlusIcon,
  MessageSquareIcon,
} from '@razorpay/blade/components';

const TransactionsScreen = (): React.ReactElement => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Box minHeight="100vh" padding="spacing.6" backgroundColor="surface.background.gray.subtle">
      <Heading size="large">Transactions</Heading>

      {/* Long page content the button floats over while scrolling */}
      {Array.from({ length: 20 }).map((_, index) => (
        <Box
          key={index}
          padding="spacing.5"
          marginTop="spacing.4"
          backgroundColor="surface.background.gray.intense"
          borderRadius="medium"
        >
          <Text>Transaction #{index + 1}</Text>
        </Box>
      ))}

      {/* Primary action — labelled, anchored bottom-right */}
      <FloatingActionButton
        icon={PlusIcon}
        onClick={() => setIsCreateOpen(true)}
        testID="create-payment-fab"
        data-analytics="create-payment"
      >
        Create
      </FloatingActionButton>

      {/* Support entry point — icon-only, so accessibilityLabel is required */}
      <FloatingActionButton
        icon={MessageSquareIcon}
        color="white"
        placement="bottom-start"
        accessibilityLabel="Chat with support"
        onClick={() => console.log('open support chat')}
      />

      <Modal isOpen={isCreateOpen} onDismiss={() => setIsCreateOpen(false)}>
        <ModalHeader title="Create payment" />
        <ModalBody>
          <Text>Payment creation form goes here.</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={() => setIsCreateOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Box>
  );
};

export default TransactionsScreen;
```
