import type { StoryFn, Meta } from '@storybook/react';
import iconMap from '~components/Icons/iconMap';
import { BottomNav, BottomNavItem } from '.';
import { BusinessBankingIcon, MenuDotsIcon, PaymentGatewayIcon } from '~components/Icons';

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

const BottomNavItemTemplate: StoryFn<typeof BottomNavItem> = (args) => {
  return (
    <BottomNav>
      <BottomNavItem title="Payments" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem {...args} />
      <BottomNavItem title="Wow" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem title="Wow" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem
        title="More"
        onClick={() => {
          console.log('More Clicked');
        }}
        icon={MenuDotsIcon}
      />
    </BottomNav>
  );
};

export const BottomNavItemPlayground = BottomNavItemTemplate.bind({});
BottomNavItemPlayground.args = {
  title: 'Banking',
  href: '/banking',
  icon: BusinessBankingIcon,
  isActive: true,
};
BottomNavItemPlayground.storyName = 'BottomNavItem Playground';
