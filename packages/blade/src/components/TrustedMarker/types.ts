import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type TrustedMarkerProps = {
  /**
   * Visual form of the marker.
   * - `'full'` (default): brand shield + the trust label pill.
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

  /**
   * Trust label displayed in the pill (only visible when `type='full'`).
   * Also used as the accessible label for the icon-only form.
   *
   * @default 'Razorpay Trusted Business'
   */
  label?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { TrustedMarkerProps };
