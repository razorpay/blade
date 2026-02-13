import type { Snippet, Component } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconProps } from '../Icons/types';

// Icon component type - Svelte component that accepts IconProps
export type IconComponent = Component<IconProps>;

export type CardSpacingValueType =
  | 'spacing.0'
  | 'spacing.3'
  | 'spacing.4'
  | 'spacing.5'
  | 'spacing.7';

export type CardProps = {
  /**
   * Card contents
   */
  children: Snippet;
  /**
   * Sets the background color of the Card
   *
   * @default 'surface.background.gray.intense'
   */
  backgroundColor?:
    | 'surface.background.gray.subtle'
    | 'surface.background.gray.moderate'
    | 'surface.background.gray.intense';
  /**
   * Sets the border radius of the Card
   *
   * @default 'medium'
   */
  borderRadius?: 'medium' | 'large' | 'xlarge';
  /**
   * Sets the elevation for Cards
   *
   * @default 'lowRaised'
   */
  elevation?: 'none' | 'lowRaised' | 'midRaised' | 'highRaised';
  /**
   * Sets the padding equally on all sides. Only few spacing tokens are allowed deliberately
   *
   * @default 'spacing.7'
   */
  padding?: CardSpacingValueType;
  /**
   * Sets the width of the card
   */
  width?: string;
  /**
   * Sets the height of the card
   */
  height?: string;
  /**
   * Sets minimum height of the card
   */
  minHeight?: string;
  /**
   * Sets minimum width of the card
   */
  minWidth?: string;
  /**
   * Sets maximum width of the card
   */
  maxWidth?: string;
  /**
   * If `true`, the card will be in selected state.
   * Card will have a primary color border around it.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * Makes the Card linkable by setting the `href` prop
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
   * Sets the accessibility label for the card.
   * This is useful when the card has an `href` or `onClick` prop.
   */
  accessibilityLabel?: string;
  /**
   * If `true`, the card will scale up on hover.
   * On mobile devices it will scale down on press.
   *
   * @deprecated This prop is deprecated in favour of motion presets released in v12
   * @default false
   */
  shouldScaleOnHover?: boolean;
  /**
   * Callback triggered when the card is hovered
   */
  onHover?: () => void;
  /**
   * Sets the size of the card header title
   *
   * @default 'large'
   */
  size?: 'large' | 'medium';
  /**
   * Callback triggered when the card is clicked
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Sets the HTML element for the Card.
   * When `as` is set to `label`, the card will be rendered as a label element.
   */
  as?: 'label';
  /**
   * CSS cursor value for the card
   */
  cursor?: string;
  /**
   * Validation state for the card border
   *
   * @default 'none'
   */
  validationState?: 'none' | 'error' | 'success';
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type CardBodyProps = {
  /**
   * Card body contents
   */
  children: Snippet;
  /**
   * Sets the height of the card body
   */
  height?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

export type CardHeaderProps = {
  /**
   * Card header contents (CardHeaderLeading and/or CardHeaderTrailing)
   */
  children?: Snippet;
  /**
   * For spacing between divider and header title
   *
   * @default 'spacing.4'
   */
  paddingBottom?: CardSpacingValueType;
  /**
   * For spacing between body content and divider
   *
   * @default 'spacing.4'
   */
  marginBottom?: CardSpacingValueType;
  /**
   * Whether to show the divider below the header
   *
   * @default true
   */
  showDivider?: boolean;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

export type CardHeaderLeadingProps = {
  /**
   * Title text for the card header
   */
  title: string;
  /**
   * Subtitle text for the card header
   */
  subtitle?: string;
  /**
   * Prefix element of Card header.
   * Accepts CardHeaderIcon component via Snippet.
   */
  prefix?: Snippet;
  /**
   * Suffix element of Card header.
   * Adds marginLeft to CardHeaderCounter, CardHeaderLink components by default.
   */
  suffix?: Snippet;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

export type CardHeaderTrailingProps = {
  /**
   * Renders a visual ornament in card header trailing section
   */
  visual?: Snippet;
};

export type CardHeaderIconButtonProps = {
  /**
   * Icon component to render in the button
   */
  icon: IconComponent;
  /**
   * Whether the button is disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the button is in a loading state
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * Callback triggered when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * The accessible label for the button
   */
  accessibilityLabel?: string;
  /**
   * Button type attribute
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * Test ID for testing
   */
  testID?: string;
};

export type CardFooterProps = {
  /**
   * Card footer contents (CardFooterLeading and/or CardFooterTrailing)
   */
  children?: Snippet;
  /**
   * For spacing between divider and footer title
   *
   * @default 'spacing.4'
   */
  paddingTop?: CardSpacingValueType;
  /**
   * For spacing between body content and divider
   *
   * @default 'spacing.4'
   */
  marginTop?: CardSpacingValueType;
  /**
   * Whether to show the divider above the footer
   *
   * @default true
   */
  showDivider?: boolean;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

export type CardFooterAction = {
  /**
   * Button text
   */
  text?: string;
  /**
   * Button type attribute
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * The accessible label for the button
   */
  accessibilityLabel?: string;
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  /**
   * Whether the button is disabled
   */
  isDisabled?: boolean;
  /**
   * Icon component for the button
   */
  icon?: IconComponent;
  /**
   * Position of the icon
   */
  iconPosition?: 'left' | 'right';
  /**
   * Callback triggered when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
};

export type CardFooterLeadingProps = {
  /**
   * Footer leading title
   */
  title?: string;
  /**
   * Footer leading subtitle
   */
  subtitle?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

export type CardFooterTrailingProps = {
  /**
   * Primary and secondary action buttons
   */
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};
