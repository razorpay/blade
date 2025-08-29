import { default as React } from 'react';
import { BladeElementRef } from '../../../utils/types';
declare const BaseMenuItem: React.ForwardRefExoticComponent<{
    as?: React.ComponentType<any> | "a" | "button" | undefined;
    id?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    children?: React.ReactNode;
    className?: string | undefined;
    isDisabled?: boolean | undefined;
    isSelected?: boolean | undefined;
    isVisible?: boolean | undefined;
    isKeydownPressed?: boolean | undefined;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    titleSuffix?: React.ReactNode;
    selectionType?: "multiple" | "single" | undefined;
    color?: "negative" | undefined;
    href?: string | undefined;
    target?: string | undefined;
    rel?: string | undefined;
    role?: "link" | "menuitem" | "option" | "menuitemcheckbox" | undefined;
    tabIndex?: number | undefined;
    onClick?: import("../../../utils/platform/platform").Platform.Select<{
        web: React.MouseEventHandler<Element>;
        native: ((event: any) => void) | undefined;
    }> | undefined;
} & import('../../types').BladeCommonEvents & import('../../../utils/types').DataAnalyticsAttribute & React.RefAttributes<BladeElementRef>>;
export { BaseMenuItem };
