import type { AxisValue } from '../../axes';
import { INTENTS, INTENT_SUBTLE } from '../shared/intent';

/**
 * The parts of a Card: a surface around content; given `onPress` the whole
 * surface is one button, and `pressable` is what makes it look like one.
 */
export interface CardClasses {
  root: string;
  /** Added to the root when the card is a button. */
  pressable: string;
  /** The padded sections, each with its hairline; `children` skip them all. */
  header: string;
  body: string;
  footer: string;
}

export type CardStyleResolver<P> = (props: P) => CardClasses;

/** The blade taxonomy as data. */
export const CARD_AXES = {
  variant: ['primary', 'secondary'],
  color: INTENTS,
} as const;

type Axis<K extends keyof typeof CARD_AXES> = AxisValue<typeof CARD_AXES, K>;

/** Derived from CARD_AXES: add a value there, never here. */
export interface CardStyleProps {
  variant?: Axis<'variant'>;
  /** A tinted card (v2's MagicCard tones); unset keeps the variant's surface. */
  color?: Axis<'color'>;
}

const VARIANT: Record<Axis<'variant'>, string> = {
  primary: 'border-thin border-solid border-interactive-gray-disabled bg-surface-gray-intense shadow-card',
  secondary: 'border-none bg-surface-gray-moderate',
};

// Blade's card: a 12px radius, and three sections at 24px from the edge
// with 12px either side of the hairline between them. The card itself
// carries no padding — raw `children` bring their own — and the body takes
// the outer 24px at whichever edge has no header or footer.
const SECTION = {
  header: 'block border-b-thin border-t-none border-r-none border-l-none border-solid border-surface-gray-muted px-6 pb-3 pt-6',
  body: 'block px-6 py-3 first:pt-6 last:pb-6',
  footer: 'block border-t-thin border-r-none border-b-none border-l-none border-solid border-surface-gray-muted px-6 pb-6 pt-3',
};

// A tint brings its own border, surface and text: never mixed with the
// variant's, since `cx` resolves no conflicts.
export const resolveCard: CardStyleResolver<CardStyleProps> = (props) => {
  const { variant = 'primary', color } = props;
  const surface = color ? `border-thin border-solid ${INTENT_SUBTLE[color]}` : VARIANT[variant];
  const text = color ? '' : 'text-surface-gray-normal';
  return {
    root: `block rounded-medium ${text} ${surface}`.replace(/\s+/g, ' ').trim(),
    pressable:
      'w-full cursor-pointer text-left outline-none transition-all duration-xquick ease-standard focus-visible:shadow-focus active:translate-y-px disabled:pointer-events-none disabled:opacity-600',
    ...SECTION,
  };
};
