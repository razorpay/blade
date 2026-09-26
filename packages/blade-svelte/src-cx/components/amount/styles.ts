import type { AxisValue } from '../../axes';
import type { AmountPartKind } from '../../runes/amount/amount';
import { cx } from '../../cx';
import { COLOR, TEXT_AXES } from '../shared/typography';

/**
 * The parts of an Amount. The number is split into typed parts; the classes
 * decide how the currency and the decimals differ from the integer.
 */
export interface AmountClasses {
  /** `class` from the caller lands here. */
  root: string;
  /** Applied to the root of a struck-through (old) amount. */
  struck: string;
  /** Visually hides the whole text, which is what a screen reader gets. */
  text: string;
  /** Wraps the visual parts, so they can be laid out. */
  parts: string;
  part: Record<AmountPartKind, string>;
}

export type AmountStyleResolver<P> = (props: P) => AmountClasses;

/** The blade taxonomy as data. */
export const AMOUNT_AXES = {
  size: ['xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
  weight: TEXT_AXES.weight,
  color: TEXT_AXES.color,
  affix: ['subtle', 'normal'],
} as const;

type Axis<K extends keyof typeof AMOUNT_AXES> = AxisValue<
  typeof AMOUNT_AXES,
  K
>;

/**
 * Derived from AMOUNT_AXES: add a value there, never here. `size`, `weight`
 * and `color` have no default: unset, the amount takes the surrounding text's.
 */
export interface AmountStyleProps {
  size?: Axis<'size'>;
  weight?: Axis<'weight'>;
  color?: Axis<'color'>;
  /** `subtle`: the currency and the decimals are smaller and lighter. */
  affix?: Axis<'affix'>;
}

// The top three are heading sizes: a total is often the page's headline.
const SIZE: Record<Axis<'size'>, string> = {
  xsmall: 'text-25 leading-50',
  small: 'text-75 leading-50',
  medium: 'text-100 leading-100',
  large: 'text-200 leading-200',
  xlarge: 'text-400 leading-400',
  '2xlarge': 'text-500 leading-500',
};

const WEIGHT: Record<Axis<'weight'>, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
};

// Relative, so one rule serves every size.
const AFFIX: Record<Axis<'affix'>, string> = {
  subtle: '[font-size:0.75em] opacity-800',
  normal: '',
};

export const resolveAmount: AmountStyleResolver<AmountStyleProps> = (
  props: AmountStyleProps = {}
) => {
  const { size, weight, color, affix = 'subtle' } = props;
  return {
    root: cx(
      'inline-flex items-baseline whitespace-pre font-text tabular-nums',
      size && SIZE[size],
      weight && WEIGHT[weight],
      color && COLOR[color]
    ),
    struck: 'line-through',
    text: 'sr-only',
    // A flex row on one baseline, so the smaller currency and decimals
    // bottom out with the integer's digits (`items-end` would align the
    // line boxes, which are equally tall, and leave them floating).
    // `whitespace-pre` on the root keeps a part's edge space (`USD `),
    // which a flex item would otherwise drop.
    parts: 'flex items-baseline',
    part: {
      currency: AFFIX[affix],
      integer: '',
      fraction: AFFIX[affix],
      sign: '',
    },
  };
};
