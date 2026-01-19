import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseIndicatorProps, FeedbackColors } from './BaseIndicator/types';

export type IndicatorProps = BaseIndicatorProps & {
  /**
   * Sets the color tone
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  /**
   * Sets the emphasis of the indicator
   *
   * If set to intense it will show a background circle
   *
   * @default 'subtle'
   */
  emphasis?: 'subtle' | 'intense';
  /**
   * Size of the indicator
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * A text label to show alongside the indicator dot
   */
  children?: string | Snippet;
  /**
   * a11y label for screen readers
   */
  accessibilityLabel?: string;
  /**
   * Test ID for testing purposes
   */
  testID?: string;
} & StyledPropsBlade;

export type { FeedbackColors };
