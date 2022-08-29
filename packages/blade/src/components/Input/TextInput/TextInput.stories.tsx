/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { TextInputProps } from './TextInput';
import { TextInput as TextInputComponent } from './TextInput';
// import iconMap from '~components/Icons/iconMap';
// import { CloseIcon } from '~components/Icons';

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
    maxCharacters: 9999,
    textAlign: 'left',
    autoFocus: true,
    onChange: undefined,
    onBlur: undefined,
    label: 'Enter Name',
    labelPosition: 'top',
    necessityIndicator: undefined,
    isRequired: false,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    // leadingIcon: undefined,
    prefix: '',
    // interactionElement: <CloseIcon size="medium" color="surface.text.subtle.lowContrast" />,
    suffix: '',
    // trailingIcon: undefined,
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
    // leadingIcon: {
    //   name: 'leadingIcon',
    //   type: 'select',
    //   options: Object.keys(iconMap),
    //   table: {
    //     category: propsCategory.LEADING_VISUAL_PROPS,
    //   },
    // },
    prefix: {
      table: {
        category: propsCategory.LEADING_VISUAL_PROPS,
      },
    },
    // interactionElement: {
    //   table: {
    //     category: propsCategory.TRAILING_VISUAL_PROPS,
    //   },
    // },
    // interactionElement:{},
    suffix: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    // trailingIcon: {
    //   name: 'trailingIcon',
    //   type: 'select',
    //   options: Object.keys(iconMap),
    //   table: {
    //     category: propsCategory.TRAILING_VISUAL_PROPS,
    //   },
    // },
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
        <>
          <Title />
          <Subtitle>
            The TextInput component is a component that will be used as a base to build all the
            other input fields like TextInput, PasswordInput, CardInput, OTPInput
          </Subtitle>
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { BaseText } from '@razorpay/blade/components' \nimport type { BaseTextProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<TextInputProps>;

const TextInputTemplate: ComponentStory<typeof TextInputComponent> = ({
  // leadingIcon,
  // trailingIcon,
  ...args
}) => {
  return (
    <TextInputComponent
      {...args}
      // leadingIcon={iconMap[(leadingIcon as unknown) as string]}
      // trailingIcon={iconMap[(trailingIcon as unknown) as string]}
    />
  );
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

// const UncontrolledTextInputTemplate: ComponentStory<typeof TextInputComponent> = () => {
//   return (
//     <TextInput
//       label="First Name"
//       defaultValue="John Ives"
//       name="fullName"
//       onChange={({ name, value }): void => console.log({ name, value })}
//     />
//   );
// };
// export const UncontrolledTextInput = UncontrolledTextInputTemplate.bind({});

// const ControlledTextInputTemplate: ComponentStory<typeof TextInputComponent> = () => {
//   const [inputValue, setInputValue] = React.useState('');

//   return (
//     <TextInput
//       label="First Name"
//       value={inputValue}
//       name="fullName"
//       onChange={({ name, value }): void => {
//         console.log(`sending ${name}:${value} to analytics service`);
//         setInputValue(value ?? '');
//       }}
//     />
//   );
// };
// export const ControlledTextInput = ControlledTextInputTemplate.bind({});
