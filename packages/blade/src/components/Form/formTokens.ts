import { size } from '~tokens/global';

const labelTextSize = {
  top: {
    small: 'small',
    medium: 'small',
    large: 'medium',
  },
  left: {
    small: 'small',
    medium: 'medium',
    large: 'large',
  },
} as const;

const labelOptionalIndicatorTextSize = {
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const hintTextSize = {
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const hintIconSize = {
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const hintMarginTop = {
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

const labelMarginBottom = {
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

const labelWidth = {
  small: size[120],
  medium: size[120],
  large: size[176],
} as const;

const labelLeftMarginRight = {
  small: 'spacing.3',
  medium: 'spacing.4',
  large: 'spacing.5',
} as const;

export {
  labelTextSize,
  labelOptionalIndicatorTextSize,
  hintTextSize,
  hintIconSize,
  hintMarginTop,
  labelMarginBottom,
  labelWidth,
  labelLeftMarginRight,
};
