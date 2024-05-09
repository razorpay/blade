import type React from 'react';
import type { IconComponent } from '~components/Icons';

type SideNavProps = {
  children: React.ReactNode;
};

type ActiveLinkType =
  | {
      ref: React.MutableRefObject<HTMLAnchorElement | null>;
      parentLinkRef: React.MutableRefObject<HTMLAnchorElement | null>;
      level: number;
    }
  | undefined;

type SideNavLinkProps = {
  title: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: React.ComponentType<any>;
  isCurrentPage?: boolean;
  icon: IconComponent;
  children?: React.ReactElement;
};

type SideNavContextType = {
  l2PortalContainerRef?: React.RefObject<HTMLDivElement>;
  activeLink?: ActiveLinkType;
  setActiveLink: (activeLink: ActiveLinkType) => void;
};

export type { SideNavProps, SideNavContextType, SideNavLinkProps, ActiveLinkType };
