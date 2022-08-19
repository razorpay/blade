/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { ArgsTable, Primary, PRIMARY_STORY, Stories, Subtitle, Title } from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
import { Text } from '../Typography';
import type { RadioGroupProps } from './RadioGroup/RadioGroup';
import { RadioGroup as RadioGroupComponent } from './RadioGroup/RadioGroup';
import { Radio as RadioComponent } from './Radio';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

const Page = (): React.ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13133%3A160709',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13133%3A160709',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Radio & RadioGroup can be used in forms when a user needs to single value from several
        options.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Radio, RadioGroup } from '@razorpay/blade/components' \nimport type { RadioProps, RadioGroupProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Subtitle>
        This is the default radio. You can change the properties of this button using the controls
        in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
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
        label="Uncontrolled"
        defaultValue="orange"
        onChange={(e) => console.log(e)}
      >
        <RadioComponent value="apple">Apple</RadioComponent>
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
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
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
