import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { TextAreaProps } from './TextArea';
import { TextArea as TextAreaComponent } from './TextArea';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

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
    onFocus: ({ name, value }): void => {
      console.log(`input field ${name} received focus. The value is ${value}`);
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
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
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
    testID: {
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
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The TextArea component lets you enter long form text which spans over multiple lines."
          componentName="TextArea"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Input/TextArea/_decisions/decisions.md"
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76077-93900&t=2ZLEEt6A65Rona3N-1&scaling=min-zoom&page-id=11115%3A166743&mode=design"
        >
          <Title>Usage</Title>
          <Sandbox>
            {`
              import { TextArea } from '@razorpay/blade/components';

              function App(): React.ReactElement {
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
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<TextAreaProps>;

const TextAreaTemplate: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
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

export const TextAreaWithoutLabel = TextAreaTemplate.bind({});
TextAreaWithoutLabel.storyName = 'TextArea without Label';
TextAreaWithoutLabel.args = {
  label: undefined,
  accessibilityLabel: 'Description',
  helpText: 'Add a message here',
};

export const TextAreaNumberOfLines = TextAreaTemplate.bind({});
TextAreaNumberOfLines.storyName = 'TextArea number of lines';
TextAreaNumberOfLines.args = {
  numberOfLines: 4,
};

const TextAreaMaxCharactersTemplate: StoryFn<typeof TextAreaComponent> = () => {
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

const TextAreaSizesTemplate: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" marginBottom="spacing.2">
        Medium Size:
      </Text>
      <TextAreaComponent {...args} size="medium" />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">
        Large Size:
      </Text>
      <TextAreaComponent {...args} size="large" />
    </Box>
  );
};
export const TextAreaSizes = TextAreaSizesTemplate.bind({});

const TextAreaUncontrolledTemplate: StoryFn<typeof TextAreaComponent> = () => {
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

const TextAreaControlledTemplate: StoryFn<typeof TextAreaComponent> = () => {
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

const TextAreaKitchenSinkTemplate: StoryFn<typeof TextAreaComponent> = () => {
  return (
    <>
      <BaseBox display="flex" gap="spacing.5">
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
      </BaseBox>
      <BaseBox display="flex" flexDirection="column" gap="spacing.5">
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
        <TextArea
          necessityIndicator="required"
          accessibilityLabel="Description"
          placeholder="Enter Description"
          name="description"
          labelPosition="left"
          numberOfLines={3}
          maxCharacters={100}
          validationState="none"
          helpText="Write your message"
        />
      </BaseBox>
    </>
  );
};
export const TextAreaKitchenSink = TextAreaKitchenSinkTemplate.bind({});

export const inputRef: StoryFn<typeof TextAreaComponent> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="end">
      <TextAreaComponent ref={inputRef} label="Message" />
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

inputRef.storyName = 'Text Area Ref';
inputRef.parameters = {
  docs: {
    description: {
      story:
        'TextArea component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};
