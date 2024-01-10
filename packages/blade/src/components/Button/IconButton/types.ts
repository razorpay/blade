import type { IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { RemoveUndefinedFromUnion, TestID } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';

export type StyledIconButtonProps = {
  icon: IconComponent;
  size: RemoveUndefinedFromUnion<IconButtonProps['size']>;
  emphasis: SubtleOrIntense;
  accessibilityLabel: string;
  isDisabled?: IconButtonProps['isDisabled'];
  tabIndex?: IconButtonProps['_tabIndex'];
  onClick?: IconButtonProps['onClick'];
} & TestID &
  BladeCommonEvents;
