import type { StoryFn, Meta } from '@storybook/react';
import { BottomNav, BottomNavItem } from '.';
import iconMap from '~components/Icons/iconMap';
import {
  PaymentButtonIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  TransactionsIcon,
} from '~components/Icons';

export default {
  title: 'Components/BottomNav/BottomNavItem Playground',
  component: BottomNavItem,
  argTypes: {
    icon: {
      name: 'icon',
      // weird TS error
      type: 'select' as 'string',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'iPhone6',
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
} as Meta<typeof BottomNavItem>;

const bottomNavItems = [
  {
    title: 'Payments',
    href: '/payments',
    icon: PaymentGatewayIcon,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: TransactionsIcon,
  },
  {
    title: 'Links',
    href: '/payment-links',
    icon: PaymentLinkIcon,
  },
  {
    title: 'Pages',
    href: '/payment-pages',
    icon: PaymentPagesIcon,
  },
  {
    title: 'Buttons',
    href: '/payment-buttons',
    icon: PaymentButtonIcon,
  },
];

const BottomNavItemTemplate: StoryFn<typeof BottomNavItem> = (args) => {
  return (
    <BottomNav>
      <BottomNavItem {...args} />
      {bottomNavItems.slice(1).map((item, index) => (
        <BottomNavItem key={index} {...item} />
      ))}
    </BottomNav>
  );
};

export const BottomNavItemPlayground = BottomNavItemTemplate.bind({});
BottomNavItemPlayground.args = {
  ...bottomNavItems[0],
  isActive: true,
};
BottomNavItemPlayground.storyName = 'BottomNavItem Playground';
