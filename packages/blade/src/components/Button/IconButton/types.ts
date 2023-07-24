import type { IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { TestID } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';

export type StyledIconButtonProps = {
  icon: IconComponent;
  onClick: () => void;
  size: 'small' | 'medium' | 'large';
  contrast: 'low' | 'high';
  accessibilityLabel: string;
  isDisabled?: IconButtonProps['isDisabled'];
  tabIndex?: IconButtonProps['_tabIndex'];
} & TestID &
  BladeCommonEvents;
