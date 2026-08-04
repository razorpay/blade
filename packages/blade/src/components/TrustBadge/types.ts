import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type TrustBadgeProps = {
  /**
   * Visual variant of the badge.
   * - `'default'` (default): brand shield + the trust label pill.
   * - `'icon-only'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'default'
   */
  variant?: 'default' | 'icon-only';

  /**
   * Trust label displayed in the pill (only visible when `variant='default'`).
   * Also used as the accessible label for the icon-only form.
   *
   * @default 'Razorpay Trusted Business'
   */
  label?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { TrustBadgeProps };
