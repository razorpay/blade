import type React from 'react';
import type { IconComponent } from '~components/Icons';

type SideNavProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routerLink: React.ComponentType<any>;
};

type SideNavLinkProps = {
  title: string;
  href: string;
  icon: IconComponent;
  children?: React.ReactElement;
};

type SideNavContextType = {
  RouterLink?: SideNavProps['routerLink'];
  l2PortalContainerRef?: React.RefObject<HTMLDivElement>;
};

export type { SideNavProps, SideNavContextType, SideNavLinkProps };
