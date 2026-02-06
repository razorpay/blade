/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { CheckboxProps } from './';
import { Checkbox as CheckboxComponent } from './';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Checkbox"
      componentDescription="Checkbox can be used in forms when a user needs to select multiple values from several options."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75857-44078&t=ASvqFmFRXILEzPFG-1&scaling=min-zoom&page-id=13227%3A162974&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Checkbox } from '@razorpay/blade/components'
        
        function App() {
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
    </StoryPageWrapper>
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
    children: 'Toggle checkbox',
    size: 'medium',
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CheckboxProps>;

const CheckboxTemplate: StoryFn<typeof CheckboxComponent> = ({ children, ...args }) => {
  return <CheckboxComponent {...args}>{children}</CheckboxComponent>;
};

const checkboxShowcaseColumns: Array<{
  id: string;
  label: string;
  checkboxProps: Partial<CheckboxProps>;
}> = [
  { id: 'unchecked', label: 'Unchecked', checkboxProps: {} },
  { id: 'checked', label: 'Checked', checkboxProps: { isChecked: true } },
  { id: 'indeterminate', label: 'Indeterminate', checkboxProps: { isIndeterminate: true } },
];

const checkboxShowcaseRows: Array<{
  id: string;
  label: string;
  rowProps: Partial<CheckboxProps>;
}> = [
  { id: 'default', label: 'Default', rowProps: {} },
  { id: 'disabled', label: 'Disabled', rowProps: { isDisabled: true } },
  {
    id: 'error',
    label: 'Error',
    rowProps: { validationState: 'error', errorText: 'Error text' },
  },
];

const checkboxShowcaseSizes: Array<{ id: string; label: string; size: CheckboxProps['size'] }> = [
  { id: 'small', label: 'Size Small', size: 'small' },
  { id: 'medium', label: 'Size Medium', size: 'medium' },
  { id: 'large', label: 'Size Large', size: 'large' },
];

const CheckboxShowcase = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7">
      {checkboxShowcaseSizes.map(({ id, label, size }) => (
        <Box key={id} display="flex" flexDirection="column" gap="spacing.4">
          <Text weight="semibold">{label}</Text>
          <Box
            display="grid"
            gridTemplateColumns="140px repeat(3, minmax(160px, 1fr))"
            rowGap="spacing.4"
            columnGap="spacing.4"
            alignItems="center"
            justifyItems="center"
          >
            <Box />
            {checkboxShowcaseColumns.map((column) => (
              <Text key={column.id} size="small" textAlign="center" weight="medium">
                {column.label}
              </Text>
            ))}
            {checkboxShowcaseRows.map((row) => (
              <React.Fragment key={row.id}>
                <Box display="flex" justifyContent="flex-end" width="100%">
                  <Text size="small" weight="medium">
                    {row.label}
                  </Text>
                </Box>
                {checkboxShowcaseColumns.map((column) => (
                  <Box
                    key={`${row.id}-${column.id}`}
                    padding="spacing.3"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckboxComponent size={size} {...row.rowProps} {...column.checkboxProps}>
                      Option
                    </CheckboxComponent>
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
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

export const Large = CheckboxTemplate.bind({});
Large.storyName = 'Large';
Large.args = {
  size: 'large',
  helpText: 'Checkbox help text',
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
const _ControlledAndUncontrolled: StoryFn<typeof CheckboxComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});

export const checkboxRef: StoryFn<typeof CheckboxComponent> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="center">
      <CheckboxComponent ref={checkboxRef}>Checkbox</CheckboxComponent>
      <Button onClick={() => checkboxRef?.current?.focus()}>Click to focus the checkbox</Button>
    </BaseBox>
  );
};

checkboxRef.storyName = 'Checkbox Ref';
checkboxRef.parameters = {
  docs: {
    description: {
      story:
        'Checkbox component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};

export const Showcase: StoryFn<typeof CheckboxComponent> = () => {
  return <CheckboxShowcase />;
};
