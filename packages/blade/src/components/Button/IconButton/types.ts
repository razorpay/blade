import type { IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, RemoveUndefinedFromUnion, TestID } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { AccessibilityProps } from '~utils/makeAccessible';
import type { Platform } from '~utils';

export type StyledIconButtonProps = {
  icon: IconComponent;
  size: RemoveUndefinedFromUnion<IconButtonProps['size']>;
  emphasis: SubtleOrIntense;
  accessibilityLabel: string;
  accessibilityProps?: Partial<AccessibilityProps>;
  isDisabled?: IconButtonProps['isDisabled'];
  isHighlighted?: IconButtonProps['isHighlighted'];
  tabIndex?: IconButtonProps['_tabIndex'];
  onClick?: IconButtonProps['onClick'];
  onKeyDown?: Platform.Select<{
    web: React.KeyboardEventHandler;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    native: undefined | ((event: any) => void);
  }>;
} & TestID &
  BladeCommonEvents &
  DataAnalyticsAttribute &
  StyledPropsBlade;
