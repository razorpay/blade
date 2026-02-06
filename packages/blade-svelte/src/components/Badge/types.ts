import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

// Icon component type - placeholder for now
// TODO: Replace with actual Icon component when available
export type IconComponent = unknown;

export type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';
export type BadgeColor = 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';
export type BadgeEmphasis = 'subtle' | 'intense';

/**
 * Children type for Badge - can be a string or a snippet
 * Similar to React's StringChildrenType
 */
export type BadgeChildren = string | Snippet;

export interface BadgeProps extends StyledPropsBlade {
  /**
   * Sets the label for the badge.
   * Text content is required. Can be passed as slot content: `<Badge>text</Badge>`
   * or as a prop: `<Badge children="text" />`
   */
  children: BadgeChildren;
  /**
   * Sets the color of the badge.
   * @default 'neutral'
   */
  color?: BadgeColor;
  /**
   * Sets the emphasis (contrast) of the badge.
   * @default 'subtle'
   */
  emphasis?: BadgeEmphasis;
  /**
   * Sets the size of the badge.
   * @default 'medium'
   */
  size?: BadgeSize;
  /**
   * Icon to be displayed in the badge.
   * Accepts an icon component from Blade.
   */
  icon?: IconComponent;
  /**
   * Test ID for the badge element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}
