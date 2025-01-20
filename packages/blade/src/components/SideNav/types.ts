import type React from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DrawerProps } from '~components/Drawer';
import type { IconComponent } from '~components/Icons';
import type { LinkProps } from '~components/Link';
import type { TooltipProps } from '~components/Tooltip';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SideNavProps = {
  /**
   * Children slot.
   *
   * Supports SideNavFooter, SideNavBody
   */
  children: React.ReactNode;
  /**
   * **Only applicable in mobile**
   *
   * State for opening / closing the SideNav in mobile
   */
  isOpen?: DrawerProps['isOpen'];
  /**
   * **Only applicable in mobile**
   *
   * Callback when SideNav is closed
   */
  onDismiss?: DrawerProps['onDismiss'];

  /**
   * Banner slot for usecases like adding Activation Panel
   *
   * **IMPORTANT** Avoid adding promotional items in this
   */
  banner?: React.ReactElement;
} & StyledPropsBlade &
  TestID;

type SideNavLinkProps = {
  /**
   * title of the Link
   */
  title: string;

  /**
   * Slot after the title.
   *
   * Used for <Badge />, <Counter /> in most cases
   */
  titleSuffix?: React.ReactElement;

  /**
   * Trailing slot for item. Only visible on hover of the item
   *
   * Used for <Button />
   */
  trailing?: React.ReactElement;

  /**
   * href of the link
   */
  href?: LinkProps['href'];

  /**
   * Anchor tag `target` attribute
   */
  target?: LinkProps['target'];
  /**
   * as prop to pass ReactRouter's Link component.
   *
   * ```jsx
   * import { Link } from 'react-router-dom';
   *
   * <SideNavLink as={Link} />
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: React.ComponentType<any>;

  /**
   * Set Active state of SideNavLink.
   *
   * Checkout SideNav documentation for usage
   */
  isActive?: boolean;

  /**
   * Leading icon for SideNavLink
   */
  icon?: IconComponent;

  /**
   * Children slot to add Nested Menu
   *
   * ```jsx
   * <SideNavLink title="L2 Trigger" href="/l2-first-item">
   *  <SideNavLevel>
   *    <SideNavLink title="L2 Item" href="/l2-first-item" />
   *    <SideNavLink title="L2 Item 2" href="/l2-second-item" />
   *  </SideNavLevel>
   * </SideNavLink>
   * ```
   */
  children?: React.ReactElement;

  /**
   * Tooltip object to add tooltip to SideNavLink
   *
   * ```jsx
   * <SideNavLink
   *  tooltip={{
   *    title: 'Tooltip Title',
   *    content: 'Tooltip description'
   *  }}
   * />
   * ```
   */
  tooltip?: Pick<TooltipProps, 'title' | 'content' | 'onOpenChange'>;
  onClick?: (event: React.MouseEvent) => void;
} & DataAnalyticsAttribute;

type SideNavSectionProps = {
  title?: string;
  /**
   * Number of items after which the items are collapsed into `+x more`
   */
  maxVisibleItems?: number;
  /**
   * Default value if the nav section is expanded or collapsed after maxVisibleItems
   *
   * @default false
   */
  defaultIsExpanded?: boolean;
  /**
   * Callback when `+x more is clicked`
   */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;

  /**
   * Children slot for SideNavLink
   */
  children: React.ReactElement[];
} & DataAnalyticsAttribute;

type SideNavFooterProps = {
  /**
   * Children slot for SideNavLink, SideNavItem
   */
  children: React.ReactElement[] | React.ReactElement;
};

type OnLinkActiveChangeArgs = {
  title: string;
  level: number;
  isActive: boolean;
  isL2Trigger: boolean;
  isFirstRender: boolean;
};

type SideNavContextType = {
  isL1Collapsed?: boolean;
  setIsL1Collapsed?: (isL1Collapsed: boolean) => void;
  l2PortalContainerRef?: React.RefObject<HTMLDivElement>;
  onLinkActiveChange?: (args: OnLinkActiveChangeArgs) => void;
  closeMobileNav?: () => void;
};

type NavLinkContextType = {
  level?: number;
  title?: string;
};

type SideNavItemProps = {
  /**
   * Leading slot for SideNavItem.
   *
   * Meant for Indicator, Icon, etc
   */
  leading: React.ReactElement;

  /**
   * Trailing slot for SideNavItem.
   *
   * Meant for Button, Switch, etc
   */
  trailing: React.ReactElement;

  /**
   * Title of SideNavItem
   */
  title: string;

  /**
   * Render item of container. Use as="label" when using Switch or form input in trailing
   *
   * @default div
   */
  as?: 'label' | 'div';

  /**
   * backgroundColor of the item
   *
   * @default undefined
   */
  backgroundColor?: BaseBoxProps['backgroundColor'];

  /**
   * Tooltip object to add tooltip to SideNavItem
   *
   * ```jsx
   * <SideNavItem
   *  tooltip={{
   *    title: 'Tooltip Title',
   *    content: 'Tooltip description'
   *  }}
   * />
   * ```
   */
  tooltip?: SideNavLinkProps['tooltip'];
} & DataAnalyticsAttribute;

type SideNavBodyProps = {
  children: React.ReactElement | React.ReactElement[];
};

type SideNavLevelProps = { children: React.ReactElement | React.ReactElement[] };

export type {
  SideNavProps,
  SideNavContextType,
  NavLinkContextType,
  SideNavLinkProps,
  SideNavSectionProps,
  SideNavFooterProps,
  SideNavItemProps,
  SideNavBodyProps,
  SideNavLevelProps,
};
