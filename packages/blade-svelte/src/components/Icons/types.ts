import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

/**
 * Icon color tokens - matches React implementation
 * Uses dot notation for theme color tokens
 */
export type IconColor =
  // Interactive icon colors
  | 'interactive.icon.gray.normal'
  | 'interactive.icon.gray.subtle'
  | 'interactive.icon.gray.muted'
  | 'interactive.icon.gray.disabled'
  | 'interactive.icon.primary.normal'
  | 'interactive.icon.primary.subtle'
  | 'interactive.icon.primary.disabled'
  | 'interactive.icon.onPrimary.normal'
  | 'interactive.icon.staticWhite.normal'
  | 'interactive.icon.staticBlack.muted'
  | 'interactive.icon.staticBlack.disabled'
  | 'interactive.icon.positive.normal'
  | 'interactive.icon.positive.disabled'
  | 'interactive.icon.negative.normal'
  | 'interactive.icon.negative.disabled'
  // Surface icon colors
  | 'surface.icon.gray.normal'
  | 'surface.icon.gray.subtle'
  | 'surface.icon.gray.muted'
  | 'surface.icon.gray.disabled'
  | 'surface.icon.staticWhite.normal'
  | 'surface.icon.staticBlack.normal'
  // Feedback icon colors
  | 'feedback.icon.positive.intense'
  | 'feedback.icon.positive.subtle'
  | 'feedback.icon.negative.intense'
  | 'feedback.icon.negative.subtle'
  | 'feedback.icon.notice.intense'
  | 'feedback.icon.notice.subtle'
  | 'feedback.icon.information.intense'
  | 'feedback.icon.information.subtle'
  | 'feedback.icon.neutral.intense'
  | 'feedback.icon.neutral.subtle'
  // Special value to inherit color from parent
  | 'currentColor';

/**
 * Icon sizes - matches React implementation
 */
export type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Icon component props - matches React IconProps
 */
export type IconProps = {
  /**
   * Color token (not to be confused with actual hsla value)
   * @default 'surface.icon.gray.normal'
   */
  color?: IconColor;
  /**
   * Size of the icon
   * @default 'medium'
   */
  size?: IconSize;
} & StyledPropsBlade;
