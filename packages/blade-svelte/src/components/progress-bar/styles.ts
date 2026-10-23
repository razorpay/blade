import type { AxisValue } from '../../axes';
import type { AnalyticsAttributes } from '../../runes/dom/analytics';
import { INTENTS } from '../shared/intent';
import { resolveText } from '../shared/typography';

/** The blade taxonomy as data. */
export const PROGRESS_BAR_AXES = {
  variant: ['linear', 'circular'],
  size: ['small', 'medium', 'large'],
  color: INTENTS,
} as const;

type Axis<K extends keyof typeof PROGRESS_BAR_AXES> = AxisValue<typeof PROGRESS_BAR_AXES, K>;

interface ProgressBarCommonStyleProps {
  /**
   * The fill's feedback colour; unset, the primary surface's.
   * @default undefined
   */
  color?: Axis<'color'>;
}

/** Derived from PROGRESS_BAR_AXES: add a value there, never here. */
export type ProgressBarStyleProps = ProgressBarCommonStyleProps &
  (
    | {
        /** @default 'linear' */
        variant?: 'linear';
        /**
         * The track's thickness: 2px or 4px. A linear bar has no `large`.
         * @default 'small'
         */
        size?: Exclude<Axis<'size'>, 'large'>;
      }
    | {
        variant: 'circular';
        /**
         * 24, 48 or 72px across.
         * @default 'small'
         */
        size?: Axis<'size'>;
      }
  );

/** The parts of a ProgressBar. */
export interface ProgressBarClasses {
  /** `class` from the caller lands here. */
  root: string;
  /**
   * Linear: the row above the track, the label and the percentage; with no
   * label, the percentage at the end.
   */
  header: string;
  /** Linear: the percentage's box, 4px above the track. */
  percentBox: string;
  /** Linear: the unfilled track, the `role="progressbar"` element. */
  track: string;
  /**
   * Linear: the fill. Determinate, it is `--progress` (0–100, set by the
   * component) percent wide; indeterminate, a short sliding fill.
   */
  fill: string;
  /** The white sheen pulsing over a `progress` fill; empty for a meter. */
  pulse: string;
  /** Circular: the ring's geometry in a viewBox of its pixel size. */
  ring: { box: number; stroke: number; radius: number };
  /** Circular: the unfilled circle. */
  ringTrack: string;
  /** Circular: the arc, dashed to `--progress` of its length. */
  ringFill: string;
  /** Circular, above small: the percentage inside the ring. */
  ringPercent: string;
  /** Circular: the label (and, at small, the percentage) below the ring. */
  caption: string;
}

/** The second argument: what the component draws, which the look depends on. */
export interface ProgressBarState {
  /** @default 'progress' */
  type?: 'progress' | 'meter';
  isIndeterminate?: boolean;
  /** 0–100; a full ring stops pulsing. */
  percent?: number;
  hasLabel?: boolean;
}

// Blade's ProgressBar: the fill is the feedback colour's intense background,
// else the primary surface's intense one; the track feedback neutral-subtle.
const FILL: Record<Axis<'color'> | 'primary', { bg: string; stroke: string }> = {
  neutral: { bg: 'bg-feedback-neutral-intense', stroke: 'stroke-feedback-neutral-intense' },
  information: {
    bg: 'bg-feedback-information-intense',
    stroke: 'stroke-feedback-information-intense',
  },
  positive: { bg: 'bg-feedback-positive-intense', stroke: 'stroke-feedback-positive-intense' },
  notice: { bg: 'bg-feedback-notice-intense', stroke: 'stroke-feedback-notice-intense' },
  negative: { bg: 'bg-feedback-negative-intense', stroke: 'stroke-feedback-negative-intense' },
  primary: { bg: 'bg-surface-primary-intense', stroke: 'stroke-surface-primary-intense' },
};

// Blade's linear track: 2px at small, 4px at medium.
const TRACK: Record<Axis<'size'>, string> = {
  small: 'h-0.5',
  medium: 'h-1',
  large: 'h-1',
};

// Blade's circular sizes: 24/48/72px across, a 3/5/7px stroke, the
// percentage set in body small inside at medium, body medium at large.
const RING: Record<Axis<'size'>, { box: number; stroke: number; text: 'small' | 'medium' }> = {
  small: { box: 24, stroke: 3, text: 'small' },
  medium: { box: 48, stroke: 5, text: 'small' },
  large: { box: 72, stroke: 7, text: 'medium' },
};

// The fill moves to a new value over 2xgentle, emphasized.
const FILL_MOTION = 'duration-2xgentle ease-emphasized motion-reduce:transition-none';

export function resolveProgressBar(
  props: ProgressBarStyleProps = {},
  state: ProgressBarState = {},
): ProgressBarClasses {
  const { variant = 'linear', size = 'small' } = props;
  const { type = 'progress', isIndeterminate = false, percent = 0, hasLabel = false } = state;
  const isMeter = type === 'meter';
  const fill = FILL[props.color ?? 'primary'];
  const ring = RING[size];
  return {
    root: variant === 'circular' ? 'flex w-fit flex-col items-center text-center' : 'block',
    header: `flex flex-row ${hasLabel ? 'justify-between' : 'justify-end'}`,
    percentBox: 'mb-1',
    track: `relative overflow-hidden rounded-xsmall bg-feedback-neutral-subtle ${TRACK[size]}`,
    fill:
      isIndeterminate && !isMeter
        ? `absolute h-full w-[5%] rounded-xsmall ${fill.bg} animate-progress-slide motion-reduce:animate-none`
        : `h-full rounded-xsmall ${fill.bg} [width:calc(var(--progress)*1%)] transition-[width] ${FILL_MOTION}`,
    // Over the fill, as Blade's: from a long delay on, white fading to 25%
    // and back. A meter is static.
    pulse: isMeter
      ? ''
      : 'block h-full w-full bg-interactive-static-white-default opacity-0 animate-progress-pulse motion-reduce:animate-none',
    ring: { box: ring.box, stroke: ring.stroke, radius: (ring.box - ring.stroke) / 2 },
    ringTrack: 'fill-none stroke-feedback-neutral-subtle',
    ringFill: `fill-none ${
      fill.stroke
    } [stroke-dashoffset:calc(100_-_var(--progress))] transition-[stroke-dashoffset] ${FILL_MOTION} ${
      isMeter || percent >= 100 ? '' : 'animate-progress-ring-pulse motion-reduce:animate-none'
    }`.trim(),
    ringPercent: `fill-current ${resolveText({ size: ring.text, weight: 'semibold' })}`,
    caption: 'mt-2',
  };
}

/**
 * A ProgressBar shows how far along something is (`progress`), or where a
 * value sits in a range (`meter`). It has no behaviour: it draws the `value`
 * it is given, moving between values in CSS.
 */
interface ProgressBarCommonBehaviourProps extends Partial<AnalyticsAttributes> {
  /**
   * Shown above a linear bar, below a circular one; also the default
   * `accessibilityLabel`.
   */
  label?: string;
  /**
   * Names the bar for assistive tech.
   * @default label
   */
  accessibilityLabel?: string;
  /** @default 0 */
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  testID?: string;
  class?: string;
}

export type ProgressBarBehaviourProps = ProgressBarCommonBehaviourProps &
  (
    | {
        /**
         * `progress` (`role="progressbar"`) pulses and shows its percentage;
         * `meter` (`role="meter"`) is static and does not.
         * @default 'progress'
         */
        type?: 'progress';
        /**
         * No value to report: a short fill slides across. Linear only.
         * @default false
         */
        isIndeterminate?: boolean;
        /** @default true */
        showPercentage?: boolean;
      }
    | {
        type: 'meter';
        isIndeterminate?: undefined;
        showPercentage?: undefined;
      }
  );
