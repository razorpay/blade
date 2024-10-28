import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { BottomNav, BottomNavItem, BottomNavProps } from '.';
import {
  MenuDotsIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  TransactionsIcon,
} from '~components/Icons';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="BottomNav"
      componentDescription="Bottom navigation component is a persistent user interface element at the bottom of a mobile app screen, providing quick access to core functionalities through icons and labels."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=96508-47113&node-type=frame&m=dev&scaling=min-zoom&content-scaling=fixed&page-id=91244%3A54900"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Badge, InfoIcon } from '@razorpay/blade/components';

        function App(): React.ReactElement {
          return (
            <Badge color="neutral" icon={InfoIcon}>
              Boop
            </Badge>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    viewport: {
      defaultViewport: 'iPhone6',
    },
    docs: {
      page: Page,
    },
  },
} as Meta<typeof BottomNav>;

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
    isActive: true,
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
    title: 'More',
    onClick: () => console.log('More Clicked'),
    icon: MenuDotsIcon,
  },
];

const BottomNavTemplate: StoryFn<BottomNavProps> = ({ children, ...args }) => {
  return (
    <BottomNav {...args}>
      {children ?? bottomNavItems.map((item, index) => <BottomNavItem key={index} {...item} />)}
    </BottomNav>
  );
};

export const Default = BottomNavTemplate.bind({});
Default.args = {};

export const ItemsSink = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.10">
      <Box>
        <Heading>2 Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.slice(0, 2).map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
      <Box>
        <Heading>4 Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.slice(0, 4).map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
      <Box>
        <Heading>Max Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
    </Box>
  );
};
