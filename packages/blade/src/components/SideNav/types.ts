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
};

type SideNavContextType = {
  RouterLink?: SideNavProps['routerLink'];
};

export type { SideNavProps, SideNavContextType, SideNavLinkProps };
