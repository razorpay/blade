/**
 * The parts of an Amount, as Blade lays them out: a sign, the currency
 * before or after the number, the integer, and the decimals that may be
 * subtle, all on one baseline. Size, weight, colour and face are the
 * surrounding text's: an Amount only decides the formatting.
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
export type AmountStyleResolver<P> = (
  props: P,
  hasDecimals?: boolean
) => AmountClasses;

export interface AmountStyleProps {
  /**
   * The currency and the decimals smaller (0.75em) and at 64% opacity.
   * @default true
   */
  isAffixSubtle?: boolean;
}

// Relative, so it follows whatever text the amount sits in.
const AFFIX = '[font-size:0.75em] opacity-800';

export const resolveAmount: AmountStyleResolver<AmountStyleProps> = (
  props: AmountStyleProps = {},
  hasDecimals = true
) => {
  const { isAffixSubtle = true } = props;
  const affix = isAffixSubtle ? AFFIX : '';
  return {
    root: 'inline-flex',
    text: 'sr-only',
    parts: 'inline-flex items-baseline',
    // Blade: 4px either side of the sign, 2px between currency and number.
    sign: 'mx-1',
    currency: { prefix: `mr-0.5 ${affix}`, suffix: `ml-0.5 ${affix}` },
    value: '',
    decimals: hasDecimals ? affix : '',
  };
};
