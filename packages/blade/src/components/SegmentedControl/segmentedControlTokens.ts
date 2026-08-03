import type { SegmentedControlSize } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';

type SizeTokenMap = Record<SegmentedControlSize, DotNotationSpacingStringToken>;

const paddingY: SizeTokenMap = {
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
};

const paddingX: SizeTokenMap = {
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.3',
};

const containerPadding: SizeTokenMap = {
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.2',
};

const gap: SizeTokenMap = {
  small: 'spacing.1',
  medium: 'spacing.1',
  large: 'spacing.1',
};

const containerBorderRadius: Record<SegmentedControlSize, 'small' | 'medium'> = {
  small: 'small',
  medium: 'small',
  large: 'medium',
};

const itemBorderRadius: Record<SegmentedControlSize, 'xsmall' | 'small'> = {
  small: 'xsmall',
  medium: 'xsmall',
  large: 'small',
};

const containerHeight: Record<SegmentedControlSize, number> = {
  small: 32,
  medium: 36,
  large: 48,
};

const itemHeight: Record<SegmentedControlSize, number> = {
  small: 24,
  medium: 28,
  large: 40,
};

const textSizeMap: Record<SegmentedControlSize, 'small' | 'medium' | 'large'> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const iconSizeMap: Record<SegmentedControlSize, 'small' | 'medium' | 'large'> = {
  small: 'medium',
  medium: 'medium',
  large: 'large',
};

export {
  paddingY,
  paddingX,
  containerPadding,
  containerBorderRadius,
  itemBorderRadius,
  containerHeight,
  itemHeight,
  gap,
  textSizeMap,
  iconSizeMap,
};
