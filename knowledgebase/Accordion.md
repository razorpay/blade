# Accordion

## Component Name
Accordion

## Description
An accordion is used to allow users to toggle between different content sections in a compact vertical stack. It provides an expandable and collapsible interface to show/hide content, improving space utilization and organizing related information in a hierarchical structure.

## Types

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
> & DataAnalyticsAttribute;

// AccordionItemBody props
type AccordionItemBodyProps = {
  children?: React.ReactNode | StringChildrenType;
} & DataAnalyticsAttribute;
```

## Example

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Badge,
  Box,
  Link,
  Text,
  Indicator,
  Button,
  TextInput,
  Alert
} from '@razorpay/blade/components';
import {
  StarIcon,
  RoutesIcon,
  QRCodeIcon,
  SubscriptionsIcon,
  UserIcon,
  AnnouncementIcon
} from '@razorpay/blade/components/Icons';
import { useState } from 'react';

const AccordionExample = () => {
  // State for controlled accordion
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  return (
    <Box>
      {/* Basic Accordion with numbered items */}
      <Accordion 
        showNumberPrefix={true} 
        variant="transparent" 
        size="large"
        maxWidth={{ base: '100%', s: '480px' }}
      >
        <AccordionItem>
          <AccordionItemHeader 
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
            
            {isAlertVisible && (
              <Alert
                title="Custom slot"
                description="You can render anything here along with description"
                onDismiss={() => setIsAlertVisible(false)}
              />
            )}
          </AccordionItemBody>
        </AccordionItem>
        
        {/* Item with icon */}
        <AccordionItem>
          <AccordionItemHeader
            leading={<QRCodeIcon size="large" />}
            title="How can I setup QR Codes?"
          />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        
        {/* Disabled item */}
        <AccordionItem isDisabled={true}>
          <AccordionItemHeader
            leading={<SubscriptionsIcon size="large" color="surface.icon.gray.disabled" />}
            title="How can I setup Subscriptions?"
            subtitle="This item is disabled"
          />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        
        {/* Custom header content */}
        <AccordionItem>
          <AccordionItemHeader>
            <Box>
              <Text size="large" color="surface.text.gray.muted">#8218851</Text>
              <Text marginY="spacing.2" size="large" weight="semibold">
                Transactions and settlement related
              </Text>
              <Box display="flex" flexDirection="row" gap="spacing.3">
                <Indicator size="medium" color="information">In Progress</Indicator>
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
            <Button>Submit</Button>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>
      
      {/* Controlled Accordion */}
      <Box marginTop="spacing.6">
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
          variant="filled"
          expandedIndex={expandedIndex}
          onExpandChange={({ expandedIndex }) => setExpandedIndex(expandedIndex)}
        >
          <AccordionItem>
            <AccordionItemHeader
              leading={<AnnouncementIcon size="large" />}
              title="Controlled Item 1"
              subtitle="This is controlled by external state"
            />
            <AccordionItemBody>
              Content for controlled item 1
            </AccordionItemBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeader
              leading={<RoutesIcon size="large" />}
              title="Controlled Item 2"
              subtitle="This is also controlled by external state"
            />
            <AccordionItemBody>
              Content for controlled item 2
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default AccordionExample;
``` 