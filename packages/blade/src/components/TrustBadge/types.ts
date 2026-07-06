import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type TrustBadgeProps = {
  /**
   * Visual variant of the badge.
   * - `'full'` (default): brand shield + the trust label pill.
   * - `'icon-only'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'full'
   */
  variant?: 'full' | 'icon-only';

  /**
   * Text/foreground treatment. Only affects `variant='full'` — the shield keeps its
   * fixed brand gradient regardless of emphasis.
   * - `'intense'`: static-white text — for dark/colored surfaces.
   * - `'subtle'` (default): static-black text — for light surfaces.
   *
   * @default 'subtle'
   */
  emphasis?: 'subtle' | 'intense';

  /**
   * Trust label displayed in the pill (only visible when `variant='full'`).
   * Also used as the accessible label for the icon-only form.
   *
   * @default 'Razorpay Trusted Business'
   */
  label?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { TrustBadgeProps };
