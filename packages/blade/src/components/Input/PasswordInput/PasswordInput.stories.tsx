import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import type { PasswordInputProps } from './PasswordInput';
import { PasswordInput } from './PasswordInput';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="PasswordInput"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Input/PasswordInput/_decisions/decisions.md"
      componentDescription="PasswordInput is an input field for entering passwords. The input is masked by default. On mobile devices the last typed letter is shown for a brief moment. The masking can be toggled using an optional reveal button."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76077-85891&t=09RYuDrnHwIebYMZ-1&scaling=min-zoom&page-id=10953%3A110156&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { PasswordInput } from '@razorpay/blade/components';

          function App() {
            return (
              <PasswordInput 
                label="Enter Password" 
                onChange={(e) => console.log(e)} 
              />
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  BASE_PROPS: 'Password Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
};

const meta: Meta<PasswordInputProps> = {
  title: 'Components/Input/PasswordInput',
  component: PasswordInput,
  args: {
    name: 'password',
    label: 'Enter password',
    helpText: 'We recommend having at least 8 characters in your password',
    placeholder: 'Enter a strong password',
  },
  tags: ['autodocs'],
  argTypes: {
    accessibilityLabel: { table: { category: propsCategory.BASE_PROPS } },
    testID: { table: { category: propsCategory.BASE_PROPS } },
    autoFocus: { table: { category: propsCategory.BASE_PROPS } },
    label: { table: { category: propsCategory.LABEL_PROPS } },
    labelPosition: { table: { category: propsCategory.LABEL_PROPS } },
    name: { table: { category: propsCategory.BASE_PROPS } },
    placeholder: { table: { category: propsCategory.BASE_PROPS } },
    size: { table: { category: propsCategory.BASE_PROPS } },
    maxCharacters: { table: { category: propsCategory.BASE_PROPS } },
    isDisabled: { table: { category: propsCategory.BASE_PROPS } },
    isRequired: { table: { category: propsCategory.BASE_PROPS } },
    necessityIndicator: { table: { category: propsCategory.BASE_PROPS } },
    defaultValue: { table: { category: propsCategory.BASE_PROPS } },
    showRevealButton: { table: { category: propsCategory.BASE_PROPS } },
    validationState: { table: { category: propsCategory.VALIDATION_PROPS } },
    helpText: { table: { category: propsCategory.VALIDATION_PROPS } },
    successText: { table: { category: propsCategory.VALIDATION_PROPS } },
    errorText: { table: { category: propsCategory.VALIDATION_PROPS } },
    value: { table: { category: propsCategory.BASE_PROPS } },
    keyboardReturnKeyType: { table: { category: propsCategory.BASE_PROPS } },
    autoCompleteSuggestionType: { table: { category: propsCategory.BASE_PROPS } },
    onChange: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    onSubmit: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    onFocus: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    onBlur: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const PasswordInputTemplate: StoryFn<typeof PasswordInput> = ({ ...args }) => {
  return <PasswordInput {...args} />;
};

export const Default = PasswordInputTemplate.bind({});

export const AutoComplete = PasswordInputTemplate.bind({});
AutoComplete.args = {
  autoCompleteSuggestionType: 'newPassword',
};
AutoComplete.parameters = {
  docs: {
    description: {
      story:
        '`autoCompleteSuggestionType` can be used to tell the platform if the input field is being used for inputting new password or current password. This provides hints to browser autofill and password managers. **Note:** there is a [known issue](https://github.com/facebook/react-native/issues/21911) for iOS.',
    },
  },
};

export const MaxCharacters = PasswordInputTemplate.bind({});
MaxCharacters.args = {
  maxCharacters: 16,
};
MaxCharacters.parameters = {
  docs: {
    description: {
      story:
        '`maxCharacters` can be used to restrict the maximum permissible characters and show a character counter',
    },
  },
};

export const ErrorState = PasswordInputTemplate.bind({});
ErrorState.args = {
  validationState: 'error',
  errorText: 'Error',
};
ErrorState.parameters = {
  docs: {
    description: {
      story:
        '`validationState` can be used to set an `error` state and an approriate hint can be passed with `errorText`',
    },
  },
};

export const SuccessState = PasswordInputTemplate.bind({});
SuccessState.args = {
  validationState: 'success',
  successText: 'Success',
};
SuccessState.parameters = {
  docs: {
    description: {
      story:
        '`validationState` can be used to set a `success` state and an approriate hint can be passed with `successText`',
    },
  },
};

export const LabelAtLeft = PasswordInputTemplate.bind({});
LabelAtLeft.args = {
  labelPosition: 'left',
};
LabelAtLeft.parameters = {
  docs: {
    description: {
      story: '`labelPosition` can be used to adjust the positioning of input label',
    },
  },
};

export const PasswordInputWithoutLabel = PasswordInputTemplate.bind({});
PasswordInputWithoutLabel.args = {
  label: undefined,
  accessibilityLabel: 'Password',
};

export const Disabled = PasswordInputTemplate.bind({});
Disabled.args = {
  isDisabled: true,
  defaultValue: 'My_Strong#Password!',
};
Disabled.parameters = {
  docs: {
    description: {
      story:
        '`isDisabled` can be used to make the password input field read only (disabled for user input), `defaultValue` can be used to pass an initial value',
    },
  },
};

export const Required = PasswordInputTemplate.bind({});
Required.args = {
  isRequired: true,
  necessityIndicator: 'required',
};
Required.parameters = {
  docs: {
    description: {
      story:
        '`isRequired` can be used to make the password input field required for form submission, `necessityIndicator` can be used to show a visual cue by passing `required` as value',
    },
  },
};

const PasswordInputSizesTemplate: StoryFn<typeof PasswordInput> = ({ ...args }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" marginBottom="spacing.2">
        Medium Size:
      </Text>
      <PasswordInput {...args} size="medium" />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">
        Large Size:
      </Text>
      <PasswordInput {...args} size="large" />
    </Box>
  );
};
export const PasswordInputSizes = PasswordInputSizesTemplate.bind({});

export const ControlledInput = (): ReactElement => {
  const [state, setState] = useState<string | undefined>('');
  return (
    <PasswordInput
      label="Controlled PasswordInput"
      helpText="See the console for output"
      value={state}
      onChange={({ value }) => {
        console.log('Controlled Input Value:', value);
        setState(value);
      }}
    />
  );
};
ControlledInput.parameters = {
  docs: {
    description: {
      story: '`value` and `onChange` can be used to make the input field controlled',
    },
  },
};

export const inputRef: StoryFn<typeof PasswordInput> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="end">
      <PasswordInput ref={inputRef} label="Message" />
      <Button
        onClick={() => {
          inputRef?.current?.focus();
          console.log(inputRef);
        }}
      >
        Click to focus the input
      </Button>
    </BaseBox>
  );
};

inputRef.storyName = 'Password Input Ref';
inputRef.parameters = {
  docs: {
    description: {
      story:
        'PasswordInput component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};

export default meta;
