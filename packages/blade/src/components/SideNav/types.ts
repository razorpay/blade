import type React from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { DrawerProps } from '~components/Drawer';
import type { IconComponent } from '~components/Icons';
import type { TooltipProps } from '~components/Tooltip';

type SideNavProps = {
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
};

type SideNavLinkProps = {
  title: string;
  titleSuffix?: React.ReactElement;
  trailing?: React.ReactElement;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: React.ComponentType<any>;
  isActive?: boolean;
  icon?: IconComponent;
  children?: React.ReactElement;
  tooltip?: Pick<TooltipProps, 'title' | 'content' | 'onOpenChange'>;
};

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

  children: React.ReactElement[];
};

type SideNavFooterProps = {
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
  leading: React.ReactElement;
  trailing: React.ReactElement;
  title: string;
  /**
   * Render item of container. Use as="label" when using Switch or form input in trailing
   *
   * @default div
   */
  as?: 'label' | 'div';
  backgroundColor?: BaseBoxProps['backgroundColor'];
};

export type {
  SideNavProps,
  SideNavContextType,
  NavLinkContextType,
  SideNavLinkProps,
  SideNavSectionProps,
  SideNavFooterProps,
  SideNavItemProps,
};
