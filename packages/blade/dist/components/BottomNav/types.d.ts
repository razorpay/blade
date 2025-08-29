import { default as React } from 'react';
import { StyledPropsBlade } from '../Box/styledProps';
import { IconComponent } from '../Icons';
import { LinkProps } from '../Link';
import { Platform } from '../../utils';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
type BottomNavProps = {
    /**
     * children slot of BottomNav, accepts BottomNavItem
     */
    children: React.ReactNode;
    /**
     * zIndex of BottomNav
     *
     * @default 100
     */
    zIndex?: number;
} & StyledPropsBlade & TestID & DataAnalyticsAttribute;
type BottomNavItemProps = {
    /**
     * Title text of the BottomNavItem
     */
    title: string;
    /**
     * Icon rendered above the title.
     *
     * Accepts icon component from blade
     */
    icon: IconComponent;
    /**
     * href property of link
     *
     * maps to `to` property when react router is being used
     */
    href?: LinkProps['href'];
    /**
     * HTML's `target` attribute for anchor links
     */
    target?: LinkProps['target'];
    /**
     * HTML's `rel` tag of anchor links
     */
    rel?: LinkProps['rel'];
    /**
     * as prop to pass ReactRouter's Link component.
     *
     * ```jsx
     * import { NavLink } from 'react-router-dom';
     *
     * <BottomNavItem as={Link} />
     * ```
     */
    as?: React.ComponentType<any>;
    /**
     * Active state of the BottomNavItem.
     *
     * Use this to set the current page's active state using react router
     */
    isActive?: boolean;
    /**
     * onClick handler of BottomNavItem
     */
    onClick?: Platform.Select<{
        web: React.MouseEventHandler;
        native: undefined;
    }>;
} & TestID & DataAnalyticsAttribute;
export type { BottomNavItemProps, BottomNavProps };
