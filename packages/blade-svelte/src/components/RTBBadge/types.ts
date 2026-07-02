import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { RTBBadgeVariant, RTBBadgeType } from '@razorpay/blade-core/styles';

export type { RTBBadgeVariant, RTBBadgeType };

export type RTBBadgeProps = {
  /**
   * Visual form of the badge.
   * - `'full'`: brand shield + the "Razorpay Trusted Business" pill.
   * - `'icon'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'full'
   */
  type?: RTBBadgeType;

  /**
   * Text/foreground treatment. Only affects `type='full'` — the shield keeps its
   * fixed brand gradient regardless of variant.
   * - `'neutral'`: static-white text — for dark/colored surfaces.
   * - `'subtle'`: static-black text — for light surfaces.
   *
   * @default 'neutral'
   */
  variant?: RTBBadgeVariant;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
