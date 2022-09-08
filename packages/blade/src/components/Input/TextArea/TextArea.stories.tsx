/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { TextAreaProps } from './TextArea';
import { TextArea as TextAreaComponent } from './TextArea';

const propsCategory = {
  BASE_PROPS: 'Text Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
};

export default {
  title: 'Components/Input/TextArea',
  component: TextAreaComponent,
  args: {
    defaultValue: undefined,
    placeholder: 'Enter your first and last name',
    name: 'fullName',
    isDisabled: false,
    value: undefined,
    maxCharacters: undefined,
    autoFocus: false,
    onChange: ({ name, value }): void => {
      console.log(`input field ${name} content changed to ${value}`);
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
    showClearButton: true,
    numberOfLines: 2,
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
    numberOfLines: {
      control: { type: 'number' },
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
    showClearButton: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            The TextArea component is a component that can be used to input name, email, telephone,
            url, search or plain text.
          </Subtitle>
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { TextArea } from '@razorpay/blade/components' \nimport type { TextAreaProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<TextAreaProps>;

const TextAreaTemplate: ComponentStory<typeof TextAreaComponent> = ({ ...args }) => {
  return <TextAreaComponent {...args} />;
};

export const TextArea = TextAreaTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TextArea.storyName = 'TextArea';

export const TextAreaHelpText = TextAreaTemplate.bind({});
TextAreaHelpText.storyName = 'TextArea with Help Text';
TextAreaHelpText.args = {
  helpText: 'Please enter first and last name',
};

export const TextAreaError = TextAreaTemplate.bind({});
TextAreaError.storyName = 'TextArea with error';
TextAreaError.args = {
  validationState: 'error',
  errorText: 'Name is not valid',
};

export const TextAreaSuccess = TextAreaTemplate.bind({});
TextAreaSuccess.storyName = 'TextArea with success';
TextAreaSuccess.args = {
  defaultValue: 'John Ives',
  validationState: 'success',
  successText: 'Name validated',
};

const TextAreaMaxCharactersTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  return (
    <TextArea
      label="First Name"
      defaultValue="John Ives"
      name="fullName"
      maxCharacters={10}
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const TextAreaMaxCharacters = TextAreaMaxCharactersTemplate.bind({});

const TextAreaUncontrolledTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  return (
    <TextArea
      label="First Name"
      placeholder="Enter your first and last name"
      defaultValue="John Ives"
      name="fullName"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const TextAreaUncontrolled = TextAreaUncontrolledTemplate.bind({});

const TextAreaControlledTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <TextArea
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
export const TextAreaControlled = TextAreaControlledTemplate.bind({});
