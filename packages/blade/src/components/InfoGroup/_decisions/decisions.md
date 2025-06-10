# InfoGroup

InfoGroup is a structured component for displaying key-value pairs in a consistent, organized format. It provides a standardized way to present information such as transaction details, user data, or any related data pairs with proper visual hierarchy and alignment. The component supports various orientations, sizes, and customization options to suit different use cases across dashboards, modals, drawers, and detail views.

<p align="center"><img src="./2025-05-28-13-36-53.png" alt="InfoGroup" width="800px" /></p>

## Design

- [Figma - InfoGroup](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=99000-73547&p=f&m=dev)

## API

The InfoGroup component uses a compound structure with an outer container and InfoItem sub-components for individual key-value pairs. This approach allows layout and styling props to be defined once at the container level.

```jsx
import {
  InfoGroup,
  InfoItem,
  InfoItemKey,
  InfoItemValue,
  Divider,
} from '@razorpay/blade/components';

<InfoGroup itemOrientation="horizontal" size="medium">
  <InfoItem>
    <InfoItemKey leading={UserIcon} helpText="Customer information">
      Account Holder
    </InfoItemKey>
    <InfoItemValue trailing={CheckIcon}>Saurabh Daware</InfoItemValue>
  </InfoItem>
  <Divider />
  <InfoItem>
    <InfoItemKey>Payment ID</InfoItemKey>
    <InfoItemValue trailing={CopyIcon}>
      <Code size="small">pay_MK7DGqwYXEwx9Q</Code>
    </InfoItemValue>
  </InfoItem>
</InfoGroup>;
```

<details>
  <summary>Alternate APIs</summary>

### Alternate API 1: Single Component with Props

```jsx
<InfoGroup itemOrientation="horizontal" size="medium">
  <InfoItem
    keyText="Account Holder"
    valueText="Saurabh Daware"
    keyIcon={UserIcon}
    valueIcon={CheckIcon}
  />
  <InfoItem keyText="Payment ID" valueText="pay_MK7DGqwYXEwx9Q" valueType="code" />
</InfoGroup>
```

**Pros:**

- Simpler API with fewer components to remember
- Faster to write for basic use cases
- Consistent prop naming pattern
- Less verbose for simple key-value pairs

**Cons:**

- Less flexible for complex value layouts
- Cannot compose with other Blade components easily
- Limited customization options for styling individual parts
- Props can become numerous for complex scenarios
- Harder to extend for future use cases

</details>

### Props

#### InfoGroup

```typescript
type InfoGroupProps = {
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
   * Defines whether the value is aligned left or right
   * @default 'left'
   */
  valueAlign?: 'left' | 'right';

  /**
   * Controls whether vertical dividers are rendered next to the item
   * @default false
   */
  isHighlighted?: boolean;

  /**
   * Custom grid template columns for the InfoGroup layout
   *
   * @default 'max-content 1fr' for horizontal itemOrientation
   * @default 'repeat(min(3, ${React.Children.count(children)}), 1fr)' for vertical itemOrientation
   */
  gridTemplateColumns?: BoxProps['gridAutoColumns'];
  /**
   * Children should be InfoItem components
   */
  children: React.ReactNode;
} & StyledPropsBlade &
  Pick<
    BoxProps,
    | 'width'
    | 'minWidth'
    | 'maxWidth'
    | 'padding'
    | 'paddingX'
    | 'paddingY'
    | 'paddingTop'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
  >;
```

#### InfoItem

```typescript
type InfoItemProps = {
  /**
   * Content should be InfoItemKey and InfoItemValue components
   */
  children: React.ReactNode;

  /**
   * Controls whether vertical dividers are rendered for this item
   * @default false
   */
  isHighlighted?: boolean;
};
```

#### InfoItemKey

```typescript
type InfoItemKeyProps = {
  /**
   * Leading element - can be icon, avatar, or any React element
   */
  leading?: React.ReactElement | IconComponent;

  /**
   * Trailing element - can be icon, avatar, or any React element
   */
  trailing?: React.ReactElement | IconComponent;

  /**
   * Additional help text to provide context for the key
   */
  helpText?: string;

  /**
   * Truncates text after specified number of lines
   * @default undefined
   */
  truncateAfterLines?: number;

  /**
   * Content of the key.
   */
  children?: StringChildrenType;
};
```

#### InfoItemValue

```typescript
type InfoItemValueProps = {
  /**
   * Leading element - can be icon, avatar, or any React element
   */
  leading?: React.ReactElement | IconComponent;

  /**
   * Trailing element - can be icon, avatar, or any React element
   */
  trailing?: React.ReactElement | IconComponent;

  /**
   * Additional help text to provide context for the key
   */
  helpText?: string;

  /**
   * Truncates text after specified number of lines
   * @default undefined
   */
  truncateAfterLines?: number;

  /**
   * Content of the value - text, components, or other ReactNode
   */
  children?: React.ReactNode;
};
```

## Examples

### Basic Key-Value Display

Simple horizontal layout with text-based key-value pairs.

```jsx
<InfoGroup itemOrientation="horizontal" size="medium">
  <InfoItem>
    <InfoItemKey>Account Holder</InfoItemKey>
    <InfoItemValue>Saurabh Daware</InfoItemValue>
  </InfoItem>
  <InfoItem>
    <InfoItemKey>Payment Method</InfoItemKey>
    <InfoItemValue>Credit Card</InfoItemValue>
  </InfoItem>
</InfoGroup>
```

### Different orientations

<table>
<tr>
<th>Code</th>
<th>Preview</th>
</tr>
<tr>
<td>

```jsx
<InfoGroup itemOrientation="horizontal" size="medium">
  <InfoItem>
    <InfoItemKey>Account Holder</InfoItemKey>
    <InfoItemValue>Saurabh Daware</InfoItemValue>
  </InfoItem>
</InfoGroup>
```

</td>
<td>
  <img src="./2025-05-28-11-01-20.png" alt="Horizontal" width="300px" />
</td>

</tr>

<tr>
<td>

```jsx
<InfoGroup itemOrientation="vertical" size="medium">
  <InfoItem>
    <InfoItemKey>Account Holder</InfoItemKey>
    <InfoItemValue>Saurabh Daware</InfoItemValue>
  </InfoItem>
</InfoGroup>
```

</td>
<td>

<img src="./2025-05-28-11-03-40.png" alt="Vertical" width="300px" />

</td>

</tr>
</table>

### With Avatars and Custom Elements

Using avatars and other React elements with the flexible leading/trailing props.

```jsx
<InfoGroup itemOrientation="horizontal" size="large">
  <InfoItem>
    <InfoItemKey
      leading={<Avatar size="medium" name="Saurabh Daware" />}
      helpText="Account holder profile"
    >
      Account Holder
    </InfoItemKey>
    <InfoItemValue trailing={ExternalLinkIcon}>Saurabh Daware</InfoItemValue>
  </InfoItem>
  <InfoItem>
    <InfoItemKey leading={BankIcon}>Bank Account</InfoItemKey>
    <InfoItemValue
      leading={
        <Badge size="small" color="positive">
          Verified
        </Badge>
      }
    >
      HDFC Bank
    </InfoItemValue>
  </InfoItem>
</InfoGroup>
```

### Vertical Layout with Icons

Vertical orientation with leading icons and help text.

```jsx
<InfoGroup itemOrientation="vertical" size="large">
  <InfoItem>
    <InfoItemKey leading={UserIcon} helpText="Primary account holder name">
      Account Holder
    </InfoItemKey>
    <InfoItemValue leading={CheckIcon}>Saurabh Daware</InfoItemValue>
  </InfoItem>
  <InfoItem>
    <InfoItemKey leading={CreditCardIcon}>Payment Method</InfoItemKey>
    <InfoItemValue>Credit Card</InfoItemValue>
  </InfoItem>
</InfoGroup>
```

### Complex Value with Custom Components

Using Blade components and custom layouts for complex value rendering.

```jsx
<InfoGroup itemOrientation="horizontal" size="medium" valueAlign="right">
  <InfoItem>
    <InfoItemKey leading={BankIcon} helpText="Bank account details">
      Bank Account
    </InfoItemKey>
    <InfoItemValue>
      <Box display="flex" alignItems="center" gap="spacing.2">
        <Amount size="small" currency="INR" value={7890} />
        <Badge size="small" color="positive">
          Verified
        </Badge>
        <IconButton icon={ExternalLinkIcon} size="small" accessibilityLabel="View details" />
      </Box>
    </InfoItemValue>
  </InfoItem>

  <InfoItem>
    <InfoItemKey>IFSC Code</InfoItemKey>
    <InfoItemValue trailing={CopyIcon}>
      <Code size="small">HDFC0001234</Code>
    </InfoItemValue>
  </InfoItem>
</InfoGroup>
```

## Accessibility

- InfoGroup maintains proper semantic structure with `dl`, `dt`, and `dd` elements for screen readers
- InfoItem components have appropriate ARIA labels and relationships between keys and values
- Icons include meaningful `accessibilityLabel` props
- Sufficient color contrast ratios for all text combinations
- Focus management follows logical tab order through interactive elements
- Screen reader announces the relationship between keys and values clearly

## Open Questions

- ### Should we have `showDivider` prop or let consumer use `<Divider />` directly?

  - Decided to go with `<Divider />` because it is more intuitive and follows 'What you see is what you get' philosophy and avoids new props.

- ### `orientation` prop vs `itemOrientation` prop

  - Earlier we had thought of `orientation` prop although it can be confusing because `orientation="vertical"` on InfoGroup will mean that the items themselves are horizontally placed but the key and values inside the item are vertically placed

- ### `leading` and `trailing` props types

  - We have been following `leading={<InfoItemIcon icon={BankIcon} />}` and `trailing={<InfoItemIcon icon={CopyIcon} />}` type of API for other components.
  - Although that leads to us creating too many wrapper components.
  - We decided to go with `leading={BankIcon}` and `leading={<Avatar />}` type of API as it avoids extra wrappers.
