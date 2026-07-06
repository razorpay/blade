import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type RTBBadgeProps = {
  /**
   * Visual form of the badge.
   * - `'full'` (default): brand shield + the "Razorpay Trusted Business" pill.
   * - `'icon'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'full'
   */
  type?: 'full' | 'icon';

  /**
   * Text/foreground treatment. Only affects `type='full'` — the shield keeps its
   * fixed brand gradient regardless of variant.
   * - `'neutral'` (default): static-white text — for dark/colored surfaces.
   * - `'subtle'`: static-black text — for light surfaces.
   *
   * @default 'neutral'
   */
  variant?: 'neutral' | 'subtle';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { RTBBadgeProps };
