## Component Name

List

## Description

The List component displays a set of related items in a structured format. This is blade's equivalent of `ul` and `ol` HTML elements. It supports ordered, unordered, and ordered-filled variants with customizable sizes and styling. Lists can be nested for hierarchical data representation and include specialized item types for links, code snippets, and formatted text, making them versatile for various content presentation needs.

## TypeScript Types

The following types represent the props that the List component and its subcomponents accept. These allow you to properly configure the components according to your needs.

```typescript
/**
 * Props for the List component
 */
type ListProps = {
  /**
   * List display style
   * @default 'unordered'
   */
  variant?: 'unordered' | 'ordered' | 'ordered-filled';

  /**
   * Size of the list
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Content to be rendered inside the list
   */
  children: React.ReactNode;

  /**
   * Custom icon for list items
   */
  icon?: React.ComponentType<IconProps>;

  /**
   * Color of the custom icon
   */
  iconColor?: string;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the ListItem component
 */
type ListItemProps = {
  /**
   * Content to be rendered inside the list item
   */
  children: React.ReactNode;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the ListItemText component
 */
type ListItemTextProps = {
  /**
   * Content to be rendered inside the list item text
   */
  children: React.ReactNode;

  /**
   * HTML element to render
   * @default 'p'
   */
  as?: React.ElementType;

  /**
   * Text color
   */
  color?: string;

  /**
   * Font weight
   */
  weight?: 'regular' | 'medium' | 'semibold';
} & StyledPropsBlade &
  TestID;

/**
 * Props for the ListItemLink component
 */
type ListItemLinkProps = {
  /**
   * Content to be rendered inside the list item link
   */
  children: React.ReactNode;

  /**
   * URL that the link points to
   */
  href?: string;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the ListItemCode component
 */
type ListItemCodeProps = {
  /**
   * Content to be rendered inside the code element
   */
  children: React.ReactNode;
} & StyledPropsBlade &
  TestID;

/**
 * Props for all Icon components
 */
type IconProps = {
  /**
   * The color of the icon
   */
  color?: string;

  /**
   * The size of the icon
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
};
```

## Examples

### Ordered Filled List with Links

This example demonstrates the ordered-filled variant with links for step-by-step instructions.

```tsx
import React from 'react';
import { Box, List, ListItem, ListItemLink, Heading } from '@razorpay/blade/components';

const OrderedFilledListExample = () => {
  return (
    <Box padding="spacing.5">
      <Heading size="large">Ordered Filled List</Heading>

      <List variant="ordered-filled" size="medium">
        <ListItem>
          <ListItemLink href="#integration">Build Integration:</ListItemLink> Use the sample codes
          to integrate the Razorpay Web Standard Checkout on your website.
        </ListItem>
        <ListItem>
          <ListItemLink href="#testing">Test Integration:</ListItemLink> Test the integration to
          ensure it was successful.
        </ListItem>
        <ListItem>
          <ListItemLink href="#golive">Go-live Checklist:</ListItemLink> Check the go-live checklist
          before taking the integration live.
        </ListItem>
      </List>
    </Box>
  );
};

export default OrderedFilledListExample;
```

### Advanced List Features

This example demonstrates advanced list features including custom icons, code snippets, and styled text elements.

```tsx
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemLink,
  ListItemCode,
  Heading,
  BookmarkIcon,
} from '@razorpay/blade/components';

const AdvancedListExample = () => {
  return (
    <Box padding="spacing.5">
      <Heading size="large">Advanced List Features</Heading>

      <List
        variant="unordered"
        size="medium"
        icon={BookmarkIcon}
        iconColor="interactive.icon.primary.normal"
      >
        <ListItem>
          <ListItemLink href="#resources">Documentation Resources</ListItemLink>
          <List variant="ordered" size="medium">
            <ListItem>
              Install with: <ListItemCode>npm install @razorpay/blade</ListItemCode>
            </ListItem>
            <ListItem>
              <ListItemText>
                Check
                <ListItemText as="span" weight="semibold" color="feedback.text.positive.intense">
                  {' successful '}
                </ListItemText>
                installation
              </ListItemText>
            </ListItem>
          </List>
        </ListItem>
        <ListItem>
          <ListItemLink href="#payment-methods">Payment Methods</ListItemLink>
          <List variant="ordered" size="small">
            <ListItem>
              <ListItemText>
                UPI status is
                <ListItemText as="span" color="feedback.text.positive.intense">
                  {' active '}
                </ListItemText>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Card status is
                <ListItemText as="span" color="feedback.text.notice.intense">
                  {' pending '}
                </ListItemText>
              </ListItemText>
            </ListItem>
            <ListItem>
              Add test cards: <ListItemCode>4111 1111 1111 1111</ListItemCode>
            </ListItem>
          </List>
        </ListItem>
        <ListItem>
          <ListItemLink href="#troubleshooting">Troubleshooting</ListItemLink>
          <List variant="unordered" size="small">
            <ListItem>
              Check console logs with: <ListItemCode>console.log(error)</ListItemCode>
            </ListItem>
            <ListItem>
              <ListItemText>
                Payment errors are marked as
                <ListItemText as="span" weight="semibold" color="feedback.text.negative.intense">
                  {' failed '}
                </ListItemText>
              </ListItemText>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </Box>
  );
};

export default AdvancedListExample;
```
