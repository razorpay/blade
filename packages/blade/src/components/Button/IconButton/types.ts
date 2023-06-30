import type { IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { BladeCommonEvents } from '~components/types';
import type { TestID } from '~src/_helpers/types';

export type StyledIconButtonProps = {
  icon: IconComponent;
  onClick: () => void;
  size: 'small' | 'medium' | 'large';
  contrast: 'low' | 'high';
  accessibilityLabel: string;
  isDisabled?: IconButtonProps['isDisabled'];
} & TestID &
  BladeCommonEvents;
