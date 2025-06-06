import type { InfoGroupProps } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';
import type { IconProps } from '~components/Icons';
import { size } from '~tokens/global';

// Gap between leading/trailing elements and content
const elementGap: Record<NonNullable<InfoGroupProps['size']>, DotNotationSpacingStringToken> = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
};

// Size mapping for InfoItemKey
const titleTextSize: Record<
  NonNullable<InfoGroupProps['size']>,
  'xsmall' | 'small' | 'medium' | 'large'
> = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

// Text sizes for help text (has different mapping)
const helpTextSize: Record<
  NonNullable<InfoGroupProps['size']>,
  'xsmall' | 'small' | 'medium' | 'large'
> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'xsmall',
  large: 'small',
};

// Icon sizes for different InfoGroup sizes
const iconSize: Record<NonNullable<InfoGroupProps['size']>, IconProps['size']> = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

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
