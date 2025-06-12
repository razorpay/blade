import { size } from '~tokens/global';

// Gap between leading/trailing elements and content
const elementGap = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

// Size mapping for InfoItemKey
const titleTextSize = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

// Text sizes for help text (has different mapping)
const helpTextSize = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'xsmall',
  large: 'small',
} as const;

// Icon sizes for different InfoGroup sizes
const iconSize = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

const itemTitleHeight = {
  xsmall: size['14'],
  small: size['18'],
  medium: size['20'],
  large: size['24'],
};

const avatarAdjustmentPaddingY = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

export {
  elementGap,
  titleTextSize,
  helpTextSize,
  iconSize,
  itemTitleHeight,
  avatarAdjustmentPaddingY,
};
