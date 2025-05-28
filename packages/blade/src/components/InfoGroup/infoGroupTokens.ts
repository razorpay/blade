import type { InfoGroupProps } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';
import type { IconProps } from '~components/Icons';

// Typography configuration for different text types
type TypographyConfig = {
  variant: 'body';
  size: 'xsmall' | 'small' | 'medium' | 'large';
  weight: 'medium' | 'semibold';
};

// Spacing between InfoGroup items
const itemSpacing: Record<NonNullable<InfoGroupProps['size']>, DotNotationSpacingStringToken> = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.3',
  large: 'spacing.4',
};

// Gap between InfoItemKey and InfoItemValue within an InfoItem
const keyValueGap: Record<NonNullable<InfoGroupProps['size']>, DotNotationSpacingStringToken> = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.3',
  large: 'spacing.3',
};

// Gap between leading/trailing elements and content
const elementGap: Record<NonNullable<InfoGroupProps['size']>, DotNotationSpacingStringToken> = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
};

// Typography configuration for InfoItemKey
const keyTypography: Record<NonNullable<InfoGroupProps['size']>, TypographyConfig> = {
  xsmall: { variant: 'body', size: 'xsmall', weight: 'medium' },
  small: { variant: 'body', size: 'small', weight: 'medium' },
  medium: { variant: 'body', size: 'medium', weight: 'medium' },
  large: { variant: 'body', size: 'large', weight: 'medium' },
};

// Typography configuration for InfoItemValue
const valueTypography: Record<NonNullable<InfoGroupProps['size']>, TypographyConfig> = {
  xsmall: { variant: 'body', size: 'xsmall', weight: 'semibold' },
  small: { variant: 'body', size: 'small', weight: 'semibold' },
  medium: { variant: 'body', size: 'medium', weight: 'semibold' },
  large: { variant: 'body', size: 'large', weight: 'semibold' },
};

// Text sizes for help text (has different mapping)
const helpTextSize: Record<
  NonNullable<InfoGroupProps['size']>,
  'xsmall' | 'small' | 'medium' | 'large'
> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
};

// Icon sizes for different InfoGroup sizes
const iconSize: Record<NonNullable<InfoGroupProps['size']>, IconProps['size']> = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

// Divider spacing
const dividerSpacing: Record<NonNullable<InfoGroupProps['size']>, DotNotationSpacingStringToken> = {
  xsmall: 'spacing.2',
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.4',
};

export {
  itemSpacing,
  keyValueGap,
  elementGap,
  keyTypography,
  valueTypography,
  helpTextSize,
  iconSize,
  dividerSpacing,
};
