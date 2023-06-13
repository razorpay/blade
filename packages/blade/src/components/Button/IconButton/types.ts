import type { IconComponent } from '~components/Icons';
import type { BladeCommonEvents } from '~components/Tooltip/types';
import type { TestID } from '~src/_helpers/types';

export type StyledIconButtonProps = {
  icon: IconComponent;
  onClick: () => void;
  size: 'medium' | 'large';
  contrast: 'low' | 'high';
  accessibilityLabel: string;
} & TestID &
  BladeCommonEvents;
