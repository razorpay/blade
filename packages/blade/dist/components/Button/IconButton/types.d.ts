import { IconButtonProps } from './IconButton';
import { IconComponent } from '../../Icons';
import { DataAnalyticsAttribute, RemoveUndefinedFromUnion, TestID } from '../../../utils/types';
import { BladeCommonEvents } from '../../types';
import { SubtleOrIntense } from '../../../tokens/theme/theme';
import { StyledPropsBlade } from '../../Box/styledProps';
import { AccessibilityProps } from '../../../utils/makeAccessible';
import { Platform } from '../../../utils';
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
        native: undefined | ((event: any) => void);
    }>;
} & TestID & BladeCommonEvents & DataAnalyticsAttribute & StyledPropsBlade;
