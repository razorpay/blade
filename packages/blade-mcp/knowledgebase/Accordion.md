# Accordion

## Component Name

Accordion

## Description

An accordion is used to allow users to toggle between different content sections in a compact vertical stack. It provides an expandable and collapsible interface to show/hide content, improving space utilization and organizing related information in a hierarchical structure.

## TypeScript Types

Below are the component props types that Accordion and its subcomponents accept. These types define all the possible properties and configurations you can use when implementing Accordion components in your application.

```typescript
type AccordionVariantType = 'filled' | 'transparent';

type AccordionProps = {
  /**
   * Makes the passed item index expanded by default (uncontrolled)
   */
  defaultExpandedIndex?: number;

  /**
   * Expands the passed index (controlled), `-1` implies no expanded items
   */
  expandedIndex?: number;

  /**
   * Callback for change in any item's expanded state,
   * `-1` implies no expanded items
   */
  onExpandChange?: ({ expandedIndex }: { expandedIndex: number }) => void;

  /**
   * Adds numeric index at the beginning of items
   *
   * @default false
   */
  showNumberPrefix?: boolean;

  /**
   * Visual variant of AccordionItem
   *
   * @default transparent
   */
  variant?: AccordionVariantType;

  /**
   * Size of the Accordion
   *
   * @default large
   */
  size?: 'large' | 'medium';

  /**
   * maxWidth prop of Accordion
   *
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * Accepts `AccordionItem` child nodes
   */
  children: React.ReactElement | React.ReactElement[];
} & TestID &
  StyledPropsBlade;

type AccordionItemProps = {
  /**
   * Title text content
   *
   * @deprecated Use AccordionItemHeader and AccordionItemBody
   */
  title?: string;

  /**
   * Body text content
   *
   * @deprecated Use AccordionItemHeader and AccordionItemBody
   */
  description?: string;

  /**
   * Renders a Blade icon as title prefix (requires `showNumberPrefix={false}`)
   *
   * @deprecated Use `leading={<StarIcon size="large" />}` on AccordionItemHeader instead
   */
  icon?: IconComponent;

  /**
   * Slot, renders any custom content
   */
  children?: ReactNode | ReactNode[];

  /**
   * Disabled state of the item
   *
   * @default false
   */
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute;

// AccordionItemHeader props (derived from BaseHeaderProps)
type AccordionItemHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'children' | 'trailing' | 'titleSuffix'
> &
  DataAnalyticsAttribute;

// AccordionItemBody props
type AccordionItemBodyProps = {
  children?: React.ReactNode | StringChildrenType;
} & DataAnalyticsAttribute;
```

## Examples

### Basic Accordion

A simple accordion with default transparent variant and expandable items.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
} from '@razorpay/blade/components';

const BasicAccordionExample = () => {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Route?" />
        <AccordionItemBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to
          customers. You may also check our docs for detailed instructions.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup QR Codes?" />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Subscriptions?" />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
    </Accordion>
  );
};
```

### Accordion with Visual Variations

This example shows different visual variants of Accordion, including numbered prefixes, size options, and width customization.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Box,
} from '@razorpay/blade/components';

const AccordionVariantsExample = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Accordion with numbered prefixes */}
      <Accordion
        showNumberPrefix={true}
        variant="transparent"
        size="large"
        maxWidth={{ base: '100%', s: '480px' }}
      >
        <AccordionItem>
          <AccordionItemHeader title="First item with numbered prefix" />
          <AccordionItemBody>Content for first item</AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="Second item with numbered prefix" />
          <AccordionItemBody>Content for second item</AccordionItemBody>
        </AccordionItem>
      </Accordion>

      {/* Filled variant with medium size */}
      <Accordion variant="filled" size="medium">
        <AccordionItem>
          <AccordionItemHeader title="Filled variant medium size" />
          <AccordionItemBody>This accordion uses filled variant with medium size</AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="Another filled variant item" />
          <AccordionItemBody>More content for the filled variant</AccordionItemBody>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
```

### Accordion with Rich Header Features

This example shows an accordion with various header features including icons, badges, and interactive elements.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Badge,
  Link,
} from '@razorpay/blade/components';
import { RoutesIcon, QRCodeIcon, SubscriptionsIcon } from '@razorpay/blade/components';

const RichHeaderAccordionExample = () => {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionItemHeader
          leading={<RoutesIcon size="large" />}
          title="How can I setup Route?"
          subtitle="Subtitle for route setup"
          titleSuffix={<Badge>New</Badge>}
          trailing={
            <Link
              variant="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Apply
            </Link>
          }
        />
        <AccordionItemBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to
          customers. You may also check our docs for detailed instructions.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader
          leading={<QRCodeIcon size="large" />}
          title="How can I setup QR Codes?"
        />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem isDisabled={true}>
        <AccordionItemHeader
          leading={<SubscriptionsIcon size="large" color="surface.icon.gray.disabled" />}
          title="How can I setup Subscriptions?"
          subtitle="This item is disabled"
        />
        <AccordionItemBody>This item is disabled and cannot be expanded.</AccordionItemBody>
      </AccordionItem>
    </Accordion>
  );
};
```

### Controlled Accordion

An example of a controlled accordion where expansion state is managed externally.

```tsx
import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Box,
  Button,
} from '@razorpay/blade/components';
import { AnnouncementIcon, RoutesIcon } from '@razorpay/blade/components';

const ControlledAccordionExample = () => {
  // State for controlled accordion
  const [expandedIndex, setExpandedIndex] = useState(-1);

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.4"
        marginBottom="spacing.6"
        flexWrap="wrap"
      >
        <Button onClick={() => setExpandedIndex(0)}>Expand First</Button>
        <Button onClick={() => setExpandedIndex(1)}>Expand Second</Button>
        <Button onClick={() => setExpandedIndex(-1)}>Collapse All</Button>
      </Box>

      <Accordion
        expandedIndex={expandedIndex}
        onExpandChange={({ expandedIndex }) => setExpandedIndex(expandedIndex)}
      >
        <AccordionItem>
          <AccordionItemHeader
            leading={<AnnouncementIcon size="large" />}
            title="Controlled Item 1"
            subtitle="This is controlled by external state"
          />
          <AccordionItemBody>Content for controlled item 1</AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader
            leading={<RoutesIcon size="large" />}
            title="Controlled Item 2"
            subtitle="This is also controlled by external state"
          />
          <AccordionItemBody>Content for controlled item 2</AccordionItemBody>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
```

### Accordion with Custom Content

This example shows how to use custom content in both header and body of accordion items.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Box,
  Text,
  Indicator,
  Alert,
  TextInput,
  Button,
  UserIcon,
} from '@razorpay/blade/components';
import { useState } from 'react';

const CustomContentAccordionExample = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  return (
    <Accordion maxWidth={{ base: '100%', s: '480px' }}>
      {/* Custom header content */}
      <AccordionItem>
        <AccordionItemHeader>
          <Box>
            <Text size="large" color="surface.text.gray.muted">
              #8218851
            </Text>
            <Text marginY="spacing.2" size="large" weight="semibold">
              Transactions and settlement related
            </Text>
            <Box display="flex" flexDirection="row" gap="spacing.3">
              <Indicator size="medium" color="information">
                In Progress
              </Indicator>
              <Box display="flex" alignItems="center" flexDirection="row" gap="spacing.2">
                <UserIcon size="medium" color="surface.icon.gray.subtle" />
                <Text size="medium" color="surface.text.gray.subtle">
                  Merchant Risk
                </Text>
              </Box>
            </Box>
          </Box>
        </AccordionItemHeader>
        <AccordionItemBody>
          <TextInput label="Additional Information" placeholder="Enter details here" />
          <Button marginTop="spacing.4">Submit</Button>
        </AccordionItemBody>
      </AccordionItem>

      {/* Custom body content with conditional rendering */}
      <AccordionItem>
        <AccordionItemHeader title="Item with interactive body content" />
        <AccordionItemBody>
          <Text color="surface.text.gray.subtle" marginBottom="spacing.4">
            You can use Razorpay services as described in the documentation.
          </Text>

          {isAlertVisible && (
            <Alert
              title="Custom slot"
              description="You can render anything here along with description"
              onDismiss={() => setIsAlertVisible(false)}
            />
          )}
        </AccordionItemBody>
      </AccordionItem>
    </Accordion>
  );
};
```

### Payment Method Selection Example

A real-world example showing how to use Accordion for payment method selection.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Box,
  TextInput,
  Button,
  Badge,
} from '@razorpay/blade/components';

const PaymentMethodsAccordion = () => {
  return (
    <Box maxWidth={{ base: '100%', s: '480px' }}>
      <Accordion variant="filled" defaultExpandedIndex={0}>
        <AccordionItem>
          <AccordionItemHeader title="UPI Payment" subtitle="Pay directly from your bank account" />
          <AccordionItemBody>
            <TextInput label="UPI ID" placeholder="username@upi" />
            <Button marginTop="spacing.4" isFullWidth>
              Pay Now
            </Button>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeader
            title="Credit Card"
            subtitle="Secure card payment"
            titleSuffix={<Badge color="positive">No Extra Charge</Badge>}
          />
          <AccordionItemBody>
            <TextInput label="Card Number" placeholder="1234 5678 9012 3456" />
            <Box display="flex" flexDirection="row" gap="spacing.4" marginTop="spacing.4">
              <TextInput label="Expiry" placeholder="MM/YY" />
              <TextInput label="CVV" placeholder="123" />
            </Box>
            <Button marginTop="spacing.4" isFullWidth>
              Pay Now
            </Button>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemHeader
            title="Net Banking"
            subtitle="Pay using your bank account"
            titleSuffix={<Badge color="positive">5% Cashback</Badge>}
          />
          <AccordionItemBody>
            <TextInput label="Select Bank" placeholder="Choose your bank" />
            <Button marginTop="spacing.4" isFullWidth>
              Continue
            </Button>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
```
