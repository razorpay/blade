import { LinkProps } from '../Link';
import { BladeCommonEvents } from '../types';
import { Platform } from '../../utils';
import { DataAnalyticsAttribute } from '../../utils/types';
type BaseMenuItemProps = {
    as?: React.ComponentType<any> | 'a' | 'button';
    id?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    isDisabled?: boolean;
    isSelected?: boolean;
    isVisible?: boolean;
    isKeydownPressed?: boolean;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    titleSuffix?: React.ReactNode;
    selectionType?: 'single' | 'multiple';
    color?: 'negative';
    href?: LinkProps['href'];
    target?: LinkProps['target'];
    rel?: LinkProps['rel'];
    role?: 'menuitem' | 'menuitemcheckbox' | 'option' | 'link';
    tabIndex?: number;
    onClick?: Platform.Select<{
        web: React.MouseEventHandler;
        native: undefined | ((event: any) => void);
    }>;
} & BladeCommonEvents & DataAnalyticsAttribute;
type StyledBaseMenuItemContainerProps = Pick<BaseMenuItemProps, 'color' | 'selectionType' | 'isSelected' | 'isDisabled' | 'isVisible' | 'isKeydownPressed'>;
type BaseMenuItemContextType = {
    color?: BaseMenuItemProps['color'];
    isDisabled?: BaseMenuItemProps['isDisabled'];
};
export type { BaseMenuItemProps, StyledBaseMenuItemContainerProps, BaseMenuItemContextType };
