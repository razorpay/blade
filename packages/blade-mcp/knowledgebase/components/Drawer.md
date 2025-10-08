## Component Name

Drawer

## Description

The Drawer component is a panel that slides in from the right side of the screen over existing content in the viewport. It helps in providing additional details or context and can also be used to promote product features. Drawers support stacking functionality, allowing up to two drawers to be open at once with a neat UI treatment showing the previous drawer peeking from behind.

## Important Constraints

- `Drawer` component accepts `DrawerHeader`, `DrawerBody`, and `DrawerFooter` components as children

## TypeScript Types

The following types represent the props that the Drawer component and its subcomponents accept. These props allow consumers to configure the drawer behavior, appearance, and content.

```typescript
/**
 * Props for the Drawer component
 */
type DrawerProps = {
  /**
   * Controls the state of the drawer, indicating whether it is open or closed
   */
  isOpen: boolean;

  /**
   * Callback function triggered when the drawer is dismissed or closed.
   *
   * **Note**: onDismiss gets triggered immediately on close button click. Use onUnmount if you want to perform actions after the animations are complete
   */
  onDismiss: () => void;

  /**
   * Callback function triggered when the drawer is unmounted.
   *
   * Unlike onDismiss, this gets called after the animations are complete
   */
  onUnmount?: () => void;

  /**
   * Show or hide overlay.
   *
   * Also decides if clicking outside on overlay closes the drawer or not
   */
  showOverlay?: boolean;

  /**
   * children node.
   *
   * Supports DrawerHeader, DrawerBody, and DrawerFooter
   */
  children: React.ReactNode;

  /**
   * zIndex property of drawer
   *
   * @default 1001
   */
  zIndex?: number;

  /**
   * Accessibility label for the drawer
   */
  accessibilityLabel?: string;

  /**
   * Ref to the element that should receive focus when opening the drawer.
   */
  initialFocusRef?: React.MutableRefObject<any>;

  /**
   * If `true`, the DrawerBody will be rendered only when it becomes active.
   * Set to `false` to keep DrawerBody in DOM
   *
   * @default true
   */
  isLazy?: boolean;
} & DataAnalyticsAttribute &
  TestID;

/**
 * Props for the DrawerHeader component
 */
type DrawerHeaderProps = {
  /**
   * Title of the Drawer
   */
  title?: string;

  /**
   * Subtitle of the Drawer
   */
  subtitle?: string;

  /**
   * Leading element
   *
   * DrawerHeaderIcon or DrawerHeaderAsset
   */
  leading?: React.ReactNode;

  /**
   * Title suffix element
   *
   * DrawerHeaderBadge
   */
  titleSuffix?: React.ReactNode;

  /**
   * Trailing element
   *
   * Link, Button[]
   */
  trailing?: React.ReactNode;

  /**
   * Children elements to be rendered inside the header
   */
  children?: React.ReactElement | React.ReactElement[];

  /**
   * Background color of the header
   *
   * Use this for adding gradients
   */
  color?: FeedbackColors;

  /**
   * Whether to show the divider below the header
   * @default true
   */
  showDivider?: boolean;
} & DataAnalyticsAttribute;

/**
 * Props for the DrawerFooter component
 */
type DrawerFooterProps = {
  /**
   * Content of the footer
   */
  children: React.ReactNode;

  /**
   * Whether to show the divider above the footer
   * @default true
   */
  showDivider?: boolean;

  /**
   * Whether the footer is visible
   * @default true
   */
  showFooter?: boolean;
} & DataAnalyticsAttribute &
  TestID;
```

## Example

### Basic Drawer

This example shows a basic drawer with standard header and body content. It demonstrates how to control the drawer's open state and handle dismissal.

```tsx
import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  Box,
  Button,
  Badge,
  TextInput,
  Heading,
  Text,
  DownloadIcon,
} from '@razorpay/blade/components';

const BasicDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(true);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  return (
    <Box>
      <Box display="flex" gap="spacing.4" marginBottom="spacing.4">
        <Button onClick={handleOpenDrawer}>Open Drawer</Button>
        <Button variant="secondary" onClick={() => setShowFooter(!showFooter)}>
          {showFooter ? 'Hide Footer' : 'Show Footer'}
        </Button>
      </Box>

      <Drawer
        isOpen={isDrawerOpen}
        onDismiss={handleCloseDrawer}
        accessibilityLabel="Vendor payment details drawer"
      >
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} accessibilityLabel="Download details" />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Starters' CFP Private Limited</Heading>
            <Badge size="small" color="primary" marginLeft="spacing.3">
              Vendor
            </Badge>
          </Box>

          <Box marginTop="spacing.6" marginBottom="spacing.8">
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              accessibilityLabel="Email address input"
            />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
              accessibilityLabel="Phone number input"
            />
          </Box>

          <Box>
            <Button accessibilityLabel="Process payout">Payout</Button>
            <Button
              marginLeft="spacing.2"
              variant="tertiary"
              accessibilityLabel="Send invitation to vendor"
            >
              Invite Vendor
            </Button>
          </Box>
        </DrawerBody>

        <DrawerFooter showFooter={showFooter}>
          <Box display="flex" gap="spacing.3">
            <Button
              variant="tertiary"
              isFullWidth
              onClick={handleCloseDrawer}
              accessibilityLabel="Cancel and close drawer"
            >
              Cancel
            </Button>
            <Button variant="primary" isFullWidth accessibilityLabel="Process payment for vendor">
              Process Payment
            </Button>
          </Box>
        </DrawerFooter>
      </Drawer>
    </Box>
  );
};

export default BasicDrawer;
```

### Drawer with Custom Header Content

This example demonstrates how to create a drawer with custom header content, including a colored background and rich content layout.

```tsx
import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  Box,
  Button,
  IconButton,
  Badge,
  TextInput,
  Heading,
  Text,
  Amount,
  CheckIcon,
  MoreHorizontalIcon,
  DownloadIcon,
} from '@razorpay/blade/components';

const CustomHeaderDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>

      <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          color="positive"
          title="Settlements"
          trailing={
            <IconButton
              icon={MoreHorizontalIcon}
              accessibilityLabel="Options"
              onClick={() => console.log('Options Clicked')}
              size="large"
            />
          }
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={26000}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>

          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
            <Badge icon={CheckIcon} size="medium" color="positive" emphasis="intense">
              Captured
            </Badge>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="spacing.2"
            marginTop="spacing.6"
            paddingX="spacing.4"
          >
            <Text size="large" textAlign="center">
              Payment was successfully captured. To be settled in your bank account by{' '}
              <Text as="span" size="large" weight="semibold" color="feedback.text.positive.intense">
                Jan 20, 2025
              </Text>
            </Text>
          </Box>

          <Box marginTop="spacing.4" textAlign="center">
            <Text size="small" weight="medium" color="surface.text.gray.muted">
              Created on Jan 11, 2025
            </Text>
          </Box>
        </DrawerHeader>

        <DrawerBody>
          <Box marginBottom="spacing.8">
            <Heading marginBottom="spacing.4">Transaction Details</Heading>
            <Text>
              This payment will be processed according to your settlement cycles. You can check the
              status of your settlements in the Settlements tab.
            </Text>
          </Box>

          <Button accessibilityLabel="View detailed settlement information">
            View All Settlements
          </Button>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export default CustomHeaderDrawer;
```
