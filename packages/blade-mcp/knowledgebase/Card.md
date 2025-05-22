## Component Name

Card

## Description

Cards are containers that group related content and actions on a single topic. They help separate content into distinct sections, making interfaces easier to scan and understand. Cards support various layouts with customizable headers, bodies, and footers, enabling consistent presentation of information while providing clear interaction points for users.

## Important Constraints

- `Card` component only accepts `CardHeader`, `CardBody`, `CardFooter` components as children
- `CardHeader` component only accepts `CardHeaderLeading`, `CardHeaderTrailing` components as children
- `CardFooter` component only accepts `CardFooterLeading`, `CardFooterTrailing` components as children

The browser throws an error if you don't follow the above rules. Make sure to only follow structure as given in the examples below.

## TypeScript Types

The following types define the props that the Card component and its subcomponents accept:

```typescript
export type CardProps = {
  /**
   * Card contents
   */
  children: React.ReactNode;
  /**
   * Sets the background color of the Card
   *
   * @default `surface.background.gray.intense`
   */
  backgroundColor?:
    | 'surface.background.gray.intense'
    | 'surface.background.gray.moderate'
    | 'surface.background.gray.subtle';
  /**
   * Sets the border radius of the Card
   *
   * @default `medium`
   */
  borderRadius?: Extract<BoxProps['borderRadius'], 'medium' | 'large' | 'xlarge'>;
  /**
   * Sets the elevation for Cards
   *
   * eg: `theme.elevation.midRaised`
   *
   * @default `theme.elevation.lowRaised`
   */
  elevation?: keyof Elevation;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.7`
   */
  padding?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  /**
   * Sets the width of the card
   */
  width?: BoxProps['width'];
  /**
   * Sets the height of the card
   */
  height?: BoxProps['height'];
  /**
   * Sets minimum height of the card
   */
  minHeight?: BoxProps['minHeight'];
  /**
   * Sets minimum width of the card
   */
  minWidth?: BoxProps['minWidth'];
  /**
   * Sets maximum width of the card
   */
  maxWidth?: BoxProps['maxWidth'];
  /**
   * If `true`, the card will be in selected state
   * Card will have a primary color border around it.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * Makes the Card linkable by setting the `href` prop
   *
   * @default undefined
   */
  href?: string;
  /**
   * Sets the `target` attribute for the linkable card
   */
  target?: string;
  /**
   * Sets the `rel` attribute for the linkable card
   */
  rel?: string;
  /**
   * Sets the accessibility label for the card
   * This is useful when the card has an `href` or `onClick` prop
   * Setting this will announce the label when the card is focused
   */
  accessibilityLabel?: string;
  /**
   * If `true`, the card will scale up on hover
   *
   * On mobile devices it will scale down on press
   *
   * @default false
   */
  shouldScaleOnHover?: boolean;
  /**
   * Callback triggered when the card is hovered
   */
  onHover?: () => void;
  /**
   * Callback triggered when the card is clicked
   */
  onClick?: (
    event: Platform.Select<{
      web: React.MouseEvent;
      native: GestureResponderEvent;
    }>,
  ) => void;
  /**
   * Sets the HTML element for the Card
   *
   * When `as` is set to `label`, the card will be rendered as a label element
   * This can be used to create a custom checkbox or radio button using the card
   *
   * @default undefined
   */
  as?: 'label';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type CardBodyProps = {
  children: React.ReactNode;
  height?: BoxProps['height'];
} & TestID &
  DataAnalyticsAttribute;

type CardHeaderProps = {
  children?: React.ReactNode;
  /**
   * For spacing between divider and header title
   */
  paddingBottom?: CardSpacingValueType;
  /**
   * For spacing between body content and divider
   */
  marginBottom?: CardSpacingValueType;
  /**
   * @default true
   */
  showDivider?: boolean;
} & TestID &
  DataAnalyticsAttribute;

type CardHeaderLeadingProps = {
  title: string;
  subtitle?: string;
  /**
   * prefix element of Card
   *
   * Accepts: `CardHeaderIcon` component
   */
  prefix?: React.ReactNode;
  /**
   * suffix element of Card
   *
   * Accepts: `CardHeaderCounter` component
   */
  suffix?: React.ReactNode;
} & DataAnalyticsAttribute;

type CardHeaderTrailingProps = {
  /**
   * Renders a visual ornament in card header trailing section
   *
   * Accepts: `CardHeaderLink`, `CardHeaderText`, `CardHeaderIconButton`, `CardHeaderBadge`
   */
  visual?: React.ReactNode;
};

export type CardFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};

type CardFooterProps = {
  children?: React.ReactNode;
  /**
   * For spacing between divider and footer title
   */
  paddingTop?: CardSpacingValueType;
  /**
   * For spacing between body content and divider
   */
  marginTop?: CardSpacingValueType;
  /**
   * @default true
   */
  showDivider?: boolean;
} & TestID &
  DataAnalyticsAttribute;

type CardFooterLeadingProps = {
  title?: string;
  subtitle?: string;
} & DataAnalyticsAttribute;

type CardFooterTrailingProps = {
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
} & DataAnalyticsAttribute;
```

## Example

### Basic Card with Header, Body, and Footer

A complete Card with header, body, and footer sections. Shows how to combine all Card components including icons, titles, badges, and actions.

```tsx
import {
  Card,
  CardBody,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
  Text,
  InfoIcon,
} from '@razorpay/blade/components';

const BasicCardExample = () => {
  return (
    <Card>
      <CardHeader>
        <CardHeaderLeading
          title="Card Header"
          subtitle="Subtitle text that explains more"
          prefix={<CardHeaderIcon icon={InfoIcon} />}
          suffix={<CardHeaderCounter value={12} />}
        />
        <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
      </CardHeader>
      <CardBody>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur nisl nec
          dapibus volutpat. Sed vitae fringilla justo, in finibus metus. Nulla facilisi. Nunc ac
          luctus nisi, a ultrices purus.
        </Text>
      </CardBody>
      <CardFooter>
        <CardFooterLeading title="Card footer title" subtitle="Subtitle with more information" />
        <CardFooterTrailing
          actions={{
            primary: {
              onClick: () => console.log('Primary action clicked'),
              text: 'Accept',
            },
            secondary: {
              onClick: () => console.log('Secondary action clicked'),
              text: 'Cancel',
            },
          }}
        />
      </CardFooter>
    </Card>
  );
};
```

### Interactive Cards

A Card that responds to user interaction with hover effects and selection state. Demonstrates how to create clickable cards with proper accessibility support.

```tsx
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderIcon,
  Text,
  UsersIcon,
} from '@razorpay/blade/components';
import React, { useState } from 'react';

const InteractiveCardExample = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Card
      shouldScaleOnHover
      isSelected={isSelected}
      onClick={() => setIsSelected(!isSelected)}
      accessibilityLabel="User Profile Card"
    >
      <CardHeader>
        <CardHeaderLeading
          title="User Profile"
          subtitle="Click to select this profile"
          prefix={<CardHeaderIcon icon={UsersIcon} />}
        />
      </CardHeader>
      <CardBody>
        <Text>
          This is an interactive card that scales on hover and can be selected. Click to toggle the
          selection state. The card uses accessibility features to ensure it can be used with screen
          readers.
        </Text>
      </CardBody>
    </Card>
  );
};
```
