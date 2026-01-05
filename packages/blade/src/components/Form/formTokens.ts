import { size } from '~tokens/global';

const labelTextSize = {
  top: {
    xsmall: 'small',
    small: 'small',
    medium: 'small',
    large: 'medium',
  },
  left: {
    xsmall: 'small',
    small: 'small',
    medium: 'medium',
    large: 'large',
  },
} as const;

const labelOptionalIndicatorTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const hintTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const hintIconSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const hintMarginTop = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

const labelMarginBottom = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

const labelWidth = {
  xsmall: size[120],
  small: size[120],
  medium: size[120],
  large: size[176],
} as const;

const labelLeftMarginRight = {
  xsmall: 'spacing.3',
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
