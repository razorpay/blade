/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { TextInputProps } from './TextInput';
import { TextInput as TextInputComponent } from './TextInput';
import iconMap from '~components/Icons/iconMap';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';

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
    size: 'medium',
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
    autoCapitalize: undefined,
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    testID: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    size: {
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
    onSubmit: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onClick: {
      control: {
        disable: true,
      },
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
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onBlur: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    accessibilityLabel: {
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
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.LEADING_VISUAL_PROPS,
      },
    },
    leadingIcon: {
      name: 'leadingIcon',
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
    suffix: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    trailingIcon: {
      name: 'trailingIcon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    trailingButton: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    showClearButton: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    onClearButtonClick: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    isLoading: {
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
    autoCapitalize: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The TextInput component is a component that can be used to input name, email, telephone, url, search or plain text."
          componentName="TextInput"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Input/TextInput/_decisions/_decisions.md"
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76077-57130&t=icthxu77bIRPBob9-1&scaling=min-zoom&page-id=10953%3A191554&mode=design"
        >
          <Title>Usage</Title>
          <Sandbox>
            {`
              import { TextInput } from '@razorpay/blade/components';

              function App() {
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

const TextInputTemplate: StoryFn<typeof TextInputComponent> = ({
  leadingIcon,
  trailingIcon,
  ...args
}) => {
  return (
    <TextInputComponent
      {...args}
      leadingIcon={iconMap[(leadingIcon as unknown) as string]}
      trailingIcon={iconMap[(trailingIcon as unknown) as string]}
    />
  );
};

export const TextInput = TextInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TextInput.storyName = 'TextInput';

export const TextInputTypeNumber = TextInputTemplate.bind({});
TextInputTypeNumber.storyName = 'TextInput with type number';
TextInputTypeNumber.args = {
  type: 'number',
  label: 'Enter Number',
  placeholder: 'Enter any random number',
};

TextInputTypeNumber.parameters = {
  docs: {
    description: {
      story: `You might notice that type number allows you to enter other characters as well. That's because instead of setting type number internally, we prefer inputMode numeric. Checkout this article for the reasoning - <b><a href="https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/">Why the GOV.UK Design System team changed the input type for numbers</a></b> \n\nIf you have a usecase of only allowing number in field, you can handle that on validations end.`,
    },
  },
};

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

export const TextInputWithoutLabel = TextInputTemplate.bind({});
TextInputWithoutLabel.storyName = 'TextInput without label';
TextInputWithoutLabel.args = {
  defaultValue: 'John Ives',
  label: undefined,
  accessibilityLabel: 'Enter your name',
};

export const TextInputWithTrailingButton = TextInputTemplate.bind({});
TextInputWithTrailingButton.storyName = 'TextInput with trailing action button';
TextInputWithTrailingButton.args = {
  defaultValue: 'John Ives',
  label: 'Discount Code',
  trailingButton: <Link>Apply</Link>,
  showClearButton: false,
};

const TextInputMaxCharactersTemplate: StoryFn<typeof TextInputComponent> = () => {
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

const TextInputSizesTemplate: StoryFn<typeof TextInputComponent> = ({
  leadingIcon,
  trailingIcon,
  ...args
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" marginBottom="spacing.2">
        Medium Size:
      </Text>
      <TextInputComponent
        {...args}
        leadingIcon={iconMap[(leadingIcon as unknown) as string]}
        trailingIcon={iconMap[(trailingIcon as unknown) as string]}
        size="medium"
      />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">
        Large Size:
      </Text>
      <TextInputComponent
        {...args}
        leadingIcon={iconMap[(leadingIcon as unknown) as string]}
        trailingIcon={iconMap[(trailingIcon as unknown) as string]}
        size="large"
      />
    </Box>
  );
};
export const TextInputSizes = TextInputSizesTemplate.bind({});

const TextInputUncontrolledTemplate: StoryFn<typeof TextInputComponent> = () => {
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

const TextInputControlledTemplate: StoryFn<typeof TextInputComponent> = () => {
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

const TextInputKitchenSinkTemplate: StoryFn<typeof TextInputComponent> = () => {
  return (
    <>
      <BaseBox display="flex" gap="spacing.5">
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
      </BaseBox>
      <BaseBox display="flex" flexDirection="column" gap="spacing.5">
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

        <TextInput
          necessityIndicator="required"
          label="Enter Your Residential Address"
          placeholder="Enter your address"
          name="fullName"
          labelPosition="left"
          maxCharacters={100}
          validationState="none"
          helpText="Write your message"
        />

        <TextInput
          accessibilityLabel="Enter Your Residential Address"
          necessityIndicator="required"
          placeholder="Enter your address"
          name="fullName"
          labelPosition="left"
          maxCharacters={100}
          validationState="none"
          helpText="Write your message"
        />
      </BaseBox>
    </>
  );
};
export const TextInputKitchenSink = TextInputKitchenSinkTemplate.bind({});

export const inputRef: StoryFn<typeof TextInputComponent> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="end">
      <TextInputComponent ref={inputRef} label="First Name" name="fullName" />
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

inputRef.storyName = 'Text Input Ref';
inputRef.parameters = {
  docs: {
    description: {
      story:
        'TextInput component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};

// Don't copy email regex from here. This is just an example regex for basic emails. Make sure to use email validation as per usecase
const isValidEmail = (email: string): boolean => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const TextInputWithControlledTags: StoryFn<typeof TextInputComponent> = ({ ...args }) => {
  const [tags, setTags] = React.useState<string[]>([]);

  return (
    <Box display="flex" flexDirection="column">
      <TextInputComponent
        {...args}
        tags={tags}
        onTagChange={({ tags }) => {
          setTags(tags);
        }}
      />
    </Box>
  );
};

TextInputWithControlledTags.args = {
  isTaggedInput: true,
  showClearButton: false,
};

export const TextInputWithTagsValidation: StoryFn<typeof TextInputComponent> = ({ ...args }) => {
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  // we use ref because onTagChange and onChange is called in same render
  // So if we want to set error in onTagChange, and use its value in onChange, its not possible with useState
  const isErrorRef = React.useRef(false);

  return (
    <Box display="flex" flexDirection="column">
      <TextInputComponent
        {...args}
        value={inputValue}
        onChange={({ value }) => {
          if (!isErrorRef.current) {
            setInputValue(value ?? '');
            setErrorText('');
          }

          isErrorRef.current = false;
        }}
        tags={tags}
        onTagChange={({ tags: newTags }) => {
          const isTagRemoved = newTags.length < tags.length;
          if (isTagRemoved) {
            // we don't validate while removing tags
            setTags(newTags);
            return;
          }

          if (isValidEmail(inputValue)) {
            setTags(newTags);
          } else {
            isErrorRef.current = true;
            setErrorText(`Invalid email ${inputValue}. Try with different email`);
          }
        }}
        errorText={errorText}
        validationState={errorText ? 'error' : undefined}
      />
    </Box>
  );
};

TextInputWithTagsValidation.args = {
  isTaggedInput: true,
  showClearButton: false,
};

export const TextInputWithUncontrolledTags: StoryFn<typeof TextInputComponent> = ({ ...args }) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextInputComponent
        {...args}
        onTagChange={(tags) => {
          console.log('new tags', tags);
        }}
      />
    </Box>
  );
};

TextInputWithUncontrolledTags.args = {
  isTaggedInput: true,
  showClearButton: true,
};
