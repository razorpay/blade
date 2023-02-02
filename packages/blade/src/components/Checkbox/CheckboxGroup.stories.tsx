/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { Text } from '../Typography';
import { Checkbox as CheckboxComponent, CheckboxGroup as CheckboxGroupComponent } from './';
import type { CheckboxGroupProps } from './';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import Box from '~components/Box';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="CheckboxGroup"
      componentDescription="CheckboxGroup can be used to group together multiple checkboxes in a forms which provides out of the box state management for the multi-checkboxes and other features."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11169%3A230590',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole editorHeight={400} editorWidthPercentage={60}>
        {`
          import { CheckboxGroup, Checkbox } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <CheckboxGroup 
                label="Where do you want to collect payments?"
                name="payment-collection" 
                onChange={({name, values}) => console.log({name, values})}
              >
                <Checkbox value="website">Website</Checkbox>
                <Checkbox value="android">Android App</Checkbox>
                <Checkbox value="ios">iOS App</Checkbox>
                <Checkbox 
                  value="social-media" 
                  helpText="Like WhatsApp, Facebook, Instagram"
                >
                  Social Media
                </Checkbox>
                <Checkbox value="offline-store">Offline Store</Checkbox>
              </CheckboxGroup>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Checkbox/CheckboxGroup',
  component: CheckboxGroupComponent,
  args: {
    label: 'Checkbox Group',
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
        type: 'multi-select',
      },
    },
    defaultValue: {
      options: ['apple', 'mango', 'orange'],
      control: {
        type: 'multi-select',
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CheckboxGroupProps>;

const CheckboxGroupTemplate: ComponentStory<typeof CheckboxGroupComponent> = ({
  children,
  ...args
}) => {
  return (
    <CheckboxGroupComponent {...args}>
      <CheckboxComponent value="apple">Apple</CheckboxComponent>
      <CheckboxComponent value="mango">Mango</CheckboxComponent>
      <CheckboxComponent value="orange">Orange</CheckboxComponent>
    </CheckboxGroupComponent>
  );
};

export const Default = CheckboxGroupTemplate.bind({});
Default.storyName = 'Default';

export const HelpText = CheckboxGroupTemplate.bind({});
HelpText.storyName = 'HelpText';
HelpText.args = {
  helpText: 'CheckboxGroup help text',
};

export const ErrorText = CheckboxGroupTemplate.bind({});
ErrorText.storyName = 'ErrorText';
ErrorText.args = {
  validationState: 'error',
  errorText: 'CheckboxGroup help text',
};

export const Disabled = CheckboxGroupTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

export const Optional = CheckboxGroupTemplate.bind({});
Optional.storyName = 'Optional';
Optional.args = {
  necessityIndicator: 'optional',
};

export const Required = CheckboxGroupTemplate.bind({});
Required.storyName = 'Required';
Required.args = {
  necessityIndicator: 'required',
};

export const Small = CheckboxGroupTemplate.bind({});
Small.storyName = 'Small';
Small.args = {
  size: 'small',
};

export const LabelPositionLeft = CheckboxGroupTemplate.bind({});
LabelPositionLeft.storyName = 'LabelPositionLeft';
LabelPositionLeft.args = {
  labelPosition: 'left',
};

const IndeterminateExample = () => {
  const fields = ['apple', 'mango', 'orange'];
  const [selected, setSelected] = React.useState(['apple', 'mango']);
  const allChecked = selected.length === 3;
  const isIndeterminate = selected.length > 0 && !allChecked;
  const noneSelected = selected.length < 1;
  return (
    <>
      <CheckboxComponent
        isChecked={allChecked}
        onChange={({ isChecked }) => {
          if (isChecked) {
            setSelected(fields);
            return;
          }
          setSelected([]);
        }}
        validationState={noneSelected ? 'error' : 'none'}
        isIndeterminate={isIndeterminate}
      >
        Select all
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        helpText="Select your favourite fruits"
        errorText="Select atleast one"
        label="Select fruits"
        value={selected}
        validationState={noneSelected ? 'error' : 'none'}
        onChange={({ values }) => setSelected(values)}
      >
        {fields.map((field) => {
          return (
            <CheckboxComponent key={field} value={field}>
              {field}
            </CheckboxComponent>
          );
        })}
      </CheckboxGroupComponent>
    </>
  );
};

const IndeterminateTemplate: ComponentStory<typeof CheckboxComponent> = () => {
  return <IndeterminateExample />;
};
export const Indeterminate = IndeterminateTemplate.bind({});

export const KitchenSink = (): React.ReactElement => {
  const [selected, setSelected] = React.useState(['mango', 'apple']);

  return (
    <>
      <CheckboxGroupComponent
        helpText="Select atleast one"
        label="Uncontrolled"
        defaultValue={['apple', 'orange']}
        onChange={(e) => console.log(e)}
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        helpText="Small sized checkboxes"
        label="Small checkboxes"
        size="small"
        defaultValue={['orange']}
        onChange={(e) => console.log(e)}
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        errorText="Selected atleast one item"
        helpText={`You selected ${selected.join(', ')}`}
        label="Controlled"
        value={selected}
        onChange={({ values }) => setSelected(values)}
      >
        <CheckboxComponent helpText="Apples Are 25% Air" value="apple">
          Apple
        </CheckboxComponent>
        <CheckboxComponent helpText="The name “mango” originated in India" value="mango">
          Mango
        </CheckboxComponent>
        <CheckboxComponent helpText="There are over 600 varieties of oranges." value="orange">
          Orange
        </CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        necessityIndicator="required"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        validationState="error"
        necessityIndicator="optional"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        labelPosition="left"
        necessityIndicator="optional"
        validationState="error"
        errorText="This is invalid"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Box height={50} overflow="scroll" marginTop="spacing.4">
        <CheckboxGroupComponent
          labelPosition="left"
          necessityIndicator="optional"
          validationState="error"
          errorText="This is invalid"
          helpText="Select atleast one"
          label="Overflow Scroll"
        >
          <CheckboxComponent value="apple">Apple</CheckboxComponent>
          <CheckboxComponent value="mango">Mango</CheckboxComponent>
          <CheckboxComponent value="orange">Orange</CheckboxComponent>
        </CheckboxGroupComponent>
      </Box>
    </>
  );
};
