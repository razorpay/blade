import type { IconComponent } from '~components/Icons';
import type { TestID } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';

export type StyledIconButtonProps = {
  icon: IconComponent;
  onClick: () => void;
  size: 'medium' | 'large';
  contrast: 'low' | 'high';
  accessibilityLabel: string;
} & TestID &
  BladeCommonEvents;
