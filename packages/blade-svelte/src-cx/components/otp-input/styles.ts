import type { AxisValue } from '../../axes';
import type { ValidationState } from '../../runes/form/hint';
import {
  INPUT_ACTIVE_ON_FOCUS,
  INPUT_DISABLED_ON_CONTROL,
  INPUT_FILL,
  INPUT_INACTIVE,
  INPUT_TEXT,
} from '../shared/input';

export type OTPInputValidationState = ValidationState;

/**
 * OTPInput's parts. Static class strings only; focus and disabled styling
 * of a cell ride the variant grammar (`focus:`, `disabled:`) so native needs
 * no bridge round-trip — the JS-toggled parts below are the states the
 * grammar lacks.
 */
export interface OTPInputClasses {
  root: string;
  /** Applied to the root while the input is disabled. */
  disabled: string;
  /** The row of cells. */
  cells: string;
  /** One single-character control. */
  cell: string;
  /** Applied to a cell per whether it holds a character. */
  cellFill: Record<'empty' | 'filled', string>;
  /** Applied to every cell per validation state. */
  validation: Record<Exclude<OTPInputValidationState, 'none'>, string>;
}

/** Style props in, the parts out. */
export type OTPInputStyleResolver<P> = (props: P) => OTPInputClasses;

const DEFAULTS = { size: 'medium' } as const;

/** The blade taxonomy as data. */
export const OTP_INPUT_AXES = {
  size: ['medium', 'large'],
} as const;

type Axis<K extends keyof typeof OTP_INPUT_AXES> = AxisValue<
  typeof OTP_INPUT_AXES,
  K
>;

/** Derived from OTP_INPUT_AXES: add a value there, never here. */
export interface OTPInputStyleProps {
  size?: Axis<'size'>;
}

// Blade's cells take the input's natural width (88px) and shrink, never
// grow, so the row is as wide as its cells until its box is narrower.
const CELL = `box-border w-[88px] min-w-0 shrink border-thin border-solid p-0 text-center font-regular ${INPUT_FILL} ${INPUT_TEXT} ${INPUT_INACTIVE} ${INPUT_ACTIVE_ON_FOCUS} ${INPUT_DISABLED_ON_CONTROL}`;

const CELL_SIZE = {
  medium: 'h-9 rounded-small text-400 leading-400',
  large: 'h-12 rounded-medium text-500 leading-500',
} satisfies Record<Axis<'size'>, string>;

export const resolveOTPInput: OTPInputStyleResolver<OTPInputStyleProps> = (
  props: OTPInputStyleProps = {}
) => {
  const { size = DEFAULTS.size } = props;
  return {
    root: 'flex min-w-0 max-w-full flex-col',
    disabled: 'pointer-events-none',
    cells: 'flex max-w-full gap-2',
    cell: `${CELL} ${CELL_SIZE[size]}`,
    cellFill: { empty: '', filled: '' },
    // Blade's baseInput: error is a thick negative border with the usual
    // primary-muted focus ring; success keeps the gray border.
    validation: {
      error: '!border-thick !border-interactive-negative-default',
      success: '',
    },
  };
};
