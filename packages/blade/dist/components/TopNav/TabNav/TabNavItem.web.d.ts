import { default as React } from 'react';
declare const TabNavItem: React.ForwardRefExoticComponent<{
    href?: string | undefined;
    target?: string | undefined;
    as?: React.ComponentType<any> | "a" | "button" | undefined;
    isActive?: boolean | undefined;
    icon?: import('../..').IconComponent | undefined;
    trailing?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    title?: string | undefined;
    accessibilityLabel?: string | undefined;
} & {
    onMouseDown?: import("../../../utils/platform/platform").Platform.Select<{
        web: React.MouseEventHandler<Element>;
        native: undefined;
    }> | undefined;
    onPointerDown?: import("../../../utils/platform/platform").Platform.Select<{
        web: React.PointerEventHandler<Element>;
        native: undefined;
    }> | undefined;
    onKeyDown?: import("../../../utils/platform/platform").Platform.Select<{
        web: React.KeyboardEventHandler<Element>;
        native: undefined;
    }> | undefined;
    onKeyUp?: import("../../../utils/platform/platform").Platform.Select<{
        web: React.KeyboardEventHandler<Element>;
        native: undefined;
    }> | undefined;
    onClick?: import("../../../utils/platform/platform").Platform.Select<{
        web: React.MouseEventHandler<Element>;
        native: undefined;
    }> | undefined;
} & React.RefAttributes<HTMLAnchorElement>>;
export { TabNavItem };
