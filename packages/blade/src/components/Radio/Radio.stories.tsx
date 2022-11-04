/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { ArgsTable, Primary, PRIMARY_STORY, Stories, Subtitle, Title } from '@storybook/addon-docs';
import { Text } from '../Typography';
import type { RadioGroupProps } from './RadioGroup/RadioGroup';
import { RadioGroup as RadioGroupComponent } from './RadioGroup/RadioGroup';
import { Radio as RadioComponent } from './Radio';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import Sandbox from '~src/_helpers/storybook/Sandbox';
import FigmaEmbed from '~src/_helpers/storybook/FigmaEmbed';

const Page = (): React.ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13133%3A160709',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13133%3A160709',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11314%3A278927',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11314%3A278927',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Radio & RadioGroup can be used in forms when a user needs to single value from several
        options.
      </Subtitle>
      <FigmaEmbed src={figmaURL} title="Radio Figma Designs" />
      <br />
      <br />
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
          import { RadioGroup, Radio } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <RadioGroup
                helpText="Select atleast one"
                label="Fruits"
                name="fruits"
                defaultValue="orange"
                onChange={(e) => console.log(e)}
              >
                <Radio value="apple">Apple</Radio>
                <Radio value="mango">Mango</Radio>
                <Radio value="orange">Orange</Radio>
              </RadioGroup>
            )
          }

          export default App;
        `}
      </Sandbox>
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
