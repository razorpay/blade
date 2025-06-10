# InfoGroup

## Description

InfoGroup is a structured component for displaying key-value pairs in a consistent, organized format. It provides a standardized way to present information such as transaction details, user data, or any related data pairs with proper visual hierarchy and alignment. The component supports both horizontal and vertical orientations, customizable alignment options, interactive elements, and responsive grid layouts for optimal data presentation across different use cases.

## TypeScript Types

These types define the props that InfoGroup component and its subcomponents accept. Use these to understand the available configuration options when implementing InfoGroup in your application.

```typescript
import type { IconComponent } from '@razorpay/blade/components';
import type { StringChildrenType, TestID } from '@razorpay/blade/utils';
import type { StyledPropsBlade } from '@razorpay/blade/components';
import type { BoxProps } from '@razorpay/blade/components';

export type InfoGroupProps = {
  /**
   * Defines how Key and Value are arranged — side by side or stacked
   * @default 'horizontal'
   */
  itemOrientation?: 'horizontal' | 'vertical';

  /**
   * Shows the size of the component
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Defines the alignment of the key content
   * @default 'left'
   */
  keyAlign?: 'left' | 'right';

  /**
   * Defines the alignment of the value content
   * @default 'left'
   */
  valueAlign?: 'left' | 'right';

  /**
   * Controls whether vertical dividers are rendered
   * @default false
   */
  isHighlighted?: boolean;

  /**
   * Custom grid template columns for the InfoGroup layout
   *
   * @default 'max-content 1fr' for horizontal itemOrientation
   * @default 'repeat(min(4, ${React.Children.count(children)}), 1fr)' for vertical itemOrientation
   */
  gridTemplateColumns?: BoxProps['gridAutoColumns'];

  /**
   * Children should be InfoItem components
   */
  children: React.ReactNode;
} & TestID &
  StyledPropsBlade &
  Pick<
    BoxProps,
    | 'width'
    | 'maxWidth'
    | 'minWidth'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'paddingBottom'
    | 'padding'
    | 'paddingX'
    | 'paddingY'
  >;

export type InfoItemProps = {
  /**
   * Content should be InfoItemKey and InfoItemValue components
   */
  children: React.ReactNode;

  /**
   * Controls whether vertical dividers are rendered for this item
   * @default false
   */
  isHighlighted?: boolean;
} & TestID;

type TitlePeripheralProps = {
  /**
   * Leading element - can be icon component, avatar, or any React element
   */
  leading?: IconComponent | React.ReactElement;

  /**
   * Trailing element - can be icon component, avatar, or any React element
   */
  trailing?: IconComponent | React.ReactElement;

  /**
   * Additional help text to provide context
   */
  helpText?: string;

  /**
   * Truncates text after specified number of lines
   * @default undefined
   */
  truncateAfterLines?: number;
};

export type InfoItemKeyProps = {
  /**
   * Content of the key.
   */
  children?: StringChildrenType;
} & TitlePeripheralProps &
  TestID;

export type InfoItemValueProps = {
  /**
   * Content of the value - text string, components, or other ReactNode
   */
  children?: React.ReactNode;
} & TitlePeripheralProps &
  TestID;

type TestID = {
  /**
   * Test id that can be used to select element in testing environments
   *
   * Checkout https://testing-library.com/docs/queries/bytestid/
   */
  testID?: string;
};

type StringChildrenType = React.ReactText | React.ReactText[];
```

## Examples

### Basic InfoGroup with Horizontal Layout

This example demonstrates the most common usage of InfoGroup with horizontal layout where keys and values are displayed side by side.

Use this layout for displaying detailed information in forms, dashboards, or detail views.

```jsx
import {
  InfoGroup,
  InfoItem,
  InfoItemKey,
  InfoItemValue,
  Amount,
} from '@razorpay/blade/components';

function BasicInfoGroup() {
  return (
    <InfoGroup
      itemOrientation="horizontal"
      size="medium"
      keyAlign="left"
      valueAlign="left"
      maxWidth="600px"
    >
      <InfoItem>
        <InfoItemKey>Account Holder</InfoItemKey>
        <InfoItemValue>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Payment Method</InfoItemKey>
        <InfoItemValue>Credit Card</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Transaction Amount</InfoItemKey>
        <InfoItemValue>
          <Amount weight="semibold" color="surface.text.gray.subtle" value={123456} size="medium" />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Transaction Date</InfoItemKey>
        <InfoItemValue>Dec 15, 2023</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Status</InfoItemKey>
        <InfoItemValue>Completed</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
}
```

### Vertical Layout with Grid Configuration

This example shows how to use InfoGroup in vertical orientation. With key and value stacked vertically.

```jsx
import {
  InfoGroup,
  InfoItem,
  InfoItemKey,
  InfoItemValue,
  Amount,
  UserIcon,
  BankIcon,
  CheckIcon,
} from '@razorpay/blade/components';

function VerticalInfoGroup() {
  return (
    <InfoGroup
      // adds item in vertical orientation. key and value will be stacked vertically
      itemOrientation="vertical"
      size="medium"
      isHighlighted={true}
      // places items in 3 columns
      gridTemplateColumns="repeat(3, 1fr)"
      maxWidth="900px"
    >
      <InfoItem>
        <InfoItemKey leading={UserIcon}>Account Holder</InfoItemKey>
        <InfoItemValue>Saurabh Daware</InfoItemValue>
      </InfoItem>

      <InfoItem>
        <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
        <InfoItemValue>pay_MK7DGqwYXEwx9Q</InfoItemValue>
      </InfoItem>

      <InfoItem>
        <InfoItemKey leading={BankIcon}>Transaction Amount</InfoItemKey>
        <InfoItemValue>
          <Amount weight="semibold" color="surface.text.gray.subtle" value={575025} size="medium" />
        </InfoItemValue>
      </InfoItem>

      <InfoItem>
        <InfoItemKey leading={UserIcon}>Customer Email</InfoItemKey>
        <InfoItemValue>saurabh.daware@example.com</InfoItemValue>
      </InfoItem>

      <InfoItem>
        <InfoItemKey leading={CheckIcon}>Payment Status</InfoItemKey>
        <InfoItemValue trailing={CheckIcon}>Authorized</InfoItemValue>
      </InfoItem>

      <InfoItem>
        <InfoItemKey leading={BankIcon}>Settlement Date</InfoItemKey>
        <InfoItemValue>Dec 16, 2023</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
}
```
