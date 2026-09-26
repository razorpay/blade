import type { AxisValue } from '../../axes';
import type { ValidationState } from '../../runes/form/hint';
import { FIELD_HINT_TONE } from '../shared/field';
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
  /** The visible label text. */
  label: string;
  /** The row of cells. */
  cells: string;
  /** One single-character control. */
  cell: string;
  /** Applied to a cell per whether it holds a character. */
  cellFill: Record<'empty' | 'filled', string>;
  /** Applied to every cell per validation state. */
  validation: Record<Exclude<OTPInputValidationState, 'none'>, string>;
  /** The one line under the control. */
  hint: string;
  /** Applied to the hint line per validation state. */
  hintTone: Record<OTPInputValidationState, string>;
}

/** Style props in, the parts out. */
export type OTPInputStyleResolver<P> = (props: P) => OTPInputClasses;

const DEFAULTS = { size: 'medium', labelPosition: 'top' } as const;

/** The blade taxonomy as data. */
export const OTP_INPUT_AXES = {
  size: ['medium', 'large'],
  labelPosition: ['top', 'left'],
} as const;

type Axis<K extends keyof typeof OTP_INPUT_AXES> = AxisValue<
  typeof OTP_INPUT_AXES,
  K
>;

/** Derived from OTP_INPUT_AXES: add a value there, never here. */
export interface OTPInputStyleProps {
  size?: Axis<'size'>;
  labelPosition?: Axis<'labelPosition'>;
}

const CELL = `box-border w-0 min-w-0 flex-1 border-thin border-solid p-0 text-center font-regular ${INPUT_FILL} ${INPUT_TEXT} ${INPUT_INACTIVE} ${INPUT_ACTIVE_ON_FOCUS} ${INPUT_DISABLED_ON_CONTROL}`;

const CELL_SIZE = {
  medium: 'h-9 rounded-small text-400 leading-400',
  large: 'h-12 rounded-medium text-500 leading-500',
} satisfies Record<Axis<'size'>, string>;

// Label above: 4px (medium) or 8px (large) to the cells and the hint.
// Label left: a fixed 120px / 176px column, 12px / 16px from the cells,
// with the hint under the cells.
const LAYOUT = {
  top: {
    medium: 'flex flex-col gap-1',
    large: 'flex flex-col gap-2',
  } satisfies Record<Axis<'size'>, string>,
  left: {
    medium: 'grid [grid-template-columns:120px_minmax(0,1fr)] items-center gap-x-3 gap-y-1',
    large: 'grid [grid-template-columns:176px_minmax(0,1fr)] items-center gap-x-4 gap-y-2',
  } satisfies Record<Axis<'size'>, string>,
} satisfies Record<Axis<'labelPosition'>, Record<string, string>>;

const LABEL_SIZE = {
  top: {
    medium: 'text-75 leading-50',
    large: 'text-100 leading-100',
  } satisfies Record<Axis<'size'>, string>,
  left: {
    medium: 'text-100 leading-100',
    large: 'text-200 leading-200',
  } satisfies Record<Axis<'size'>, string>,
} satisfies Record<Axis<'labelPosition'>, Record<string, string>>;

// A left label takes the first grid column, so the cells and the hint take
// the second.
const COLUMN = {
  top: '',
  left: 'col-start-2',
} satisfies Record<Axis<'labelPosition'>, string>;

const HINT_SIZE = {
  medium: 'text-75 leading-50',
  large: 'text-100 leading-100',
} satisfies Record<Axis<'size'>, string>;

export const resolveOTPInput: OTPInputStyleResolver<OTPInputStyleProps> = (
  props: OTPInputStyleProps = {}
) => {
  const { size = DEFAULTS.size, labelPosition = DEFAULTS.labelPosition } =
    props;
  const column = COLUMN[labelPosition];
  return {
    root: `w-full ${LAYOUT[labelPosition][size]}`,
    disabled: 'pointer-events-none',
    label: `${LABEL_SIZE[labelPosition][size]} text-surface-gray-subtle`,
    cells: `flex w-full gap-2 ${column}`,
    cell: `${CELL} ${CELL_SIZE[size]}`,
    cellFill: { empty: '', filled: '' },
    // Blade's baseInput: error is a thick negative border with the usual
    // primary-muted focus ring; success keeps the gray border.
    validation: {
      error: '!border-thick !border-interactive-negative-default',
      success: '',
    },
    hint: `${HINT_SIZE[size]} ${column}`,
    hintTone: FIELD_HINT_TONE,
  };
};
