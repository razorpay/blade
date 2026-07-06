import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { TrustedMarkerVariant, TrustedMarkerType } from '@razorpay/blade-core/styles';

export type { TrustedMarkerVariant, TrustedMarkerType };

export type TrustedMarkerProps = {
  /**
   * Visual form of the marker.
   * - `'full'`: brand shield + the trust label pill.
   * - `'icon'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'full'
   */
  type?: TrustedMarkerType;

  /**
   * Text/foreground treatment. Only affects `type='full'` — the shield keeps its
   * fixed brand gradient regardless of variant.
   * - `'neutral'`: static-white text — for dark/colored surfaces.
   * - `'subtle'`: static-black text — for light surfaces.
   *
   * @default 'neutral'
   */
  variant?: TrustedMarkerVariant;

  /**
   * Trust label displayed in the pill (only visible when `type='full'`).
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
