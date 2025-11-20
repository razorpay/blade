import React from 'react';
import { InfoIcon, LayoutIcon, LogInIcon } from '@razorpay/blade/components';

type NavItem = {
  icon: React.ComponentType;
  title: string;
  href: string;
  trailing?: React.ReactNode;
  items?: NavItem[];
};

type NavSection = {
  type: 'section';
  title?: string;
  maxItemsVisible: number;
  items: NavItem[];
};

export const navItemsJSON: NavSection[] = [
  {
    type: 'section',
    title: 'Layout Complexity',
    maxItemsVisible: 5,
    items: [
      {
        icon: LayoutIcon,
        title: 'Login (low)',
        href: '/dashboard/layout-complexity/login',
      },
      {
        icon: LayoutIcon,
        title: 'Account Settings (medium)',
        href: '/dashboard/layout-complexity/account-settings',
      },
      {
        icon: LayoutIcon,
        title: 'Insights (high)',
        href: '/dashboard/layout-complexity/insights',
      },
    ],
  },
  {
    type: 'section',
    title: 'Component Density',
    maxItemsVisible: 5,
    items: [
      {
        icon: LogInIcon,
        title: 'Signup (low)',
        href: '/dashboard/component-density/signup',
      },
      {
        icon: InfoIcon,
        title: 'Transaction Card (medium)',
        href: '/dashboard/component-density/transaction-card',
      },
      {
        icon: LayoutIcon,
        title: 'Developer Console (high)',
        href: '/dashboard/component-density/developer-console',
      },
    ],
  },
];
