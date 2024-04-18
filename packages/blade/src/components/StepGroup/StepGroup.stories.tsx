/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { SwitchProps } from './';
import { StepItem, StepGroup } from './';
// import { Text } from '~components/Typography';
// import { BaseBox } from '~components/Box/BaseBox';
// import { Button } from '~components/Button';
// import { Box } from '~components/Box';
// import { GlobeIcon, MapPinIcon, WifiIcon } from '~components/Icons';
// import { Card, CardBody } from '~components/Card';
// import { Alert } from '~components/Alert';
// import { Link } from '~components/Link';
// import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
// import { Sandbox } from '~utils/storybook/Sandbox';
// import type { BladeElementRef } from '~utils/types';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';

// const Page = (): React.ReactElement => {
//   return (
//     <StoryPageWrapper
//       componentName="Switch"
//       componentDescription="A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off."
//       figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85736&t=k8yrOO74u7fLzkIE-1&scaling=min-zoom&page-id=30100%3A565839&mode=design"
//     >
//       <Title>Usage</Title>
//       <Sandbox>
//         {`
//         import { Switch } from '@razorpay/blade/components';

//         function App(): React.ReactElement {
//           return (
//             // Check console
//             <Switch
//               onChange={(e) => console.log(e.isChecked)}
//               accessibilityLabel="Toggle DarkMode"
//             />
//           );
//         }

//         export default App;
//       `}
//       </Sandbox>
//     </StoryPageWrapper>
//   );
// };

export default {
  title: 'Components/StepGroup',
  component: StepGroup,
  // args: {
  //   defaultChecked: undefined,
  //   isChecked: undefined,
  //   isDisabled: undefined,
  //   name: undefined,
  //   onChange: undefined,
  //   value: undefined,
  //   size: 'medium',
  //   accessibilityLabel: 'Toggle DarkMode',
  // },
  // tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  // parameters: {
  //   docs: {
  //     page: Page,
  //   },
  // },
} as Meta<SwitchProps>;

// const SwitchTemplate: StoryFn<typeof SwitchComponent> = ({ ...args }) => {
//   return <SwitchComponent {...args} />;
// };

// export const Default = SwitchTemplate.bind({});
// Default.storyName = 'Default';

// export const StepLineStory = (): React.ReactElement => {
//   return (
//     <Box display="flex" flexDirection="column">
//       <StepLine orientation="vertical" />
//       <StepLine orientation="vertical" curveEnd="top" />
//       <Box
//         height="24px"
//         width="24px"
//         backgroundColor="surface.background.sea.intense"
//         borderRadius="round"
//         marginLeft="21px"
//         marginTop="-12px"
//       />
//       <StepLine marginLeft="33px" marginTop="2px" orientation="vertical" />
//       <StepLine orientation="vertical" curveEnd="bottom" />
//       <Box
//         height="24px"
//         width="24px"
//         backgroundColor="surface.background.sea.intense"
//         borderRadius="round"
//         marginLeft="-12px"
//       />
//       <StepLine orientation="vertical" />
//     </Box>
//   );
// };

export const StepItemStory = (): React.ReactElement => {
  return (
    <StepGroup>
      <StepItem />
      <StepItem />
      <StepGroup>
        <StepItem />
        <StepItem />
        <StepItem />
      </StepGroup>
      <StepItem />
      <StepGroup>
        <StepItem />
      </StepGroup>
      <StepItem />
    </StepGroup>
  );
};
