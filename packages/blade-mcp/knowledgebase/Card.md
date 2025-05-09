## Component Name

Card

## Description

Cards are containers that group related content and actions on a single topic. They help separate content into distinct sections, making interfaces easier to scan and understand. Cards support various layouts with customizable headers, bodies, and footers, enabling consistent presentation of information while providing clear interaction points for users.

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


### Clickable Card

To make the card clickable, pass the `onClick` prop to the `Card` component.

```jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardHeaderLeading, CardBody, Text, Button } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';

const ClickableCard = () => {
  const [cardClickCount, setCardClickCount] = useState(0);
  const [buttonClickCount, setButtonClickCount] = useState(0);

  return (
    <Box>
      <Card
        accessibilityLabel="Payment Pages Card"
        onClick={() => setCardClickCount((prev) => prev + 1)}
      >
        <CardHeader>
          <CardHeaderLeading title="Payment Pages" />
        </CardHeader>
        <CardBody>
          <Text>
            Take your store online instantly with zero coding. Accept international & domestic
            payments.
          </Text>
          <Text marginY="spacing.2">
            Card Clicked: <Text as="span" weight="semibold">{cardClickCount}</Text>
          </Text>
          <Text marginY="spacing.2">
            Button Clicked: <Text as="span" weight="semibold">{buttonClickCount}</Text>
          </Text>
          <Button
            size="small"
            marginTop="spacing.5"
            onClick={() => setButtonClickCount((prev) => prev + 1)}
          >
            Get Demo
          </Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ClickableCard;
```

### Hoverable Card

To make the card scale on hover, pass the `shouldScaleOnHover` prop to the `Card` component.

```jsx
import React from 'react';
import { Card, CardHeader, CardHeaderLeading, CardBody, Text } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';

const HoverableCard = () => (
  <Box>
    <Card shouldScaleOnHover>
      <CardHeader>
        <CardHeaderLeading
          title="Payment Links"
          subtitle="Collect faster payments on UPI Payment Links with upto 50% lower fees"
        />
      </CardHeader>
      <CardBody>
        <Text>
          Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
          Accepting payments from customers is now just a link away.
        </Text>
      </CardBody>
    </Card>
  </Box>
);

export default HoverableCard;
```

### Linkable Card

To make the card a link, pass the `href` prop to the `Card` component.

```jsx
import React from 'react';
import { Card, CardHeader, CardHeaderLeading, CardBody, Text, Link } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';

const LinkableCard = () => (
  <Box>
    <Card
      href="https://razorpay.com/payment-links"
      accessibilityLabel="Payment Links"
      shouldScaleOnHover
    >
      <CardHeader>
        <CardHeaderLeading
          title="Payment Links"
          subtitle="Collect faster payments on UPI Payment Links with upto 50% lower fees"
        />
      </CardHeader>
      <CardBody>
        <Text>
          Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
          Accepting payments from customers is now just a link away.
        </Text>
        <Link marginTop="spacing.4" href="https://razorpay.com/payment-links/#overview">
          Get Demo
        </Link>
      </CardBody>
    </Card>
  </Box>
);

export default LinkableCard;
```

### Selectable Card

To make the card selectable, pass the `isSelected` prop to the `Card` component.

```jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardHeaderLeading, CardBody, Text } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';

const SelectableCard = () => {
  const [isSelected, setIsSelected] = useState(true);

  return (
    <Box>
      <Card
        shouldScaleOnHover
        isSelected={isSelected}
        onClick={() => setIsSelected(!isSelected)}
        accessibilityLabel="Payment Links Card"
      >
        <CardHeader>
          <CardHeaderLeading title="Payment Links" subtitle="Click the Card to toggle selection" />
        </CardHeader>
        <CardBody>
          <Text>
            Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
            Accepting payments from customers is now just a link away.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export default SelectableCard;
```

### Single Select Card

To make a group of cards behave like radio buttons, you can put a hidden radio input inside the `CardBody` and pass `as="label"` prop to the `Card`.

```jsx
import React, { useState } from 'react';
import { Card, CardBody, Text, Amount, VisuallyHidden } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';

const HiddenInput = ({ onChange, value, name, type }) => (
  <VisuallyHidden>
    <input
      type={type ?? 'radio'}
      onChange={(e) => onChange(e.target.value)}
      name={name}
      value={value}
    />
  </VisuallyHidden>
);

const SingleSelectCard = () => {
  const [selected, setSelected] = useState('free');

  return (
    <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'row' }}>
      <Card as="label" accessibilityLabel="Free Tier" shouldScaleOnHover isSelected={selected === 'free'}>
        <CardBody>
          <HiddenInput onChange={(value) => setSelected(value)} value="free" name="pricing-card" />
          <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
          <Box paddingX="spacing.2">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Free</Text>
            <Text>For individuals or teams just getting started with payments. No setup fees, no monthly or annual fees.</Text>
          </Box>
        </CardBody>
      </Card>
      <Card as="label" accessibilityLabel="Standard Tier" shouldScaleOnHover isSelected={selected === 'standard'}>
        <CardBody>
          <HiddenInput onChange={(value) => setSelected(value)} value="standard" name="pricing-card" />
          <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
          <Box paddingX="spacing.2">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Standard</Text>
            <Text>For teams that are scaling up and need advanced features like payment failure.</Text>
          </Box>
        </CardBody>
      </Card>
      <Card as="label" accessibilityLabel="Premium Tier" shouldScaleOnHover isSelected={selected === 'premium'}>
        <CardBody>
          <HiddenInput onChange={(value) => setSelected(value)} value="premium" name="pricing-card" />
          <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
          <Box paddingX="spacing.2">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Premium</Text>
            <Text>Best suited for businesses that need a dedicated account manager and 24x7 support.</Text>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default SingleSelectCard;
```

### Multi Select Card

To make a group of cards behave like checkboxes, you can put a hidden checkbox input inside the `CardBody` and pass `as="label"` prop to the `Card`.

```jsx
import React, { useState } from 'react';
import { Card, CardBody, Text, Amount, VisuallyHidden } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';

const HiddenInput = ({ onChange, value, name, type }) => (
  <VisuallyHidden>
    <input
      type={type ?? 'checkbox'}
      onChange={(e) => onChange(e.target.value)}
      name={name}
      value={value}
    />
  </VisuallyHidden>
);

const MultiSelectCard = () => {
  const [selected, setSelected] = useState(['free']);

  const handleChange = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'row' }}>
      <Card as="label" shouldScaleOnHover isSelected={selected.includes('free')}>
        <CardBody>
          <HiddenInput type="checkbox" onChange={(value) => handleChange(value)} value="free" name="pricing-card" />
          <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
          <Box paddingX="spacing.2">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Free</Text>
            <Text>For individuals or teams just getting started with payments. No setup fees, no monthly or annual fees.</Text>
          </Box>
        </CardBody>
      </Card>
      <Card as="label" shouldScaleOnHover isSelected={selected.includes('standard')}>
        <CardBody>
          <HiddenInput type="checkbox" onChange={(value) => handleChange(value)} value="standard" name="pricing-card" />
          <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
          <Box paddingX="spacing.2">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Standard</Text>
            <Text>For teams that are scaling up and need advanced features like payment failure.</Text>
          </Box>
        </CardBody>
      </Card>
      <Card as="label" shouldScaleOnHover isSelected={selected.includes('premium')}>
        <CardBody>
          <HiddenInput type="checkbox" onChange={(value) => handleChange(value)} value="premium" name="pricing-card" />
          <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
          <Box paddingX="spacing.2">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Premium</Text>
            <Text>Best suited for businesses that need a dedicated account manager and 24x7 support.</Text>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default MultiSelectCard;
```

### Single Select with Radio

To make a group of cards behave like radio buttons with a `Radio` component, you can use the `RadioGroup` component.

```jsx
import React, { useState } from 'react';
import { Card, CardBody, Text, Amount, Radio, RadioGroup } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';
import { Badge } from '@razorpay/blade/components/Badge';

const RadioCard = ({ value, label }) => (
  <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="flex-start">
    <Radio value={value} />
    <Box display="flex" flexDirection="column" gap="spacing.3">
      <Box display="flex" flexDirection="row" gap="spacing.4">
        <Text weight="semibold">{label}</Text>
        <Badge color="positive">Issued</Badge>
      </Box>
      <Box display="flex" flexDirection="row" gap="spacing.4">
        <Text size="small">13 Aug’23</Text>
        <Amount size="small" value={1000} />
        <Text size="small">Un-billed/₹1,000</Text>
      </Box>
    </Box>
  </Box>
);

const SingleSelectWithRadio = () => {
  const [selected, setSelected] = useState('P0');

  const onChange = (value) => {
    setSelected(value);
  };

  return (
    <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'column' }}>
      <Text>⚡️ 1 open PO(s) detected against Vendor Name, Selected: {selected}</Text>

      <RadioGroup value={selected} onChange={({ value }) => onChange(value)}>
        <Card as="label" accessibilityLabel="PO Issue 1234" isSelected={selected === 'P0'} marginBottom="spacing.2">
          <CardBody>
            <RadioCard value="P0" label="P0#123" />
          </CardBody>
        </Card>
        <Card as="label" accessibilityLabel="P1 Issue 123" isSelected={selected === 'P1'} marginBottom="spacing.2">
          <CardBody>
            <RadioCard value="P1" label="P1#123" />
          </CardBody>
        </Card>
        <Card as="label" accessibilityLabel="P2 Issue 123" isSelected={selected === 'P2'}>
          <CardBody>
            <RadioCard value="P2" label="P2#123" />
          </CardBody>
        </Card>
      </RadioGroup>
    </Box>
  );
};

export default SingleSelectWithRadio;
```

### Multi Select with Checkbox

To make a group of cards behave like checkboxes with a `Checkbox` component, you can use the `CheckboxGroup` component.

```jsx
import React, { useState } from 'react';
import { Card, CardBody, Text, Amount, Checkbox, CheckboxGroup } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components/Box';
import { Badge } from '@razorpay/blade/components/Badge';

const CheckboxCard = ({ value, label }) => (
  <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="flex-start">
    <Checkbox value={value} />
    <Box display="flex" flexDirection="column" gap="spacing.3">
      <Box display="flex" flexDirection="row" gap="spacing.4">
        <Text weight="medium">{label}</Text>
        <Badge color="positive">Issued</Badge>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.4">
        <Text size="small">13 Aug’23</Text>
        <Amount size="small" weight="medium" value={1000} />
        <Text size="small">Un-billed | ₹1,000</Text>
      </Box>
    </Box>
  </Box>
);

const MultiSelectWithCheckbox = () => {
  const [selected, setSelected] = useState(['P0']);

  const onChange = (values) => {
    setSelected(values);
  };

  return (
    <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'column' }}>
      <Text>⚡️ 1 open PO(s) detected against Vendor Name, Selected: {selected.join(', ')}</Text>

      <CheckboxGroup value={selected} onChange={({ values }) => onChange(values)}>
        <Card as="label" accessibilityLabel="PO Issue 1234" isSelected={selected.includes('P0')} marginBottom="spacing.2">
          <CardBody>
            <CheckboxCard value="P0" label="P0#123" />
          </CardBody>
        </Card>
        <Card as="label" accessibilityLabel="P1 Issue 123" isSelected={selected.includes('P1')} marginBottom="spacing.2">
          <CardBody>
            <CheckboxCard value="P1" label="P1#123" />
          </CardBody>
        </Card>
        <Card as="label" accessibilityLabel="P2 Issue 123" isSelected={selected.includes('P2')}>
          <CardBody>
            <CheckboxCard value="P2" label="P2#123" />
          </CardBody>
        </Card>
      </CheckboxGroup>
    </Box>
  );
};

export default MultiSelectWithCheckbox;
```