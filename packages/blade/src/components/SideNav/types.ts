import type React from 'react';
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
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: React.ComponentType<any>;
  isCurrentPage?: boolean;
  icon?: IconComponent;
  children?: React.ReactElement;
  tooltip?: Pick<TooltipProps, 'title' | 'content' | 'onOpenChange'>;
};

type SideNavSectionProps = {
  title: string;
  /**
   * Number of items after which the items are collapsed into `+x more`
   */
  maxVisibleItems?: number;
  /**
   * Callback when `+x more is clicked`
   */
  onToggleVisibleItems?: ({ isExpanded }: { isExpanded: boolean }) => void;

  children: React.ReactElement[];
};

type SideNavFooterProps = {
  children: React.ReactElement[] | React.ReactElement;
};

type OnLinkActiveChangeArgs = {
  id: string;
  title: string;
  level: number;
  isActive: boolean;
  isL2Trigger: boolean;
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

export type {
  SideNavProps,
  SideNavContextType,
  NavLinkContextType,
  SideNavLinkProps,
  SideNavSectionProps,
  SideNavFooterProps,
};
