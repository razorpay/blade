import type { SegmentedControlSize } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';

type SizeTokenMap = Record<SegmentedControlSize, DotNotationSpacingStringToken>;

const paddingTop: SizeTokenMap = {
  medium: 'spacing.2',
  large: 'spacing.3',
};

const paddingBottom: SizeTokenMap = {
  medium: 'spacing.2',
  large: 'spacing.3',
};

const paddingX: SizeTokenMap = {
  medium: 'spacing.3',
  large: 'spacing.3',
};

const trackPadding: SizeTokenMap = {
  medium: 'spacing.2',
  large: 'spacing.2',
};

const trackGap: DotNotationSpacingStringToken = 'spacing.1';

const trackBorderRadius = 'medium' as const;
const trackBackgroundColor = 'interactive.background.gray.faded';

const indicatorBackgroundColor = 'surface.background.gray.intense';
const indicatorBorderRadius = 'small' as const;

const textColor = {
  selected: {
    default: 'interactive.text.gray.normal',
    highlighted: 'interactive.text.gray.normal',
    disabled: 'interactive.text.gray.disabled',
  },
  unselected: {
    default: 'interactive.text.gray.muted',
    highlighted: 'interactive.text.gray.subtle',
    disabled: 'interactive.text.gray.disabled',
  },
} as const;

const iconColor = {
  selected: {
    default: 'interactive.icon.gray.normal',
    highlighted: 'interactive.icon.gray.normal',
    disabled: 'interactive.icon.gray.disabled',
  },
  unselected: {
    default: 'interactive.icon.gray.muted',
    highlighted: 'interactive.icon.gray.subtle',
    disabled: 'interactive.icon.gray.disabled',
  },
} as const;

const itemBackgroundColor = {
  selected: {
    default: 'colors.transparent',
    highlighted: 'colors.transparent',
    disabled: 'colors.transparent',
  },
  unselected: {
    default: 'colors.transparent',
    highlighted: 'colors.interactive.background.gray.default',
    disabled: 'colors.transparent',
  },
} as const;

const itemBorderRadius: Record<SegmentedControlSize, 'small' | 'medium'> = {
  medium: 'small',
  large: 'small',
};

const textSizeMap = {
  medium: 'medium',
  large: 'large',
} as const;

const iconSizeMap: Record<SegmentedControlSize, 'small' | 'medium'> = {
  medium: 'small',
  large: 'medium',
};

export {
  paddingTop,
  paddingBottom,
  paddingX,
  trackPadding,
  trackGap,
  trackBorderRadius,
  trackBackgroundColor,
  indicatorBackgroundColor,
  indicatorBorderRadius,
  textColor,
  iconColor,
  itemBackgroundColor,
  itemBorderRadius,
  textSizeMap,
  iconSizeMap,
};
