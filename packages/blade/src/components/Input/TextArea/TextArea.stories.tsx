import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import React from 'react';
import type { TextAreaProps } from './TextArea';
import { TextArea as TextAreaComponent } from './TextArea';
import Box from '~components/Box';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const propsCategory = {
  BASE_PROPS: 'TextArea Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
};

export default {
  title: 'Components/Input/TextArea',
  component: TextAreaComponent,
  args: {
    defaultValue: undefined,
    placeholder: 'Enter Description',
    name: 'description',
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
    label: 'Description',
    labelPosition: 'top',
    necessityIndicator: undefined,
    isRequired: false,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    showClearButton: undefined,
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
      control: { type: 'range', min: 2, max: 5, step: 1 },
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
            The TextArea component lets you enter long form text which spans over multiple lines.
          </Subtitle>
          <Title>Usage</Title>
          <Sandbox>
            {`
              import { TextArea } from '@razorpay/blade/components';

              function App(): JSX.Element {
                return (
                  <TextArea 
                    label="Description" 
                    placeholder="Enter Description"
                    helpText="Enter Text Here" 
                    maxCharacters={100} 
                  />
                )
              }

              export default App;
            `}
          </Sandbox>
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
  helpText: 'Add a message here',
};

export const TextAreaError = TextAreaTemplate.bind({});
TextAreaError.storyName = 'TextArea with error';
TextAreaError.args = {
  validationState: 'error',
  errorText: 'Invalid message',
};

export const TextAreaSuccess = TextAreaTemplate.bind({});
TextAreaSuccess.storyName = 'TextArea with success';
TextAreaSuccess.args = {
  defaultValue: 'TextArea content',
  validationState: 'success',
  successText: 'Validated',
};

export const TextAreaNumberOfLines = TextAreaTemplate.bind({});
TextAreaNumberOfLines.storyName = 'TextArea number of lines';
TextAreaNumberOfLines.args = {
  numberOfLines: 4,
};

const TextAreaMaxCharactersTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  return (
    <TextArea
      label="Description"
      defaultValue="Textarea content"
      name="description"
      maxCharacters={10}
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const TextAreaMaxCharacters = TextAreaMaxCharactersTemplate.bind({});

const TextAreaUncontrolledTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  return (
    <TextArea
      label="Description"
      placeholder="Enter description"
      defaultValue="Textarea content"
      name="description"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const TextAreaUncontrolled = TextAreaUncontrolledTemplate.bind({});

const TextAreaControlledTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <TextArea
      label="Description"
      placeholder="Enter Description"
      value={inputValue}
      name="description"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');
      }}
    />
  );
};
export const TextAreaControlled = TextAreaControlledTemplate.bind({});

const TextAreaKitchenSinkTemplate: ComponentStory<typeof TextAreaComponent> = () => {
  return (
    <>
      <Box display="flex" gap="spacing.5">
        <TextArea
          showClearButton
          label="Description"
          placeholder="Enter Description"
          name="description"
        />

        <TextArea
          label="Description"
          placeholder="Enter Description"
          name="description"
          defaultValue="Anurag"
        />

        <TextArea
          validationState="error"
          label="Description"
          placeholder="Enter Description"
          name="description"
          defaultValue="Anurag"
          errorText="Name is invalid"
        />

        <TextArea
          validationState="success"
          label="Description"
          placeholder="Enter Description"
          name="description"
          defaultValue="Anurag"
          successText="Name is valid"
        />
      </Box>
      <Box display="flex" flexDirection="column" gap="spacing.5">
        <TextArea
          label="Description"
          placeholder="Enter Description"
          name="description"
          maxCharacters={100}
        />

        <TextArea
          label="Description"
          placeholder="Enter Description"
          name="description"
          numberOfLines={4}
        />

        <TextArea
          label="Description"
          placeholder="Enter Description"
          name="description"
          labelPosition="left"
        />

        <TextArea
          necessityIndicator="optional"
          label="Description"
          placeholder="Enter Description"
          name="description"
          labelPosition="left"
          maxCharacters={100}
        />

        <TextArea
          necessityIndicator="required"
          label="Description"
          placeholder="Enter Description"
          name="description"
          labelPosition="left"
          numberOfLines={3}
          maxCharacters={100}
          validationState="none"
          helpText="Write your message"
        />
      </Box>
    </>
  );
};
export const TextAreaKitchenSink = TextAreaKitchenSinkTemplate.bind({});
