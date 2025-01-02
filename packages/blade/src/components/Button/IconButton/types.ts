import type { IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, RemoveUndefinedFromUnion, TestID } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';

export type StyledIconButtonProps = {
  icon: IconComponent;
  size: RemoveUndefinedFromUnion<IconButtonProps['size']>;
  emphasis: SubtleOrIntense;
  accessibilityLabel: string;
  isDisabled?: IconButtonProps['isDisabled'];
  isHighlighted?: IconButtonProps['isHighlighted'];
  tabIndex?: IconButtonProps['_tabIndex'];
  onClick?: IconButtonProps['onClick'];
} & TestID &
  BladeCommonEvents &
  DataAnalyticsAttribute &
  StyledPropsBlade;
