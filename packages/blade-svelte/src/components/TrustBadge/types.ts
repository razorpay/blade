import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { TrustBadgeVariant } from '@razorpay/blade-core/styles';

export type { TrustBadgeVariant };

export type TrustBadgeProps = {
  /**
   * Visual variant of the badge.
   * - `'default'`: brand shield + the trust label pill.
   * - `'icon-only'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'default'
   */
  variant?: TrustBadgeVariant;

  /**
   * Trust label displayed in the pill (only visible when `variant='default'`).
   * Also used as the accessible label for the icon-only form.
   *
   * @default 'Razorpay Trusted Business'
   */
  label?: string;

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
