import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { BottomNav, BottomNavItem } from '.';
import { MenuDotsIcon, PaymentGatewayIcon } from '~components/Icons';

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

const BottomNavTemplate: StoryFn<typeof BottomNav> = ({ children, ...args }) => {
  return (
    <BottomNav>
      <BottomNavItem title="Payments" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem isActive title="Banking" href="/payments" icon={PaymentGatewayIcon} />
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

export const Default = BottomNavTemplate.bind({});
Default.args = {};
