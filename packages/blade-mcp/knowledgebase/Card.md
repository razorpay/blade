## Component Name

Card

## Description

Cards are containers that group related content and actions on a single topic. They help separate content into distinct sections, making interfaces easier to scan and understand. Cards support various layouts with customizable headers, bodies, and footers, enabling consistent presentation of information while providing clear interaction points for users.

**Important Note:**

- `Card` component only accepts `CardHeader`, `CardBody`, `CardFooter` components as children
- `CardHeader` component only accepts `CardHeaderLeading`, `CardHeaderTrailing` components as children
- `CardFooter` component only accepts `CardFooterLeading`, `CardFooterTrailing` components as children

The browser throws an error if you don't follow the above rules. Make sure to only follow structure as given in the examples below.

## TypeScript Types

The following types represent the props that the Card component and its subcomponents accept. These allow you to properly configure the Card component according to your needs.

```typescript
/**
 * Props for the Card component
 */
type CardProps = {
  /**
   * The content to be displayed inside the card
   */
  children: React.ReactNode;

  /**
   * Background color of the card
   * @default 'surface.background.white.normal'
   */
  backgroundColor?: string;

  /**
   * Border radius of the card
   * @default 'medium'
   */
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';

  /**
   * Elevation (shadow) level of the card
   * @default 'lowRaised'
   */
  elevation?: 'lowRaised' | 'midRaised' | 'highRaised';

  /**
   * Padding applied to the card
   * @default 'spacing.7'
   */
  padding?: CardSpacingValueType;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;

/**
 * Spacing values that can be used in Card components
 */
type CardSpacingValueType = 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';

/**
 * Props for the CardHeader component
 */
type CardHeaderProps = {
  /**
   * Content of the header
   */
  children: React.ReactNode;

  /**
   * Padding at the bottom of the header
   * @default 'spacing.4'
   */
  paddingBottom?: CardSpacingValueType;

  /**
   * Margin at the bottom of the header
   * @default 'spacing.4'
   */
  marginBottom?: CardSpacingValueType;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderLeading component
 */
type CardHeaderLeadingProps = {
  /**
   * Title text of the header
   */
  title: string;

  /**
   * Subtitle text of the header
   */
  subtitle?: string;

  /**
   * Element to display before the title
   */
  prefix?: React.ReactNode;

  /**
   * Element to display after the title
   */
  suffix?: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderTrailing component
 */
type CardHeaderTrailingProps = {
  /**
   * Visual element to display in the trailing section
   */
  visual?: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderIcon component
 */
type CardHeaderIconProps = {
  /**
   * Icon component to display
   */
  icon: IconComponent;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderCounter component
 */
type CardHeaderCounterProps = {
  /**
   * Numeric value to display in the counter
   */
  value: number;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderBadge component
 */
type CardHeaderBadgeProps = {
  /**
   * Content of the badge
   */
  children: React.ReactNode;

  /**
   * Color of the badge
   * @default 'primary'
   */
  color?: 'primary' | 'positive' | 'negative' | 'notice';
} & StyledPropsBlade;

/**
 * Props for the CardHeaderIconButton component
 */
type CardHeaderIconButtonProps = {
  /**
   * Icon component for the button
   */
  icon: IconComponent;

  /**
   * Function called when the button is clicked
   */
  onClick?: () => void;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderLink component
 */
type CardHeaderLinkProps = {
  /**
   * URL the link points to
   */
  href: string;

  /**
   * Content of the link
   */
  children: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderText component
 */
type CardHeaderTextProps = {
  /**
   * Text content to display
   */
  children: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the CardHeaderAmount component
 */
type CardHeaderAmountProps = {
  /**
   * Numeric value to display as currency amount
   */
  value: number;

  /**
   * Currency code
   * @default 'INR'
   */
  currency?: string;
} & StyledPropsBlade;

/**
 * Props for the CardBody component
 */
type CardBodyProps = {
  /**
   * Content of the card body
   */
  children: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the CardFooter component
 */
type CardFooterProps = {
  /**
   * Content of the footer
   */
  children: React.ReactNode;

  /**
   * Padding at the top of the footer
   * @default 'spacing.4'
   */
  paddingTop?: CardSpacingValueType;

  /**
   * Margin at the top of the footer
   * @default 'spacing.4'
   */
  marginTop?: CardSpacingValueType;
} & StyledPropsBlade;

/**
 * Props for the CardFooterLeading component
 */
type CardFooterLeadingProps = {
  /**
   * Title text of the footer
   */
  title?: string;

  /**
   * Subtitle text of the footer
   */
  subtitle?: string;
} & StyledPropsBlade;

/**
 * Props for the CardFooterTrailing component
 */
type CardFooterTrailingProps = {
  /**
   * Actions for the footer buttons
   */
  actions: {
    /**
     * Configuration for the primary action button
     */
    primary?: CardFooterAction;

    /**
     * Configuration for the secondary action button
     */
    secondary?: CardFooterAction;
  };
} & StyledPropsBlade;

/**
 * Configuration for a footer action button
 */
type CardFooterAction = {
  /**
   * Text to display on the button
   */
  text: string;

  /**
   * Function called when the button is clicked
   */
  onClick: () => void;

  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Icon to display on the button
   */
  icon?: IconComponent;

  /**
   * Accessible label for the button
   */
  accessibilityLabel?: string;

  /**
   * Position of the icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Whether to show loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * HTML button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
};

/**
 * Type for icon components
 */
type IconComponent = React.ComponentType<{
  size?: 'small' | 'medium' | 'large';
  color?: string;
}>;
```

## Example

### Basic Card Usage

This example demonstrates a simple Card with essential props.

```tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardHeaderLeading,
  CardBody,
  CardFooter,
  CardFooterTrailing,
  Text,
} from '@razorpay/blade/components';

const BasicCard = () => {
  return (
    <Card
      backgroundColor="surface.background.white.normal"
      borderRadius="medium"
      elevation="lowRaised"
      padding="spacing.7"
      testID="basic-card"
    >
      <CardHeader marginBottom="spacing.4">
        <CardHeaderLeading
          title="Payment Features"
          subtitle="Learn about Razorpay payment options"
        />
      </CardHeader>

      <CardBody>
        <Text>
          Razorpay offers a variety of payment methods to help businesses accept payments online.
          Explore our solutions to find the right fit for your business needs.
        </Text>
      </CardBody>

      <CardFooter marginTop="spacing.4">
        <CardFooterTrailing
          actions={{
            primary: {
              text: 'Learn More',
              onClick: () => console.log('Learn more clicked'),
            },
          }}
        />
      </CardFooter>
    </Card>
  );
};

export default BasicCard;
```

### Selectable Card

This example shows how to implement a selectable Card with state management.

```tsx
import React, { useState } from 'react';
import { Card, CardBody, Text, Box } from '@razorpay/blade/components';

const SelectableCard = () => {
  const [isSelected, setIsSelected] = useState(false);

  const handleCardClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      backgroundColor={
        isSelected ? 'surface.background.primary.subtle' : 'surface.background.white.normal'
      }
      borderRadius="medium"
      elevation={isSelected ? 'midRaised' : 'lowRaised'}
      padding="spacing.7"
      onClick={handleCardClick}
      data-analytics="selectable-card"
      testID="selectable-card"
    >
      <CardBody>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text fontWeight={isSelected ? 'bold' : 'normal'}>
            Click to {isSelected ? 'deselect' : 'select'} this payment option
          </Text>
          {isSelected && (
            <Box
              width="16px"
              height="16px"
              borderRadius="full"
              backgroundColor="surface.background.primary.normal"
            />
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default SelectableCard;
```

### Multi-Select Card Group

This example demonstrates using multiple Cards in a selectable group.

```tsx
import React, { useState } from 'react';
import { Card, CardBody, Text, Box } from '@razorpay/blade/components';

const MultiSelectCardGroup = () => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const cards = [
    { id: 'card1', title: 'Credit Card' },
    { id: 'card2', title: 'Debit Card' },
    { id: 'card3', title: 'UPI' },
  ];

  const toggleCard = (id: string) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id],
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Text>Select payment methods (multiple allowed):</Text>

      {cards.map((card) => {
        const isSelected = selectedCards.includes(card.id);

        return (
          <Card
            key={card.id}
            backgroundColor={
              isSelected ? 'surface.background.primary.subtle' : 'surface.background.white.normal'
            }
            borderRadius="medium"
            elevation={isSelected ? 'midRaised' : 'lowRaised'}
            padding="spacing.5"
            onClick={() => toggleCard(card.id)}
            testID={`payment-card-${card.id}`}
          >
            <CardBody>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Text>{card.title}</Text>
                {isSelected && (
                  <Box
                    width="16px"
                    height="16px"
                    borderRadius="full"
                    backgroundColor="surface.background.primary.normal"
                  />
                )}
              </Box>
            </CardBody>
          </Card>
        );
      })}

      <Text marginTop="spacing.3">
        Selected:{' '}
        {selectedCards.length > 0
          ? selectedCards.map((id) => cards.find((c) => c.id === id)?.title).join(', ')
          : 'None'}
      </Text>
    </Box>
  );
};

export default MultiSelectCardGroup;
```
