import type { StoryFn, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { BaseInputProps } from './BaseInput';
import { BaseInput as BaseInputComponent } from './BaseInput';
import BaseInputLayoutImage from './_decisions/base-inputfield-layout.png';
import iconMap from '~components/Icons/iconMap';
import BaseBox from '~components/Box/BaseBox';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Tag } from '~components/Tag';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { Link } from '~components/Link';

const propsCategory = {
  BASE_PROPS: 'Base Input Props',
  HEADER_PROPS: 'Header Props',
  FOOTER_PROPS: 'Footer Props',
  LEADING_VISUAL_PROPS: 'Leading Visual Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Input/BaseInput (Internal)',
  component: BaseInputComponent,
  args: {
    id: 'base-input',
    defaultValue: undefined,
    placeholder: 'Enter your first and last name',
    name: 'fullName',
    type: 'text',
    isDisabled: false,
    value: undefined,
    maxCharacters: 9999,
    textAlign: 'left',
    autoFocus: false,
    onFocus: ({ name, value }): void => {
      console.log(`input field ${name} recevied focus. The value is ${value}`);
    },
    onChange: ({ name, value }): void => {
      console.log(`input field ${name} content changed to ${value}`);
    },
    onBlur: ({ name, value }): void => {
      console.log(`input field ${name} content lost focus. The value is ${value}`);
    },
    label: 'Enter Name',
    labelPosition: 'top',
    trailingHeaderSlot: undefined,
    necessityIndicator: undefined,
    isRequired: false,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    trailingFooterSlot: undefined,
    leadingIcon: undefined,
    prefix: '',
    interactionElement: undefined,
    suffix: '',
    trailingIcon: undefined,
    keyboardReturnKeyType: undefined,
    autoCompleteSuggestionType: undefined,
    autoCapitalize: undefined,
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    size: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
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
    onFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onBlur: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onSubmit: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
      table: {
        category: propsCategory.HEADER_PROPS,
      },
    },
    labelPosition: {
      table: {
        category: propsCategory.HEADER_PROPS,
      },
    },
    necessityIndicator: {
      table: {
        category: propsCategory.HEADER_PROPS,
      },
    },
    trailingHeaderSlot: {
      table: {
        category: propsCategory.HEADER_PROPS,
      },
    },
    isRequired: {
      table: {
        category: propsCategory.FOOTER_PROPS,
      },
    },
    validationState: {
      table: {
        category: propsCategory.FOOTER_PROPS,
      },
    },
    helpText: {
      table: {
        category: propsCategory.FOOTER_PROPS,
      },
    },
    errorText: {
      table: {
        category: propsCategory.FOOTER_PROPS,
      },
    },
    successText: {
      table: {
        category: propsCategory.FOOTER_PROPS,
      },
    },
    trailingFooterSlot: {
      table: {
        category: propsCategory.FOOTER_PROPS,
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
    interactionElement: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    // interactionElement:{},
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
    keyboardReturnKeyType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    keyboardType: {
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
        <>
          <Title />
          <Subtitle>
            The BaseInput component is a component that will be used as a base to build all the
            other input fields like TextInput, PasswordInput, CardInput, OTPInput
          </Subtitle>
          <img src={BaseInputLayoutImage} alt="Base Input Layout" />
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { BaseInput } from '@razorpay/blade/components' \nimport type { BaseInputProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseInputProps>;

const BaseInputTemplate: StoryFn<typeof BaseInputComponent> = ({
  leadingIcon,
  trailingIcon,
  ...args
}) => {
  return (
    <BaseInputComponent
      {...args}
      leadingIcon={iconMap[(leadingIcon as unknown) as string]}
      trailingIcon={iconMap[(trailingIcon as unknown) as string]}
    />
  );
};

export const BaseInput = BaseInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseInput.storyName = 'BaseInput';

export const BaseInputHelpText = BaseInputTemplate.bind({});
BaseInputHelpText.storyName = 'BaseInput with Help Text';
BaseInputHelpText.args = {
  helpText: 'Please enter first and last name',
};

export const BaseInputError = BaseInputTemplate.bind({});
BaseInputError.storyName = 'BaseInput with error';
BaseInputError.args = {
  validationState: 'error',
  errorText: 'Name is not valid',
};

export const BaseInputSuccess = BaseInputTemplate.bind({});
BaseInputSuccess.storyName = 'BaseInput with success';
BaseInputSuccess.args = {
  defaultValue: 'John Ives',
  validationState: 'success',
  successText: 'Name validated',
};

const BaseInputMaxCharactersTemplate: StoryFn<typeof BaseInputComponent> = ({
  maxCharacters,
  size,
}) => {
  return (
    <BaseInput
      id="base-input"
      label="First Name"
      defaultValue="John Ives"
      name="fullName"
      maxCharacters={maxCharacters}
      size={size}
      trailingFooterSlot={(value) => (
        <BaseBox marginTop={size === 'medium' ? 'spacing.2' : 'spacing.3'}>
          <CharacterCounter
            size={size}
            currentCount={value?.length ?? 0}
            maxCount={maxCharacters ?? 0}
          />
        </BaseBox>
      )}
      helpText="Help Text"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const BaseInputMaxCharacters = BaseInputMaxCharactersTemplate.bind({});

const BaseInputUncontrolledTemplate: StoryFn<typeof BaseInputComponent> = () => {
  return (
    <BaseInput
      id="base-input"
      label="First Name"
      defaultValue="John Ives"
      name="fullName"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const BaseInputUncontrolled = BaseInputUncontrolledTemplate.bind({});

const BaseInputControlledTemplate: StoryFn<typeof BaseInputComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <BaseInput
      id="base-input"
      label="First Name"
      value={inputValue}
      name="fullName"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');
      }}
    />
  );
};

export const BaseInputControlled = BaseInputControlledTemplate.bind({});

const BaseInputControlledWithTagsTemplate: StoryFn<typeof BaseInputComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [currentTags, setCurrentTags] = React.useState<string[]>([]);

  const getTags = (): React.ReactElement[] => {
    return currentTags.map((currentTag, tagIndex) => {
      return (
        <Tag
          _isVirtuallyFocused={tagIndex === activeTagIndex}
          _isTagInsideInput={true}
          key={tagIndex}
          marginRight="spacing.3"
          marginY="spacing.2"
          onDismiss={() => {
            setCurrentTags([...currentTags.slice(0, tagIndex), ...currentTags.slice(tagIndex + 1)]);
          }}
        >
          {currentTag}
        </Tag>
      );
    });
  };

  return (
    <BaseInput
      id="base-input"
      label="First Name"
      as="textarea"
      maxTagRows="multiple"
      value={inputValue}
      autoCompleteSuggestionType="none"
      tags={getTags()}
      activeTagIndex={activeTagIndex}
      showAllTags={true}
      isDropdownTrigger={true}
      setActiveTagIndex={setActiveTagIndex}
      name="fullName"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setCurrentTags([...currentTags, inputValue]);
          setInputValue('');
          setActiveTagIndex(-1);
        }

        if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0) {
          setCurrentTags(currentTags.slice(0, -1));
        }
      }}
    />
  );
};

export const BaseInputControlledWithTags = BaseInputControlledWithTagsTemplate.bind({});

const BaseInputSizesTemplate: StoryFn<typeof BaseInputComponent> = ({
  leadingIcon,
  trailingIcon,
  ...args
}) => {
  const LeadingIcon = iconMap[(leadingIcon as unknown) as string];
  const TrailingIcon = iconMap[(trailingIcon as unknown) as string];

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <Text size="large" marginBottom="spacing.1">
        Medium Size:
      </Text>
      <BaseInputComponent
        {...args}
        leadingIcon={LeadingIcon}
        trailingIcon={TrailingIcon}
        size="medium"
        trailingButton={<Link onClick={() => console.log('Clicked Apply')}>Apply</Link>}
      />
      <Text size="large" marginBottom="spacing.1">
        Large Size:
      </Text>
      <BaseInputComponent
        {...args}
        leadingIcon={iconMap[(leadingIcon as unknown) as string]}
        trailingIcon={iconMap[(trailingIcon as unknown) as string]}
        size="large"
        trailingButton={<Link onClick={() => console.log('Clicked Apply')}>Apply</Link>}
      />
    </Box>
  );
};

export const BaseInputSizes = BaseInputSizesTemplate.bind({});
