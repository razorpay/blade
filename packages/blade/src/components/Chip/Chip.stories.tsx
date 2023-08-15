/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { Text } from '../Typography';
import type { ChipGroupProps } from './ChipGroup/ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup/ChipGroup';
import { Chip as ChipComponent } from './Chip';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import type { BladeElementRef } from '~utils/useBladeInnerRef';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chip & ChipGroup can be used in forms when a user needs to single value from several options."
      componentName="Chip"
      imports={`import { Chip, ChipGroup } from '@razorpay/blade/components';\nimport type { ChipProps, ChipGroupProps } from '@razorpay/blade/components';`}
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13133%3A160709',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11314%3A278927',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole editorHeight={400} editorWidthPercentage={60}>
        {`
          import { ChipGroup, Chip } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              <ChipGroup
                name="payment-collection" 
                onChange={({name, value}) => console.log({name, value})}
                defaultValue="website"
              >
                <Chip value="website">Website</Chip>
                <Chip value="android">Android App</Chip>
                <Chip value="ios">iOS App</Chip>
                <Chip 
                  value="social-media" 
                >
                  Social Media
                </Chip>
                <Chip value="offline-store">Offline Store</Chip>
              </ChipGroup>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Chip & ChipGroup',
  component: ChipGroupComponent,
  args: {
    label: 'Chip example',
    helpText: undefined,
    isDisabled: false,
    isRequired: false,
    necessityIndicator: 'none',
    labelPosition: undefined,
    validationState: undefined,
    errorText: undefined,
    name: undefined,
    defaultValue: undefined,
    onChange: undefined,
    value: undefined,
    size: 'medium',
  },
  argTypes: {
    value: {
      options: ['apple', 'mango', 'orange'],
      control: {
        type: 'select',
      },
    },
    defaultValue: {
      options: ['apple', 'mango', 'orange'],
      control: {
        type: 'select',
      },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChipGroupProps>;

const ChipTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  return (
    <ChipGroupComponent {...args}>
      <ChipComponent value="apple">Apple</ChipComponent>
      <ChipComponent value="mango">Mango</ChipComponent>
      <ChipComponent variant="negative" value="orange">
        Orange
      </ChipComponent>
    </ChipGroupComponent>
  );
};

export const Default = ChipTemplate.bind({});
Default.storyName = 'Default';

// export const Disabled = ChipTemplate.bind({});
// Disabled.storyName = 'Disabled';
// Disabled.args = {
//   isDisabled: true,
// };

export const SingleSelection = ChipTemplate.bind({});
SingleSelection.storyName = 'Single Selection';
SingleSelection.args = {
  size: 'small',
};

export const MultiSelection = ChipTemplate.bind({});
MultiSelection.storyName = 'Multi Selection';
MultiSelection.args = {
  size: 'small',
  selectionType: 'multiple',
  variant: 'negative',
};

// export const KitchenSink = (): React.ReactElement => {
//   const [selected, setSelected] = React.useState('orange');

//   return (
//     <>
//       <ChipGroupComponent
//         helpText="Select atleast one"
//         label="Medium"
//         defaultValue="orange"
//         onChange={(e) => console.log(e)}
//         size="medium"
//       >
//         <ChipComponent value="apple">Apple</ChipComponent>
//         <ChipComponent value="mango">Mango</ChipComponent>
//         <ChipComponent value="orange">Orange</ChipComponent>
//       </ChipGroupComponent>
//       <Text>&nbsp;</Text>
//       <ChipGroupComponent
//         size="small"
//         helpText="Select atleast one"
//         label="Small"
//         defaultValue="orange"
//         onChange={(e) => console.log(e)}
//       >
//         <ChipComponent helpText="Apples are good" value="apple">
//           Apple
//         </ChipComponent>
//         <ChipComponent value="mango">Mango</ChipComponent>
//         <ChipComponent value="orange">Orange</ChipComponent>
//       </ChipGroupComponent>
//       <Text>&nbsp;</Text>
//       <ChipGroupComponent
//         errorText="Selected atleast one item"
//         helpText={`You selected ${selected}`}
//         label="Controlled"
//         value={selected}
//         onChange={({ value, name }) => {
//           setSelected(value);
//           console.log(name, value);
//         }}
//       >
//         <ChipComponent helpText="Apples Are 25% Air" value="apple">
//           Apple
//         </ChipComponent>
//         <ChipComponent helpText="The name “mango” originated in India" value="mango">
//           Mango
//         </ChipComponent>
//         <ChipComponent helpText="There are over 600 varieties of oranges." value="orange">
//           Orange
//         </ChipComponent>
//       </ChipGroupComponent>
//       <Text>&nbsp;</Text>
//       <ChipGroupComponent
//         necessityIndicator="required"
//         errorText="Atleast one has to be selected"
//         helpText="Select atleast one"
//         label="Select your fruit"
//       >
//         <ChipComponent value="apple">Apple</ChipComponent>
//         <ChipComponent value="mango">Mango</ChipComponent>
//         <ChipComponent value="orange">Orange</ChipComponent>
//       </ChipGroupComponent>
//       <Text>&nbsp;</Text>
//       <ChipGroupComponent
//         validationState="error"
//         necessityIndicator="optional"
//         errorText="Atleast one has to be selected"
//         helpText="Select atleast one"
//         label="Select your fruit"
//       >
//         <ChipComponent value="apple">Apple</ChipComponent>
//         <ChipComponent value="mango">Mango</ChipComponent>
//         <ChipComponent value="orange">Orange</ChipComponent>
//       </ChipGroupComponent>
//       <Text>&nbsp;</Text>
//       <ChipGroupComponent
//         labelPosition="left"
//         necessityIndicator="optional"
//         validationState="error"
//         errorText="This is invalid"
//         helpText="Select atleast one"
//         label="Select your fruit"
//       >
//         <ChipComponent value="apple">Apple</ChipComponent>
//         <ChipComponent value="mango">Mango</ChipComponent>
//         <ChipComponent value="orange">Orange</ChipComponent>
//       </ChipGroupComponent>
//       <BaseBox height="50px" overflow="scroll" marginTop="spacing.4">
//         <ChipGroupComponent
//           labelPosition="left"
//           necessityIndicator="optional"
//           validationState="error"
//           errorText="This is invalid"
//           helpText="Select atleast one"
//           label="Overflow Scroll"
//         >
//           <ChipComponent value="apple">Apple</ChipComponent>
//           <ChipComponent value="mango">Mango</ChipComponent>
//           <ChipComponent value="orange">Orange</ChipComponent>
//         </ChipGroupComponent>
//       </BaseBox>
//     </>
//   );
// };

// export const radioRef: ComponentStory<typeof ChipComponent> = () => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const radioRef = React.useRef<BladeElementRef>(null);

//   return (
//     <BaseBox gap="spacing.3" display="flex" alignItems="center">
//       <ChipGroupComponent label="Chip ref example">
//         <ChipComponent ref={radioRef} value="1">
//           Chip
//         </ChipComponent>
//       </ChipGroupComponent>
//       <Button onClick={() => radioRef?.current?.focus()}>Click to focus the Chip</Button>
//     </BaseBox>
//   );
// };

// radioRef.storyName = 'Chip Ref';
// radioRef.parameters = {
//   docs: {
//     description: {
//       story:
//         'Chip component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
//     },
//   },
// };
