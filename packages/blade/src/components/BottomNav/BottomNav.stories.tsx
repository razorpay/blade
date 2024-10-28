import type { StoryFn, Meta } from '@storybook/react';
// import { Title } from '@storybook/addon-docs';
// import type { BadgeProps } from './Badge';
// import { Badge as BadgeComponent } from './Badge';
// import { InfoIcon } from '~components/Icons';
import iconMap from '~components/Icons/iconMap';
// import BaseBox from '~components/Box/BaseBox';
// import { Text as BladeText } from '~components/Typography';
// import { Sandbox } from '~utils/storybook/Sandbox';
// import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { BottomNav, BottomNavItem } from '.';
import { PaymentGatewayIcon } from '~components/Icons';

// const Page = (): React.ReactElement => {
//   return (
//     <StoryPageWrapper
//       componentName="Badge"
//       componentDescription="Badges are used to show small amount of color coded metadata, which are ideal for getting user attention."
//       figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=73941-78445&t=pjKzaOWOoMI2J9jb-1&scaling=min-zoom&page-id=8110%3A0&mode=design"
//     >
//       <Title>Usage</Title>
//       <Sandbox>
//         {`
//         import { Badge, InfoIcon } from '@razorpay/blade/components';

//         function App(): React.ReactElement {
//           return (
//             <Badge color="neutral" icon={InfoIcon}>
//               Boop
//             </Badge>
//           )
//         }

//         export default App;
//         `}
//       </Sandbox>
//     </StoryPageWrapper>
//   );
// };

export default {
  title: 'Components/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
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
    // docs: {
    //   page: Page,
    // },
  },
} as Meta<typeof BottomNav>;

const BottomNavTemplate: StoryFn<typeof BottomNav> = ({ children, ...args }) => {
  return (
    <BottomNav>
      <BottomNavItem title="Payments" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem isActive title="Banking" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem title="Wow" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem title="Wow" href="/payments" icon={PaymentGatewayIcon} />
      <BottomNavItem title="Wow" href="/payments" icon={PaymentGatewayIcon} />
    </BottomNav>
  );
};

export const Default = BottomNavTemplate.bind({});
Default.args = {};
