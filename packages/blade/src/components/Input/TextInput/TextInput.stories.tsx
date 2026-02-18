/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import { PhoneNumberInput } from '../PhoneNumberInput';
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
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { InputDropdownButton } from '~components/Dropdown/InputDropdownButton';
import { ActionList, ActionListItem } from '~components/ActionList';
import { BankIcon, GlobeIcon, InfoIcon } from '~components/Icons';
import { Badge } from '~components/Badge';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

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
    labelSuffix: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    labelTrailing: {
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

export const TextInputWithTrailingAndLeadingDropdown: StoryFn<typeof TextInputComponent> = () => {
  const sizes = ['xsmall', 'small', 'medium', 'large'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {sizes.map((size) => (
        <TextInputComponent
          key={size}
          label="Enter Website URL (for verification)"
          size={size}
          leading={
            <Dropdown>
              <InputDropdownButton defaultValue="www" icon={GlobeIcon} />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="www." value="www" />
                  <ActionListItem title="blog." value="blog" />
                  <ActionListItem title="shop." value="shop" />
                  <ActionListItem title="ecommerce." value="ecommerce" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          }
          trailing={
            <Dropdown>
              <InputDropdownButton defaultValue="in" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title=".in" value="in" />
                  <ActionListItem title=".com" value="com" />
                  <ActionListItem title=".biz" value="biz" />
                  <ActionListItem title=".business" value="business" />
                  {/* maybe one day */}
                  <ActionListItem title=".razorpay" value="razorpay" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          }
        />
      ))}
    </Box>
  );
};

export const TextInputWithTrailingDropdown: StoryFn<typeof TextInputComponent> = () => {
  return (
    <Box display="flex" flexDirection="column">
      <TextInputComponent
        label="Enter your upi id"
        placeholder="98000xxxxx"
        trailing={
          <Dropdown>
            <InputDropdownButton defaultValue="sbi" icon={BankIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="@oksbi" value="sbi" />
                <ActionListItem title="@hdfc" value="hdfc" />
                <ActionListItem title="@razorpay-airtelbank" value="razorpay" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
      />
    </Box>
  );
};

export const TextInputWithLeadingDropdown: StoryFn<typeof TextInputComponent> = () => {
  return (
    <Box display="flex" flexDirection="column">
      <TextInputComponent
        label="Select Currency"
        placeholder="Select Currency"
        leading={
          <Dropdown>
            <InputDropdownButton defaultValue="inr" icon={BankIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="INR" value="inr" />
                <ActionListItem title="USD" value="usd" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
      />
    </Box>
  );
};

export const TextInputWithLeadingIcon: StoryFn<typeof TextInputComponent> = () => {
  return (
    <TextInputComponent label="Enter your upi id" placeholder="98000xxxxx" leading={BankIcon} />
  );
};

export const TextInputWithTrailingIcon: StoryFn<typeof TextInputComponent> = () => {
  return (
    <TextInputComponent label="Enter your upi id" placeholder="98000xxxxx" trailing={BankIcon} />
  );
};

export const TextInputWithLeadingElement: StoryFn<typeof TextInputComponent> = () => {
  return (
    <TextInputComponent
      label="Enter your upi id"
      placeholder="98000xxxxx"
      leading={<Badge>+91</Badge>}
    />
  );
};

export const TextInputWithTrailingElement: StoryFn<typeof TextInputComponent> = () => {
  return (
    <TextInputComponent
      label="Enter your upi id"
      placeholder="98000xxxxx"
      trailing={<Badge>@oksbi</Badge>}
    />
  );
};

export const TextInputWithLabelSuffixTrailing = TextInputTemplate.bind({});
TextInputWithLabelSuffixTrailing.storyName = 'TextInput with Label Suffix & Trailing';
TextInputWithLabelSuffixTrailing.args = {
  label: 'Enter GSTIN',
  placeholder: 'Enter GSTIN',
  labelSuffix: (
    <Tooltip content="Your GSTIN is used to generate invoices and receipts" placement="right">
      <TooltipInteractiveWrapper display="flex">
        <InfoIcon size="small" color="surface.icon.gray.muted" />
      </TooltipInteractiveWrapper>
    </Tooltip>
  ),
  labelTrailing: <Link size="small">Learn more</Link>,
};

export const TextInputShowcase: StoryFn<typeof TextInputComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Basic Variants */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Basic Variants
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent label="Default" placeholder="Enter text" name="default" />
          <TextInputComponent label="With Value" defaultValue="John Doe" name="withValue" />
          <TextInputComponent
            label="With Help Text"
            placeholder="Enter text"
            helpText="This is a helpful message"
            name="withHelpText"
          />
          <TextInputComponent
            label="Disabled"
            placeholder="Enter text"
            isDisabled
            name="disabled"
          />
        </Box>
      </Box>

      {/* Validation States */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Validation States
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Error State"
            defaultValue="Invalid Input"
            validationState="error"
            errorText="This field has an error"
            name="error"
          />
          <TextInputComponent
            label="Success State"
            defaultValue="Valid Input"
            validationState="success"
            successText="This field is valid"
            name="success"
          />
        </Box>
      </Box>

      {/* Sizes */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Sizes
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Medium Size"
            placeholder="Medium size input"
            size="medium"
            name="sizeMedium"
          />
          <TextInputComponent
            label="Large Size"
            placeholder="Large size input"
            size="large"
            name="sizeLarge"
          />
        </Box>
      </Box>

      {/* Label Positions */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Label Positions
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Label Top"
            placeholder="Label on top"
            labelPosition="top"
            name="labelTop"
          />
          <TextInputComponent
            label="Label Left"
            placeholder="Label on left"
            labelPosition="left"
            name="labelLeft"
          />
        </Box>
      </Box>

      {/* Necessity Indicators */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Necessity Indicators
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Required Field"
            placeholder="Enter text"
            necessityIndicator="required"
            name="required"
          />
          <TextInputComponent
            label="Optional Field"
            placeholder="Enter text"
            necessityIndicator="optional"
            name="optional"
          />
        </Box>
      </Box>

      {/* With Icons */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Icons
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Leading Icon"
            placeholder="Enter text"
            leading={BankIcon}
            name="leadingIcon"
          />
          <TextInputComponent
            label="Trailing Icon"
            placeholder="Enter text"
            trailing={InfoIcon}
            name="trailingIcon"
          />
          <TextInputComponent
            label="Both Icons"
            placeholder="Enter text"
            leading={BankIcon}
            trailing={InfoIcon}
            name="bothIcons"
          />
        </Box>
      </Box>

      {/* With Prefix/Suffix */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Prefix/Suffix
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="With Prefix"
            placeholder="Enter amount"
            prefix="₹"
            name="withPrefix"
          />
          <TextInputComponent
            label="With Suffix"
            placeholder="Enter weight"
            suffix="kg"
            name="withSuffix"
          />
        </Box>
      </Box>

      {/* With Dropdowns */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Leading & Trailing Dropdowns
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box>
            <Text weight="semibold" marginBottom="spacing.3">
              XSmall Size
            </Text>
            <TextInputComponent
              label="Website URL"
              placeholder="example"
              size="xsmall"
              leading={
                <Dropdown>
                  <InputDropdownButton defaultValue="www" icon={GlobeIcon} />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title="www." value="www" />
                      <ActionListItem title="blog." value="blog" />
                      <ActionListItem title="shop." value="shop" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              trailing={
                <Dropdown>
                  <InputDropdownButton defaultValue="com" />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title=".com" value="com" />
                      <ActionListItem title=".in" value="in" />
                      <ActionListItem title=".biz" value="biz" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              name="bothDropdownsXSmall"
            />
          </Box>

          <Box>
            <Text weight="semibold" marginBottom="spacing.3">
              Small Size
            </Text>
            <TextInputComponent
              label="Website URL"
              placeholder="example"
              size="small"
              leading={
                <Dropdown>
                  <InputDropdownButton defaultValue="www" icon={GlobeIcon} />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title="www." value="www" />
                      <ActionListItem title="blog." value="blog" />
                      <ActionListItem title="shop." value="shop" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              trailing={
                <Dropdown>
                  <InputDropdownButton defaultValue="com" />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title=".com" value="com" />
                      <ActionListItem title=".in" value="in" />
                      <ActionListItem title=".biz" value="biz" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              name="bothDropdownsSmall"
            />
          </Box>

          <Box>
            <Text weight="semibold" marginBottom="spacing.3">
              Medium Size
            </Text>
            <TextInputComponent
              label="Website URL"
              placeholder="example"
              size="medium"
              leading={
                <Dropdown>
                  <InputDropdownButton defaultValue="www" icon={GlobeIcon} />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title="www." value="www" />
                      <ActionListItem title="blog." value="blog" />
                      <ActionListItem title="shop." value="shop" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              trailing={
                <Dropdown>
                  <InputDropdownButton defaultValue="com" />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title=".com" value="com" />
                      <ActionListItem title=".in" value="in" />
                      <ActionListItem title=".biz" value="biz" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              name="bothDropdownsMedium"
            />
          </Box>

          <Box>
            <Text weight="semibold" marginBottom="spacing.3">
              Large Size
            </Text>
            <TextInputComponent
              label="Website URL"
              placeholder="example"
              size="large"
              leading={
                <Dropdown>
                  <InputDropdownButton defaultValue="www" icon={GlobeIcon} />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title="www." value="www" />
                      <ActionListItem title="blog." value="blog" />
                      <ActionListItem title="shop." value="shop" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              trailing={
                <Dropdown>
                  <InputDropdownButton defaultValue="com" />
                  <DropdownOverlay>
                    <ActionList>
                      <ActionListItem title=".com" value="com" />
                      <ActionListItem title=".in" value="in" />
                      <ActionListItem title=".biz" value="biz" />
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              }
              name="bothDropdownsLarge"
            />
          </Box>
        </Box>
      </Box>

      {/* With Elements */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Elements
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Leading Badge"
            placeholder="Enter phone"
            leading={<Badge>+91</Badge>}
            name="leadingBadge"
          />
          <TextInputComponent
            label="Trailing Badge"
            placeholder="Enter UPI"
            trailing={<Badge>@oksbi</Badge>}
            name="trailingBadge"
          />
        </Box>
      </Box>

      {/* With Trailing Button */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Trailing Button
        </Text>
        <TextInputComponent
          label="Discount Code"
          placeholder="Enter code"
          trailingButton={<Link>Apply</Link>}
          showClearButton={false}
          name="trailingButton"
        />
      </Box>

      {/* With Clear Button */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Clear Button
        </Text>
        <TextInputComponent
          label="With Clear Button"
          defaultValue="Clear me"
          showClearButton
          name="clearButton"
        />
      </Box>

      {/* With Loading State */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Loading State
        </Text>
        <TextInputComponent label="Loading" placeholder="Enter text" isLoading name="loading" />
      </Box>

      {/* With Max Characters */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Max Characters
        </Text>
        <TextInputComponent
          label="Max Characters"
          placeholder="Max 20 characters"
          maxCharacters={20}
          name="maxCharacters"
        />
      </Box>

      {/* Text Alignment */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Text Alignment
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Left Aligned"
            defaultValue="Left aligned text"
            textAlign="left"
            name="textAlignLeft"
          />
          <TextInputComponent
            label="Center Aligned"
            defaultValue="Center aligned text"
            textAlign="center"
            name="textAlignCenter"
          />
          <TextInputComponent
            label="Right Aligned"
            defaultValue="Right aligned text"
            textAlign="right"
            name="textAlignRight"
          />
        </Box>
      </Box>

      {/* With Label Suffix & Trailing */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          With Label Suffix & Trailing
        </Text>
        <TextInputComponent
          label="GSTIN"
          placeholder="Enter GSTIN"
          labelSuffix={
            <Tooltip content="Your GSTIN is used to generate invoices" placement="right">
              <TooltipInteractiveWrapper display="flex">
                <InfoIcon size="small" color="surface.icon.gray.muted" />
              </TooltipInteractiveWrapper>
            </Tooltip>
          }
          labelTrailing={<Link size="small">Learn more</Link>}
          name="labelSuffixTrailing"
        />
      </Box>

      {/* With Tags */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          With Tags (Tagged Input)
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInputComponent
            label="Email Addresses"
            placeholder="Enter email and press Enter"
            isTaggedInput
            defaultTags={['john@example.com', 'jane@example.com']}
            name="withTags"
          />
          <TextInputComponent
            label="Email Addresses (No Tags)"
            placeholder="Enter email and press Enter"
            isTaggedInput
            name="withoutTags"
          />
        </Box>
      </Box>
    </Box>
  );
};

TextInputShowcase.storyName = 'Showcase - All Variants';
TextInputShowcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all TextInput variants including basic states, validation states, sizes, label positions, icons, dropdowns, and more.',
    },
  },
};
