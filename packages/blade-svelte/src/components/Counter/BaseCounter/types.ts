import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { CounterColor, CounterEmphasis, CounterSize } from '@razorpay/blade-core/styles';

export interface BaseCounterProps extends StyledPropsBlade {
  /**
   * The value to be displayed in the counter.
   *
   * This is the numerical value shown within the counter component.
   */
  value: number;

  /**
   * Sets the maximum value for the counter.
   *
   * If the value exceeds this maximum, it will be displayed as `max+`.
   * For example, if max is 99 and value is 140, it will show "99+".
   */
  max?: number;

  /**
   * Sets the color of the counter.
   *
   * Available colors:
   * - `neutral`: Default neutral color
   * - `positive`: Positive feedback color (success)
   * - `negative`: Negative feedback color (error)
   * - `notice`: Notice/warning color
   * - `information`: Information color
   * - `primary`: Primary brand color
   *
   * @default 'neutral'
   */
  color?: CounterColor;

  /**
   * Sets the contrast/intensity of the counter background.
   *
   * - `subtle`: Lighter background with darker text
   * - `intense`: Darker background with lighter text (higher contrast)
   *
   * @default 'subtle'
   */
  emphasis?: CounterEmphasis;

  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: CounterSize;

  /**
   * Test ID for automated testing.
   *
   * Used to identify the counter component in test suites.
   */
  testID?: string;

  /**
   * Analytics tracking attributes.
   *
   * Use data-analytics-* props for tracking component interactions.
   */
  [key: `data-analytics-${string}`]: string;
}
