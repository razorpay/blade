import { size } from '~tokens/global';

const labelTextSize = {
  top: {
    medium: 'small',
    large: 'medium',
  },
  left: {
    medium: 'medium',
    large: 'large',
  },
} as const;

const labelOptionalIndicatorTextSize = {
  medium: 'small',
  large: 'medium',
} as const;

const hintTextSize = {
  medium: 'small',
  large: 'medium',
} as const;

const hintIconSize = {
  medium: 'small',
  large: 'medium',
} as const;

const hintMarginTop = {
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

const labelMarginBottom = {
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

const labelWidth = {
  medium: size[120],
  large: size[176],
} as const;

export {
  labelTextSize,
  labelOptionalIndicatorTextSize,
  hintTextSize,
  hintIconSize,
  hintMarginTop,
  labelMarginBottom,
  labelWidth,
};
