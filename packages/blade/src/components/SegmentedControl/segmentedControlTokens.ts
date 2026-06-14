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
  medium: 'spacing.4',
  large: 'spacing.5',
};

const containerPadding: SizeTokenMap = {
  small: 'spacing.1',
  medium: 'spacing.1',
  large: 'spacing.1',
};

const gap: SizeTokenMap = {
  small: 'spacing.1',
  medium: 'spacing.1',
  large: 'spacing.2',
};

const textSizeMap: Record<SegmentedControlSize, 'small' | 'medium' | 'large'> = {
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

const iconSizeMap: Record<SegmentedControlSize, 'small' | 'medium' | 'large'> = {
  small: 'small',
  medium: 'small',
  large: 'medium',
};

export { paddingY, paddingX, containerPadding, gap, textSizeMap, iconSizeMap };
