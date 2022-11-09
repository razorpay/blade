/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ArgsTable, Primary, PRIMARY_STORY, Stories, Subtitle, Title } from '@storybook/addon-docs';
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
import type { CheckboxProps } from './';
import { Checkbox as CheckboxComponent } from './';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import FigmaEmbed from '~src/_helpers/storybook/FigmaEmbed';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): React.ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11169%3A230354',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11169%3A230354',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Checkbox can be used in forms when a user needs to select multiple values from several
        options.
      </Subtitle>
      <FigmaEmbed title="Checkbox Figma Designs" src={figmaURL} />
      <br />
      <br />
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Checkbox } from '@razorpay/blade/components'
        
        function App(): JSX.Element {
          return (
            // Check console
            <Checkbox onChange={(e) => console.log(e.isChecked)}>
              Toggle Checkbox
            </Checkbox>
          )
        }

        export default App;
      `}
      </Sandbox>
      <Title>Example</Title>
      <Subtitle>
        This is the default checkbox. You can change the properties of this button using the
        controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Checkbox/Checkbox',
  component: CheckboxComponent,
  args: {
    defaultChecked: undefined,
    validationState: undefined,
    isChecked: undefined,
    isDisabled: undefined,
    isIndeterminate: undefined,
    isRequired: undefined,
    name: undefined,
    onChange: undefined,
    value: undefined,
    helpText: undefined,
    errorText: undefined,
    labelPosition: 'top',
    children: 'Toggle checkbox',
    size: 'medium',
  },
  argTypes: {},
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CheckboxProps>;

const CheckboxTemplate: ComponentStory<typeof CheckboxComponent> = ({ children, ...args }) => {
  return <CheckboxComponent {...args}>{children}</CheckboxComponent>;
};

export const Default = CheckboxTemplate.bind({});
Default.storyName = 'Default';

export const Checked = CheckboxTemplate.bind({});
Checked.storyName = 'Checked';
Checked.args = {
  isChecked: true,
};

export const DefaultChecked = CheckboxTemplate.bind({});
DefaultChecked.storyName = 'DefaultChecked';
DefaultChecked.args = {
  defaultChecked: true,
};

export const HelpText = CheckboxTemplate.bind({});
HelpText.storyName = 'HelpText';
HelpText.args = {
  helpText: 'Checkbox help text',
};

export const ErrorText = CheckboxTemplate.bind({});
ErrorText.storyName = 'ErrorText';
ErrorText.args = {
  validationState: 'error',
  errorText: 'Checkbox error text',
};

export const Small = CheckboxTemplate.bind({});
Small.storyName = 'Small';
Small.args = {
  size: 'small',
};

export const Indeterminate = CheckboxTemplate.bind({});
Indeterminate.storyName = 'Indeterminate';
Indeterminate.args = {
  isIndeterminate: true,
};

const ControlledAndUncontrolledComp = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <CheckboxComponent defaultChecked onChange={(e) => console.log(e)}>
        Uncontrolled
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent isChecked={checked} onChange={(e) => setChecked(e.isChecked)}>
        Controlled
      </CheckboxComponent>
      <Text>Checked: {checked ? 'True' : 'False'}</Text>
    </>
  );
};
const _ControlledAndUncontrolled: ComponentStory<typeof CheckboxComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});
