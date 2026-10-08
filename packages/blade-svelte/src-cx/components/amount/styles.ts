import { COLOR, TEXT_AXES } from '../shared/typography';
import type { AxisValue } from '../../axes';

/**
 * The parts of an Amount, as Blade lays them out: a sign, the currency
 * before or after the number, the integer, and the decimals that may be
 * subtle, all on one baseline. By default size, weight, colour and face are
 * the surrounding text's; `type` with `size`, `weight` and `color` set them
 * from Blade DSL's Amount (Figma).
 */
export interface AmountClasses {
  /** `class` from the caller lands here. */
  root: string;
  /** Visually hides the whole text, which is what a screen reader gets. */
  text: string;
  /** Wraps the visual parts: a baseline row. */
  parts: string;
  sign: string;
  /** The currency, keyed by its side. */
  currency: Record<'prefix' | 'suffix', string>;
  /** The integer, and the decimals and compact suffix when they are not an affix. */
  value: string;
  /** Subtle decimals. */
  decimals: string;
}

/** The second argument: whether the amount has fixed decimals (`suffix: 'decimals'`), the only affix besides the currency. */
export type AmountStyleResolver<P> = (props: P, hasDecimals?: boolean) => AmountClasses;

/** The blade taxonomy as data: Figma's Amount variants, plus `inherit`. */
export const AMOUNT_AXES = {
  type: ['body', 'heading', 'display'],
  size: ['inherit', 'xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
  weight: ['inherit', 'regular', 'medium', 'semibold'],
  color: TEXT_AXES.color,
} as const;

type Axis<K extends keyof typeof AMOUNT_AXES> = AxisValue<typeof AMOUNT_AXES, K>;

/** Figma's sizes and weights per type: a heading has no xsmall and no medium weight. */
export const AMOUNT_TYPE_SIZES = {
  body: ['xsmall', 'small', 'medium', 'large'],
  heading: ['small', 'medium', 'large', 'xlarge', '2xlarge'],
  display: ['small', 'medium', 'large', 'xlarge'],
} as const;

export const AMOUNT_TYPE_WEIGHTS = {
  body: ['regular', 'medium', 'semibold'],
  heading: ['regular', 'semibold'],
  display: ['regular', 'medium', 'semibold'],
} as const;

type TypeName = Axis<'type'>;
type SizeOf<T extends TypeName> = (typeof AMOUNT_TYPE_SIZES)[T][number] | 'inherit';
type WeightOf<T extends TypeName> = (typeof AMOUNT_TYPE_WEIGHTS)[T][number] | 'inherit';

/** `size` and `weight` take only what Figma draws for the `type`. */
type TypeSizeWeight =
  | { type?: 'body'; size?: SizeOf<'body'>; weight?: WeightOf<'body'> }
  | { type: 'heading'; size?: SizeOf<'heading'>; weight?: WeightOf<'heading'> }
  | { type: 'display'; size?: SizeOf<'display'>; weight?: WeightOf<'display'> };

export type AmountStyleProps = TypeSizeWeight & {
  /**
   * The text colour; `inherit` takes the surrounding text's.
   * @default 'inherit'
   */
  color?: Axis<'color'>;
  /**
   * The currency and the decimals one step smaller, as Figma's subtle
   * affix (0.75em of the surrounding text while `size` inherits).
   * @default true
   */
  isAffixSubtle?: boolean;
};

/** One style: its face, size and line height, and letter-spacing. */
interface Style {
  face: 'text' | 'heading';
  type: string;
}

const body = (type: string): Style => ({ face: 'text', type });
const heading = (type: string): Style => ({ face: 'heading', type });

// Blade DSL's Amount (Figma): the value in the type's style; the subtle
// affix (currency and decimals) one step down — body into body, heading
// small to large into body, the larger headings and display into heading.
const SCALE: Record<TypeName, Record<string, { value: Style; affix: Style }>> = {
  body: {
    xsmall: {
      value: body('text-25 leading-25 tracking-50'),
      affix: body('text-25 leading-25 tracking-50'),
    },
    small: {
      value: body('text-75 leading-75 tracking-50'),
      affix: body('text-25 leading-25 tracking-50'),
    },
    medium: {
      value: body('text-100 leading-100 tracking-50'),
      affix: body('text-25 leading-25 tracking-50'),
    },
    large: {
      value: body('text-200 leading-200 tracking-25'),
      affix: body('text-75 leading-75 tracking-50'),
    },
  },
  heading: {
    small: {
      value: heading('text-300 leading-300 tracking-100'),
      affix: body('text-75 leading-75 tracking-50'),
    },
    medium: {
      value: heading('text-400 leading-400 tracking-100'),
      affix: body('text-100 leading-100 tracking-50'),
    },
    large: {
      value: heading('text-500 leading-500 tracking-100'),
      affix: body('text-200 leading-200 tracking-25'),
    },
    xlarge: {
      value: heading('text-600 leading-600 tracking-100'),
      affix: heading('text-400 leading-400 tracking-100'),
    },
    '2xlarge': {
      value: heading('text-700 leading-700 tracking-100'),
      affix: heading('text-500 leading-500 tracking-100'),
    },
  },
  display: {
    small: {
      value: heading('text-800 leading-800 tracking-100'),
      affix: heading('text-600 leading-600 tracking-100'),
    },
    medium: {
      value: heading('text-900 leading-900 tracking-100'),
      affix: heading('text-700 leading-700 tracking-100'),
    },
    large: {
      value: heading('text-1000 leading-1000 tracking-100'),
      affix: heading('text-700 leading-700 tracking-100'),
    },
    xlarge: {
      value: heading('text-1100 leading-1100 tracking-100'),
      affix: heading('text-800 leading-800 tracking-100'),
    },
  },
};

const FACE = { text: 'font-sans', heading: 'font-heading' } as const;

const WEIGHT: Record<Exclude<Axis<'weight'>, 'inherit'>, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
};

// While the size inherits, the affix is relative to the surrounding text.
const RELATIVE_AFFIX = '[font-size:0.75em]';

export const resolveAmount: AmountStyleResolver<AmountStyleProps> = (
  props: AmountStyleProps = {},
  hasDecimals = true,
) => {
  const { type = 'body', size = 'inherit', weight = 'inherit', color = 'inherit', isAffixSubtle = true } = props;
  const scale = size === 'inherit' ? undefined : SCALE[type]?.[size];
  const weightClass = weight === 'inherit' ? '' : WEIGHT[weight];
  const style = (s: Style): string => `${FACE[s.face]} ${s.type}`;
  // Figma sets the currency symbol in the body face whatever the type.
  const currencyStyle = (s: Style): string => `font-sans ${s.type}`;

  let value = '';
  let affix = isAffixSubtle ? RELATIVE_AFFIX : '';
  let currency = affix;
  if (scale) {
    value = style(scale.value);
    const affixStyle = isAffixSubtle ? scale.affix : scale.value;
    affix = style(affixStyle);
    currency = currencyStyle(affixStyle);
  }
  return {
    // `inherit` adds nothing: colour and weight already follow the surrounding text.
    root: `inline-flex ${weightClass} ${color === 'inherit' ? '' : COLOR[color]}`.replace(/\s+/g, ' ').trim(),
    text: 'sr-only',
    parts: 'inline-flex flex-row items-baseline whitespace-nowrap',
    // Blade: 4px either side of the sign, 2px between currency and number.
    sign: `mx-1 ${scale ? style(scale.value) : ''}`.trim(),
    currency: { prefix: `mr-0.5 ${currency}`.trim(), suffix: `ml-0.5 ${currency}`.trim() },
    value,
    decimals: hasDecimals ? affix : '',
  };
};
