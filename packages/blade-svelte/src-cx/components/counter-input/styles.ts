import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const COUNTER_INPUT_AXES = {
  size: ['xsmall', 'small', 'medium', 'large'],
  emphasis: ['subtle', 'intense'],
} as const;

type Axis<K extends keyof typeof COUNTER_INPUT_AXES> = AxisValue<
  typeof COUNTER_INPUT_AXES,
  K
>;

/** Derived from COUNTER_INPUT_AXES: add a value there, never here. */
export interface CounterInputStyleProps {
  /** @default 'medium' */
  size?: Axis<'size'>;
  /** @default 'subtle' */
  emphasis?: Axis<'emphasis'>;
}

export interface CounterInputClasses {
  root: string;
  /** The bordered box. `inert` is disabled or loading. */
  box: Record<'live' | 'inert', string>;
  controls: string;
  button: Record<'decrement' | 'increment', string>;
  /** Sized to the number's digits through `--counter-digits`. */
  field: string;
  /** On the field while focus came from the keyboard. */
  fieldFocus: string;
  slide: Record<'up' | 'down', string>;
  /** The number. `inert` (disabled or loading) greys it, as Blade does. */
  input: Record<'live' | 'inert', string>;
  loader: string;
  loaderBar: string;
  /** The Icon size of the minus and plus. */
  iconSize: 'small' | 'medium' | 'large' | 'xlarge';
}

// Blade's CounterInput (CounterInput.web.tsx, token.ts). Per size: the box's
// minimum width and height (78/86/94/122 × 30/34/38/50), its radius, the
// buttons' padding and radius, the icon, the number's type, and the
// The label above is the shared FieldLabel, at the input's size.
const SIZE: Record<
  Axis<'size'>,
  {
    box: string;
    button: string;
    text: string;
    icon: CounterInputClasses['iconSize'];
  }
> = {
  xsmall: {
    box: 'min-w-[78px] h-[30px] rounded-small',
    button: 'p-1 rounded-xsmall',
    text: 'text-75 leading-75 tracking-50',
    icon: 'small',
  },
  small: {
    box: 'min-w-[86px] h-[34px] rounded-small',
    button: 'p-1 rounded-xsmall',
    text: 'text-75 leading-75 tracking-50',
    icon: 'medium',
  },
  medium: {
    box: 'min-w-[94px] h-[38px] rounded-small',
    button: 'p-1 rounded-xsmall',
    text: 'text-100 leading-100 tracking-50',
    icon: 'large',
  },
  large: {
    box: 'min-w-[122px] h-[50px] rounded-medium',
    button: 'p-2 rounded-small',
    text: 'text-200 leading-200 tracking-25',
    icon: 'xlarge',
  },
};

// Per emphasis (`COUNTER_INPUT_TOKEN.emphasis`): the border, the number's
// colour, the icons' colour and their hover (a faded fill a step up, the
// icon a step darker), and the loading bar.
const EMPHASIS: Record<
  Axis<'emphasis'>,
  {
    border: string;
    borderInert: string;
    text: string;
    textInert: string;
    button: string;
    loader: string;
  }
> = {
  subtle: {
    border: 'border-interactive-gray-default',
    borderInert: 'border-interactive-gray-default',
    text: 'text-surface-gray-subtle',
    textInert: 'text-surface-gray-disabled',
    button:
      'icon-interactive-gray-subtle disabled:icon-interactive-gray-disabled hover:enabled:bg-interactive-gray-faded-highlighted hover:enabled:icon-interactive-gray-normal',
    loader: 'bg-feedback-neutral-intense',
  },
  intense: {
    border: 'border-interactive-primary-highlighted',
    borderInert: 'border-interactive-primary-disabled',
    text: 'text-interactive-primary-subtle',
    textInert: 'text-interactive-primary-disabled',
    button:
      'icon-interactive-primary-subtle disabled:icon-interactive-primary-disabled hover:enabled:bg-interactive-primary-faded-highlighted hover:enabled:icon-interactive-primary-normal',
    loader: 'bg-interactive-primary-default',
  },
};

// Blade's focus ring, 4px and inset (`negativeOffset`), on a button's own
// keyboard focus and on the field's. Spelled out: Uno reads classes from the
// source, never from strings built at runtime.
const BUTTON_RING =
  'focus-visible:outline-solid focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-surface-primary-muted';
const FIELD_RING =
  'focus-within:outline-solid focus-within:outline-4 focus-within:-outline-offset-4 focus-within:outline-surface-primary-muted';

export function resolveCounterInput(
  props: CounterInputStyleProps = {}
): CounterInputClasses {
  const { size = 'medium', emphasis = 'subtle' } = props;
  const look = SIZE[size];
  const tone = EMPHASIS[emphasis];
  const input = `h-full w-full min-w-0 p-1 border-none outline-none bg-transparent text-center font-text font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:[appearance:none] [&::-webkit-outer-spin-button]:[appearance:none] ${look.text}`;
  const box = `relative flex w-fit flex-col items-center overflow-hidden border-thin border-solid ${look.box}`;
  const button = `flex shrink-0 items-center justify-center border-none bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors duration-xquick ease-standard ${BUTTON_RING} ${look.button} ${tone.button}`;
  return {
    root: 'inline-block',
    box: {
      live: `${box} bg-surface-gray-intense ${tone.border}`,
      inert: `${box} bg-surface-gray-subtle ${tone.borderInert}`,
    },
    controls: 'flex h-full flex-row items-center',
    // Blade's margins: 4px round each button except towards the number.
    button: {
      decrement: `${button} mt-1 mb-1 ml-1`,
      increment: `${button} mt-1 mb-1 mr-1`,
    },
    // The number's width is its digits in `ch` of its own font, plus the
    // input's 4px each side — so the font sits on the field too.
    field: `flex h-full items-center justify-center font-text font-semibold w-[calc(var(--counter-digits)*1ch_+_8px)] ${look.text}`,
    fieldFocus: FIELD_RING,
    slide: { up: 'animate-slide-up', down: 'animate-slide-down' },
    input: {
      live: `${input} ${tone.text}`,
      inert: `${input} ${tone.textInert}`,
    },
    loader: 'absolute bottom-0 left-0 h-0.5 w-full overflow-hidden',
    loaderBar: `absolute top-0 h-full w-[40%] rounded-max animate-oscillate ${tone.loader}`,
    iconSize: look.icon,
  };
}
