import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { TrustBadgeVariant, TrustBadgeEmphasis } from '@razorpay/blade-core/styles';

export type { TrustBadgeVariant, TrustBadgeEmphasis };

export type TrustBadgeProps = {
  /**
   * Visual variant of the badge.
   * - `'full'` (default): brand shield + the trust label pill.
   * - `'icon-only'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'full'
   */
  variant?: TrustBadgeVariant;

  /**
   * Text/foreground treatment. Only affects `variant='full'` — the shield keeps its
   * fixed brand gradient regardless of emphasis.
   * - `'intense'`: static-white text — for dark/colored surfaces.
   * - `'subtle'` (default): static-black text — for light surfaces.
   *
   * @default 'subtle'
   */
  emphasis?: TrustBadgeEmphasis;

  /**
   * Trust label displayed in the pill (only visible when `variant='full'`).
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
