import type { Snippet } from 'svelte';
import type { TestID } from '@razorpay/blade-core/utils';
import type { DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type CardSpacingValueType = 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';

export type CardSurfaceBackgroundColors =
  | 'surface.background.gray.intense'
  | 'surface.background.gray.moderate'
  | 'surface.background.gray.subtle';

export type CardProps = {
  /**
   * Card contents
   */
  children: Snippet;
  /**
   * Sets the background color of the Card
   *
   * @default `surface.background.gray.intense`
   */
  backgroundColor?: CardSurfaceBackgroundColors;
  /**
   * Sets the border radius of the Card
   *
   * @default `medium`
   */
  borderRadius?: 'medium' | 'large' | 'xlarge';
  /**
   * Sets the elevation for Cards
   *
   * @default `lowRaised`
   */
  elevation?: 'none' | 'lowRaised' | 'midRaised' | 'highRaised';
  /**
   * Sets the padding equally on all sides
   * @default `spacing.7`
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
   * If `true`, the card will be in selected state
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
   * Sets the accessibility label for the card
   */
  accessibilityLabel?: string;
  /**
   * If `true`, the card will scale up on hover
   * @deprecated This prop is deprecated in favour of motion presets
   * @default false
   */
  shouldScaleOnHover?: boolean;
  /**
   * Callback triggered when the card is hovered
   */
  onHover?: () => void;
  /**
   * Sets the size of the card header title
   * @default 'large'
   */
  size?: 'large' | 'medium';
  /**
   * Callback triggered when the card is clicked
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Sets the HTML element for the Card
   */
  as?: 'label';
  /**
   * CSS cursor property
   */
  cursor?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardBodyProps = {
  children: Snippet;
  height?: string;
} & TestID &
  DataAnalyticsAttribute;

export type CardHeaderProps = {
  children: Snippet;
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

export type CardHeaderLeadingProps = {
  title: string;
  subtitle?: string;
  /**
   * prefix element of Card (e.g., icon)
   */
  prefix?: Snippet;
  /**
   * suffix element of Card (e.g., counter, link)
   */
  suffix?: Snippet;
} & DataAnalyticsAttribute;

export type CardHeaderTrailingProps = {
  /**
   * Renders a visual ornament in card header trailing section
   */
  visual?: Snippet;
};

export type CardFooterProps = {
  children: Snippet;
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

export type CardFooterLeadingProps = {
  title?: string;
  subtitle?: string;
} & DataAnalyticsAttribute;

export type CardFooterAction = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  accessibilityLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: Snippet;
  iconPosition?: 'left' | 'right';
  onClick?: (event: MouseEvent) => void;
};

export type CardFooterTrailingProps = {
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
} & DataAnalyticsAttribute;

export type CardRootProps = {
  isSelected?: boolean;
  isFocused?: boolean;
  shouldScaleOnHover?: boolean;
  onClick?: (event: MouseEvent) => void;
  children: Snippet;
  href?: string;
  as?: 'label';
  accessibilityLabel?: string;
  validationState?: 'none' | 'error' | 'success';
  cursor?: string;
  borderRadius?: 'medium' | 'large' | 'xlarge';
  width?: string;
  height?: string;
  minHeight?: string;
  minWidth?: string;
  maxWidth?: string;
  testID?: string;
  styledPropsClasses?: string;
  analyticsAttributes?: Record<string, string>;
};

export type CardSurfaceProps = {
  children: Snippet;
  backgroundColor?: CardSurfaceBackgroundColors;
  borderRadius?: 'medium' | 'large' | 'xlarge';
  elevation?: 'none' | 'lowRaised' | 'midRaised' | 'highRaised';
  padding?: CardSpacingValueType;
  height?: string;
  minHeight?: string;
};

export type LinkOverlayProps = {
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: MouseEvent) => void;
  as?: 'button';
  accessibilityLabel?: string;
  isPressed?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};
