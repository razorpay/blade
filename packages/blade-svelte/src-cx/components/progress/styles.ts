import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const PROGRESS_AXES = {
  type: ['dots', 'bar', 'ring'],
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof PROGRESS_AXES> = AxisValue<typeof PROGRESS_AXES, K>;

/** Derived from PROGRESS_AXES: add a value there, never here. */
export interface ProgressStyleProps {
  type?: Axis<'type'>;
  /** Every kind; a bar takes its width from the caller's `class`. */
  size?: Axis<'size'>;
}

// Dots paint with the current text colour, so they follow whatever surface
// they sit on. Ported from app/v2/components/loader/Dot.
const DOTS: Record<Axis<'size'>, string> = {
  small: 'h-5 gap-1 *:w-1 *:h-1',
  medium: 'h-6 gap-2 *:w-2 *:h-2',
  large: 'h-8 gap-2 *:w-3 *:h-3',
};

export interface ProgressClasses {
  root: string;
  /** Dots only: one per dot, staggered. */
  dots: string[];
  /**
   * Determinate kinds only. The component sets `--progress` (0..1) on the
   * root; `bar` scales its fill by it, `ring` offsets its arc's dash.
   */
  fill?: { kind: 'bar' | 'ring'; track: string; value: string };
  /** Ring only: the circle's radius and stroke in its 36-unit viewBox. */
  ring?: { r: number; stroke: number };
}

// Blade DSL's Progress Bar (Figma), circular: 24/48/72px, the ring's
// thickness a share of its radius (inner radius 74%, 80%, 82%), so in the
// 36-unit viewBox the stroke is 18 × (1 − inner) and the circle sits on its
// middle.
const RING: Record<Axis<'size'>, { box: string; r: number; stroke: number }> = {
  small: { box: 'w-6 h-6', r: 15.66, stroke: 4.68 },
  medium: { box: 'w-12 h-12', r: 16.2, stroke: 3.6 },
  large: { box: 'w-[72px] h-[72px]', r: 16.38, stroke: 3.24 },
};

// Figma's linear bar: 2px at small, 4px at medium. Figma draws no large
// linear bar; large keeps medium's 4px.
const BAR: Record<Axis<'size'>, string> = {
  small: 'h-0.5',
  medium: 'h-1',
  large: 'h-1',
};

// Ported from sidecart's ProgressBar and CircularProgressBar; the tween is a
// CSS transition, so a value set at mount draws in place with no animation.
const FILL_MOTION = 'duration-gentle ease-entrance motion-reduce:transition-none';

export function resolveProgress(props: ProgressStyleProps = {}): ProgressClasses {
  const { type = 'dots', size = 'medium' } = props;
  // Blade's ProgressBar: the unfilled track is feedback neutral-subtle, the
  // fill the caller's colour (Blade's `color`: feedback `{intent}.intense`,
  // else surface primary-intense), taken here as the current text colour.
  // The ring's track has no stroke utility, so it is the fill at 9% —
  // what Blade's subtle feedback fills are made of.
  if (type === 'bar') {
    return {
      root: `block w-full overflow-hidden rounded-max bg-feedback-neutral-subtle ${BAR[size]}`,
      dots: [],
      fill: {
        kind: 'bar',
        track: '',
        value: `block w-full h-full origin-left [scale:var(--progress)_1] rounded-max bg-current transition-transform ${FILL_MOTION}`,
      },
    };
  }
  if (type === 'ring') {
    return {
      root: `inline-block -rotate-90 ${RING[size].box}`,
      dots: [],
      ring: { r: RING[size].r, stroke: RING[size].stroke },
      fill: {
        kind: 'ring',
        track: 'fill-none stroke-current opacity-100',
        value: `fill-none stroke-current [transition-property:stroke-dashoffset] [stroke-dashoffset:calc(1_-_var(--progress))] [stroke-linecap:round] ${FILL_MOTION}`,
      },
    };
  }
  const dot = 'rounded-max bg-current animate-bounce motion-reduce:animate-none';
  return {
    root: `inline-flex items-center justify-center ${DOTS[size]}`,
    dots: [`${dot} [animation-delay:-0.3s]`, `${dot} [animation-delay:-0.15s]`, dot],
  };
}

/**
 * Progress is a visual: waiting dots, or how far along something is.
 * A placeholder for loading content is Skeleton, not a kind of Progress. It
 * has no behaviour: a determinate kind draws the `value` it is given,
 * animating between values in CSS; the `type` axis decides which kinds exist.
 */
export interface ProgressBehaviourProps {
  /**
   * How far along, for the determinate kinds (a bar, a ring): the
   * visual becomes a `role="progressbar"`. Ignored by the waiting kinds.
   */
  value?: number;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /**
   * Announces the wait (`role="status"`). Omit where something else already
   * does — a busy button, a labelled region — and the visual is hidden from
   * assistive tech.
   */
  accessibilityLabel?: string;
  testID?: string;
  /** Merged last; a bar takes its width from here (`w-32`). */
  class?: string;
}
