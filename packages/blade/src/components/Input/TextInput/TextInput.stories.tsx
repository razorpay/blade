/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { TextInputProps } from './TextInput';
import { TextInput as TextInputComponent } from './TextInput';
import iconMap from '~components/Icons/iconMap';
import Box from '~components/Box';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { Button } from '~components/Button';

const propsCategory = {
  BASE_PROPS: 'Text Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  LEADING_VISUAL_PROPS: 'Leading Visual Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Input/TextInput',
  component: TextInputComponent,
  args: {
    defaultValue: undefined,
    placeholder: 'Enter your first and last name',
    name: 'fullName',
    type: 'url',
    isDisabled: false,
    value: undefined,
    maxCharacters: undefined,
    textAlign: 'left',
    autoFocus: false,
    onChange: ({ name, value }): void => {
      console.log(`input field ${name} content changed to ${value}`);
    },
    onFocus: ({ name, value }): void => {
      console.log(`input field ${name} received focus. The value is ${value}`);
    },
    onBlur: ({ name, value }): void => {
      console.log(`input field ${name} content lost focus. The value is ${value}`);
    },
    label: 'Enter Name',
    labelPosition: 'top',
    necessityIndicator: undefined,
    isRequired: false,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    icon: undefined,
    prefix: '',
    showClearButton: true,
    suffix: '',
    keyboardReturnKeyType: undefined,
    autoCompleteSuggestionType: undefined,
  },
  argTypes: {
    defaultValue: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    placeholder: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    name: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    type: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    isDisabled: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    value: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    maxCharacters: {
      control: { type: 'number' },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    textAlign: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    autoFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onBlur: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    labelPosition: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    necessityIndicator: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    isRequired: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    validationState: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    helpText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    errorText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    successText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: propsCategory.LEADING_VISUAL_PROPS,
      },
    },
    prefix: {
      table: {
        category: propsCategory.LEADING_VISUAL_PROPS,
      },
    },
    showClearButton: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    suffix: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    keyboardReturnKeyType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    autoCompleteSuggestionType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The TextInput component is a component that can be used to input name, email, telephone, url, search or plain text."
          componentName="TextInput"
          figmaURL={{
            paymentTheme:
              'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A210737',
            bankingTheme:
              'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9941%3A155140',
          }}
        >
          <Title>Usage</Title>
          <Sandbox showConsole>
            {`
              import { TextInput } from '@razorpay/blade/components';

              function App(): JSX.Element {
                return (
                  <TextInput 
                    label="Name" 
                    placeholder="Enter Name" 
                    onChange={(e) => console.log(e)} 
                  />
                )
              }

              export default App;
            `}
          </Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<TextInputProps>;

const TextInputTemplate: ComponentStory<typeof TextInputComponent> = ({ icon, ...args }) => {
  return <TextInputComponent {...args} icon={iconMap[(icon as unknown) as string]} />;
};

export const TextInput = TextInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TextInput.storyName = 'TextInput';

export const TextInputHelpText = TextInputTemplate.bind({});
TextInputHelpText.storyName = 'TextInput with Help Text';
TextInputHelpText.args = {
  helpText: 'Please enter first and last name',
};

export const TextInputError = TextInputTemplate.bind({});
TextInputError.storyName = 'TextInput with error';
TextInputError.args = {
  validationState: 'error',
  errorText: 'Name is not valid',
};

export const TextInputSuccess = TextInputTemplate.bind({});
TextInputSuccess.storyName = 'TextInput with success';
TextInputSuccess.args = {
  defaultValue: 'John Ives',
  validationState: 'success',
  successText: 'Name validated',
};

const TextInputMaxCharactersTemplate: ComponentStory<typeof TextInputComponent> = () => {
  return (
    <TextInput
      label="First Name"
      defaultValue="John Ives"
      name="fullName"
      maxCharacters={10}
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const TextInputMaxCharacters = TextInputMaxCharactersTemplate.bind({});

const TextInputUncontrolledTemplate: ComponentStory<typeof TextInputComponent> = () => {
  return (
    <TextInput
      label="First Name"
      placeholder="Enter your first and last name"
      defaultValue="John Ives"
      name="fullName"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const TextInputUncontrolled = TextInputUncontrolledTemplate.bind({});

const TextInputControlledTemplate: ComponentStory<typeof TextInputComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <TextInput
      label="First Name"
      placeholder="Enter your first and last name"
      value={inputValue}
      name="fullName"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');
      }}
    />
  );
};
export const TextInputControlled = TextInputControlledTemplate.bind({});

const TextInputKitchenSinkTemplate: ComponentStory<typeof TextInputComponent> = () => {
  return (
    <>
      <Box display="flex" gap="spacing.5">
        <TextInput
          showClearButton
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
        />

        <TextInput
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          defaultValue="Anurag"
        />

        <TextInput
          validationState="error"
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          defaultValue="Anurag"
          errorText="Name is invalid"
        />

        <TextInput
          validationState="success"
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          defaultValue="Anurag"
          successText="Name is valid"
        />
      </Box>
      <Box display="flex" flexDirection="column" gap="spacing.5">
        <TextInput
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          maxCharacters={100}
        />

        <TextInput label="First Name" placeholder="Enter your first" name="fullName" />

        <TextInput
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          labelPosition="left"
        />

        <TextInput
          necessityIndicator="optional"
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          labelPosition="left"
          maxCharacters={100}
        />

        <TextInput
          necessityIndicator="required"
          label="First Name"
          placeholder="Enter your first"
          name="fullName"
          labelPosition="left"
          maxCharacters={100}
          validationState="none"
          helpText="Write your message"
        />
      </Box>
    </>
  );
};
export const TextInputKitchenSink = TextInputKitchenSinkTemplate.bind({});

export const inputRef: ComponentStory<typeof TextInputComponent> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRef = React.useRef<BladeElementRef>(null);

  return (
    <Box gap="spacing.3" display="flex" alignItems="end">
      <TextInputComponent ref={inputRef} label="First Name" name="fullName" />
      <Button
        onClick={() => {
          inputRef?.current?.focus();
          console.log(inputRef);
        }}
      >
        Click to focus the input
      </Button>
    </Box>
  );
};

inputRef.storyName = 'Text Input Ref';
inputRef.parameters = {
  docs: {
    description: {
      story:
        'TextInput component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};
