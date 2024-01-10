import type { BladeProps } from '~/code/types/Blade';

export const defaultValues: BladeProps = {
  flexDirection: { value: 'row', type: 'string' },
  display: { value: 'block', type: 'string' },
  gap: { value: '0', type: 'string' },
  justifyContent: { value: 'start', type: 'string' },
  alignItems: { value: 'start', type: 'string' },
  padding: {
    value: 'spacing.0',
    type: 'string',
  },
};

export const LAYOUT_MODES = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL',
  NONE: 'NONE',
};

export const AXIS_ALIGNMENT = {
  MIN: 'MIN',
  CENTER: 'CENTER',
  MAX: 'MAX',
  SPACE_BETWEEN: 'SPACE_BETWEEN',
  BASELINE: 'BASELINE',
};

export const AXIS_ALIGNMENT_TO_FLEX_MAP: Record<keyof typeof AXIS_ALIGNMENT, string> = {
  MIN: 'start',
  CENTER: 'center',
  MAX: 'end',
  SPACE_BETWEEN: 'space-between',
  BASELINE: 'baseline',
};
