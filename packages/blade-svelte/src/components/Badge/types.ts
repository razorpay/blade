import type { Snippet } from 'svelte';
import type { StyledPropsBlade, TestID, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

export type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type SubtleOrIntense = 'subtle' | 'intense';

export type BadgeProps = {
  /**
   * Sets the label for the badge.
   * Can be a string or a Svelte snippet.
   */
  children: string | Snippet;
  
  /**
   * Sets the color of the badge.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  
  /**
   * Sets the contrast of the badge.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  
  /**
   * Sets the size of the badge.
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  
  /**
   * Icon to be displayed in the badge.
   * Accepts a Svelte snippet that renders an icon component.
   *
   * @example
   * ```svelte
   * <Badge color="positive">
   *   {#snippet icon()}
   *     <CheckIcon />
   *   {/snippet}
   *   Success
   * </Badge>
   * ```
   */
  icon?: Snippet;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
