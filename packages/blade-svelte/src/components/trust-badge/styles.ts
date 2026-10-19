import type { AxisValue } from '../../axes';
import type { AnalyticsAttributes } from '../../runes/dom/analytics';

/** The blade taxonomy as data. */
export const TRUST_BADGE_AXES = {
  variant: ['default', 'icon-only'],
} as const;

type Axis<K extends keyof typeof TRUST_BADGE_AXES> = AxisValue<typeof TRUST_BADGE_AXES, K>;

/** Derived from TRUST_BADGE_AXES: add a value there, never here. */
export interface TrustBadgeStyleProps {
  /**
   * `default`: the shield and its line in a tinted pill. `icon-only`: the shield.
   * @default 'default'
   */
  variant?: Axis<'variant'>;
}

// Blade's [Utility] Trust Marker (blade-core trustBadge.module.css): a 24px
// pill on the sea-subtle surface, its label in the gray subtle text.
const VARIANT: Record<Axis<'variant'>, string> = {
  default: 'h-6 gap-1 rounded-max bg-surface-sea-subtle px-2 py-1',
  'icon-only': 'p-1',
};

/** The parts of a TrustBadge: the pill, the brand shield, and its line. */
export interface TrustBadgeClasses {
  /** `class` from the caller lands here. */
  root: string;
  shield: string;
  label: string;
}

export function resolveTrustBadge(props: TrustBadgeStyleProps = {}): TrustBadgeClasses {
  const { variant = 'default' } = props;
  return {
    // A marker, not copy: dragging across the page should not pick it up.
    root: `inline-flex shrink-0 select-none items-center ${VARIANT[variant]}`,
    shield: 'w-4 h-4',
    label: 'whitespace-nowrap font-sans text-25 leading-50 text-surface-gray-subtle',
  };
}

/**
 * The "Razorpay Trusted Business" marker: the brand shield and its line.
 * Style-only. The library ships no copy:
 * the app passes the translated `label`.
 */
export interface TrustBadgeBehaviourProps extends Partial<AnalyticsAttributes> {
  /** The line beside the shield; the shield's name when it stands alone. */
  label: string;
  testID?: string;
  class?: string;
}
