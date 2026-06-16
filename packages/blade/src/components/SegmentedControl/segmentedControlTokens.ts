import type { SegmentedControlSize } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';

type SizeTokenMap = Record<SegmentedControlSize, DotNotationSpacingStringToken>;

const paddingY: SizeTokenMap = {
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.3',
};

const paddingX: SizeTokenMap = {
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.3',
};

const containerPadding: SizeTokenMap = {
  small: 'spacing.1',
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
  medium: 'medium',
  large: 'medium',
};

// 6px for small is a deliberate design decision — sits between xsmall (4px) and small (8px) tokens for visual proportion at this size
const itemBorderRadius: Record<SegmentedControlSize, number | 'small'> = {
  small: 6,
  medium: 'small',
  large: 'small',
};

const textSizeMap: Record<SegmentedControlSize, 'small' | 'medium' | 'large'> = {
  small: 'medium',
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
  gap,
  textSizeMap,
  iconSizeMap,
};
