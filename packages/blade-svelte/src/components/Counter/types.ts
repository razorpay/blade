import type { StyledPropsBlade, TestID, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

export type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type SubtleOrIntense = 'subtle' | 'intense';

export type CounterProps = {
  /**
   * Sets the value for the counter.
   */
  value: number;

  /**
   * Sets the max value for the counter.
   * If value exceeds `max` it will render `{max}+`
   */
  max?: number;

  /**
   * Sets the color of the counter.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';

  /**
   * Sets the contrast of the counter.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;

  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
