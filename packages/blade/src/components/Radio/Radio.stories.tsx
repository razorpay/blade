/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { Text } from '../Typography';
import type { RadioGroupProps } from './RadioGroup/RadioGroup';
import { RadioGroup as RadioGroupComponent } from './RadioGroup/RadioGroup';
import { Radio as RadioComponent } from './Radio';
import Sandbox from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Radio & RadioGroup can be used in forms when a user needs to single value from several options."
      componentName="Radio"
      imports={`import { Radio, RadioGroup } from '@razorpay/blade/components';\nimport type { RadioProps, RadioGroupProps } from '@razorpay/blade/components';`}
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
          import { RadioGroup, Radio } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <RadioGroup
                helpText="Select only one"
                label="Where do you want to collect payments?"
                name="payment-collection" 
                onChange={({name, value}) => console.log({name, value})}
                defaultValue="website"
              >
                <Radio value="website">Website</Radio>
                <Radio value="android">Android App</Radio>
                <Radio value="ios">iOS App</Radio>
                <Radio 
                  value="social-media" 
                  helpText="Like WhatsApp, Facebook, Instagram"
                >
                  Social Media
                </Radio>
                <Radio value="offline-store">Offline Store</Radio>
              </RadioGroup>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Radio & RadioGroup',
  component: RadioGroupComponent,
  args: {
    label: 'Radio example',
    helpText: undefined,
    isDisabled: false,
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
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<RadioGroupProps>;

const RadioTemplate: ComponentStory<typeof RadioGroupComponent> = ({ children, ...args }) => {
  return (
    <RadioGroupComponent {...args}>
      <RadioComponent value="apple">Apple</RadioComponent>
      <RadioComponent value="mango">Mango</RadioComponent>
      <RadioComponent value="orange">Orange</RadioComponent>
    </RadioGroupComponent>
  );
};

export const Default = RadioTemplate.bind({});
Default.storyName = 'Default';

export const HelpText = RadioTemplate.bind({});
HelpText.storyName = 'HelpText';
HelpText.args = {
  helpText: 'RadioGroup help text',
};

export const ErrorText = RadioTemplate.bind({});
ErrorText.storyName = 'ErrorText';
ErrorText.args = {
  validationState: 'error',
  errorText: 'RadioGroup help text',
};

export const Disabled = RadioTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

export const Optional = RadioTemplate.bind({});
Optional.storyName = 'Optional';
Optional.args = {
  necessityIndicator: 'optional',
};

export const Required = RadioTemplate.bind({});
Required.storyName = 'Required';
Required.args = {
  necessityIndicator: 'required',
};

export const Small = RadioTemplate.bind({});
Small.storyName = 'Small';
Small.args = {
  size: 'small',
};

export const LabelPositionLeft = RadioTemplate.bind({});
LabelPositionLeft.storyName = 'LabelPositionLeft';
LabelPositionLeft.args = {
  labelPosition: 'left',
};

export const KitchenSink = (): React.ReactElement => {
  const [selected, setSelected] = React.useState('orange');

  return (
    <>
      <RadioGroupComponent
        helpText="Select atleast one"
        label="Medium"
        defaultValue="orange"
        onChange={(e) => console.log(e)}
        size="medium"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        size="small"
        helpText="Select atleast one"
        label="Small"
        defaultValue="orange"
        onChange={(e) => console.log(e)}
      >
        <RadioComponent helpText="Apples are good" value="apple">
          Apple
        </RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        errorText="Selected atleast one item"
        helpText={`You selected ${selected}`}
        label="Controlled"
        value={selected}
        onChange={({ value, name }) => {
          setSelected(value);
          console.log(name, value);
        }}
      >
        <RadioComponent helpText="Apples Are 25% Air" value="apple">
          Apple
        </RadioComponent>
        <RadioComponent helpText="The name “mango” originated in India" value="mango">
          Mango
        </RadioComponent>
        <RadioComponent helpText="There are over 600 varieties of oranges." value="orange">
          Orange
        </RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        necessityIndicator="required"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        validationState="error"
        necessityIndicator="optional"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        labelPosition="left"
        necessityIndicator="optional"
        validationState="error"
        errorText="This is invalid"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
    </>
  );
};
