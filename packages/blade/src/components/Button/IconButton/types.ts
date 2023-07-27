import type { IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { RemoveUndefinedFromUnion, TestID } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';

export type StyledIconButtonProps = {
  icon: IconComponent;
  onClick: () => void;
  size: RemoveUndefinedFromUnion<IconButtonProps['size']>;
  contrast: 'low' | 'high';
  accessibilityLabel: string;
  isDisabled?: IconButtonProps['isDisabled'];
} & TestID &
  BladeCommonEvents;
