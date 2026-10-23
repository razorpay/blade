import type { AxisValue } from '../../axes';
import type { AnalyticsAttributes } from '../../runes/dom/analytics';
import { ICON_AXES, ICON_COLOR } from '../icon/styles';

/** The parts of a DotLoader. */
export interface DotLoaderClasses {
  /** The square the dots sit centred in. `class` from the caller lands here. */
  root: string;
  /** Per dot, in order: each rises 150ms after the one before. */
  dots: [string, string, string];
}

/** The blade taxonomy as data. */
export const DOT_LOADER_AXES = {
  size: ['small', 'medium', 'large'],
  color: ICON_AXES.color,
} as const;

type Axis<K extends keyof typeof DOT_LOADER_AXES> = AxisValue<typeof DOT_LOADER_AXES, K>;

/** Derived from DOT_LOADER_AXES: add a value there, never here. */
export interface DotLoaderStyleProps {
  /**
   * `small` is medium scaled 0.75x, for compact hosts; `large` 1.5x, for the
   * 48px large Button.
   * @default 'medium'
   */
  size?: Axis<'size'>;
  /**
   * Icon's colours: the dots are a foreground mark that reads like a glyph.
   * `inherit` takes the host's text colour.
   * @default 'muted'
   */
  color?: Axis<'color'>;
}

// Blade's DotLoader (Figma): the dots centred in a square at rest, rising by
// `--lift` at the peak — never dipping below the rest line. small and large
// are medium scaled, so the motion keeps its character.
const SIZE: Record<Axis<'size'>, { root: string; dot: string }> = {
  small: { root: 'w-[18px] h-[18px] [gap:1.5px]', dot: 'w-[3px] h-[3px] [--lift:3.75px]' },
  medium: { root: 'w-6 h-6 gap-0.5', dot: 'w-1 h-1 [--lift:5px]' },
  large: { root: 'w-9 h-9 [gap:3px]', dot: 'w-1.5 h-1.5 [--lift:7.5px]' },
};

// 1.2s a loop, each dot 150ms behind the last; under reduced motion, Figma's
// static pose: the middle dot held at its peak.
const DOT = 'rounded-max bg-current [opacity:0.42] animate-dot motion-reduce:animate-none';
const STEP: DotLoaderClasses['dots'] = [
  '',
  '[animation-delay:150ms] motion-reduce:translate-y-[calc(var(--lift)*-1)] motion-reduce:[opacity:1]',
  '[animation-delay:300ms]',
];

export function resolveDotLoader(props: DotLoaderStyleProps = {}): DotLoaderClasses {
  const { size = 'medium', color = 'muted' } = props;
  const spec = SIZE[size];
  const dot = `${DOT} ${spec.dot}`;
  return {
    root: `inline-flex shrink-0 items-center justify-center ${spec.root} ${ICON_COLOR[color]}`,
    dots: [`${dot} ${STEP[0]}`.trim(), `${dot} ${STEP[1]}`, `${dot} ${STEP[2]}`],
  };
}

/**
 * The indefinite three-dot loader. It has no behaviour; it only says whether
 * it announces itself.
 */
export interface DotLoaderBehaviourProps extends Partial<AnalyticsAttributes> {
  /**
   * Announces the wait (`role="status"`). Leave it unset where the host
   * already announces its loading state (as Button does): the dots are then
   * hidden from assistive tech, so screen readers do not hear it twice.
   */
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
}
