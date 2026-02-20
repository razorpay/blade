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
import { ToastContainer, useToast } from '~components/Toast';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { InfoIcon } from '~components/Icons';
import { Link } from '~components/Link';

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

              function App() {
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

export const TextAreaWithTags: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
  const [tags, setTags] = React.useState<string[]>([]);
  return (
    <Box display="flex" flexDirection="column">
      <TextAreaComponent
        {...args}
        numberOfLines={3}
        isTaggedInput={true}
        tags={tags}
        onTagChange={({ tags }) => {
          setTags(tags);
        }}
      />
    </Box>
  );
};

export const TextAreaWithEnterSubmit: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
  const toast = useToast();
  return (
    <Box display="flex" flexDirection="column">
      <ToastContainer />
      <TextAreaComponent
        {...args}
        numberOfLines={3}
        placeholder="Press Shift + Enter for next line and Enter for submit"
        onKeyDown={({ event, value }) => {
          if (!event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            toast.show({ content: `Submit: ${value}`, color: 'positive', type: 'informational' });
          }
        }}
      />
    </Box>
  );
};

export const TextAreaWithControlledTags: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
  const [tags, setTags] = React.useState<string[]>([]);

  return (
    <Box display="flex" flexDirection="column">
      <TextAreaComponent
        {...args}
        tags={tags}
        onTagChange={({ tags }) => {
          setTags(tags);
        }}
      />
    </Box>
  );
};

TextAreaWithControlledTags.args = {
  isTaggedInput: true,
  showClearButton: false,
};

export const TextAreaWithUncontrolledTags: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
  const [tagValues, setTagValues] = React.useState<string[]>([]);
  return (
    <Box display="flex" flexDirection="column">
      <TextAreaComponent
        {...args}
        onTagChange={({ tags }) => {
          console.log('new tags', tags);
          setTagValues(tags);
        }}
      />
      <Box>
        <Text>{tagValues.join(', ')}</Text>
      </Box>
    </Box>
  );
};

TextAreaWithUncontrolledTags.args = {
  isTaggedInput: true,
  showClearButton: true,
};

// Don't copy email regex from here. This is just an example regex for basic emails. Make sure to use email validation as per usecase
const isValidEmail = (email: string): boolean => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const TextAreaWithTagsValidation: StoryFn<typeof TextAreaComponent> = ({ ...args }) => {
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  // we use ref because onTagChange and onChange is called in same render
  // So if we want to set error in onTagChange, and use its value in onChange, its not possible with useState
  const isErrorRef = React.useRef(false);

  return (
    <Box display="flex" flexDirection="column">
      <TextAreaComponent
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

TextAreaWithTagsValidation.args = {
  isTaggedInput: true,
  showClearButton: false,
};

export const TextAreaWithLabelSuffixTrailing = TextAreaTemplate.bind({});
TextAreaWithLabelSuffixTrailing.storyName = 'TextArea with Label Suffix & Trailing';
TextAreaWithLabelSuffixTrailing.args = {
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

export const TextAreaShowcase: StoryFn<typeof TextAreaComponent> = () => {
  const [tagsWithInitial, setTagsWithInitial] = React.useState<string[]>([
    'john@example.com',
    'jane@example.com',
  ]);

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
          <TextAreaComponent label="Default" placeholder="Enter description" name="default" />
          <TextAreaComponent
            label="With Value"
            defaultValue="This is a sample description text that spans multiple lines."
            name="withValue"
          />
          <TextAreaComponent
            label="With Help Text"
            placeholder="Enter description"
            helpText="This is a helpful message"
            name="withHelpText"
          />
          <TextAreaComponent
            label="Disabled"
            placeholder="Enter description"
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
          <TextAreaComponent
            label="Error State"
            defaultValue="Invalid description"
            validationState="error"
            errorText="This field has an error"
            name="error"
          />
          <TextAreaComponent
            label="Success State"
            defaultValue="Valid description"
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
          <TextAreaComponent
            label="Medium Size"
            placeholder="Medium size textarea"
            size="medium"
            name="sizeMedium"
          />
          <TextAreaComponent
            label="Large Size"
            placeholder="Large size textarea"
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
          <TextAreaComponent
            label="Label Top"
            placeholder="Label on top"
            labelPosition="top"
            name="labelTop"
          />
          <TextAreaComponent
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
          <TextAreaComponent
            label="Required Field"
            placeholder="Enter description"
            necessityIndicator="required"
            name="required"
          />
          <TextAreaComponent
            label="Optional Field"
            placeholder="Enter description"
            necessityIndicator="optional"
            name="optional"
          />
        </Box>
      </Box>

      {/* Number of Lines */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Number of Lines
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextAreaComponent
            label="2 Lines (Default)"
            placeholder="Enter description"
            numberOfLines={2}
            name="lines2"
          />
          <TextAreaComponent
            label="3 Lines"
            placeholder="Enter description"
            numberOfLines={3}
            name="lines3"
          />
          <TextAreaComponent
            label="4 Lines"
            placeholder="Enter description"
            numberOfLines={4}
            name="lines4"
          />
          <TextAreaComponent
            label="5 Lines"
            placeholder="Enter description"
            numberOfLines={5}
            name="lines5"
          />
        </Box>
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
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextAreaComponent
            label="Max 50 Characters"
            placeholder="Max 50 characters"
            maxCharacters={50}
            name="maxCharacters50"
          />
          <TextAreaComponent
            label="Max 100 Characters"
            placeholder="Max 100 characters"
            maxCharacters={100}
            name="maxCharacters100"
          />
          <TextAreaComponent
            label="Max 200 Characters"
            defaultValue="This is a sample text that demonstrates the character limit functionality."
            maxCharacters={200}
            name="maxCharacters200"
          />
        </Box>
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
        <TextAreaComponent
          label="With Clear Button"
          defaultValue="Clear me"
          showClearButton
          name="clearButton"
        />
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
        <TextAreaComponent
          label="Description"
          placeholder="Enter description"
          labelSuffix={
            <Tooltip
              content="Your description is used to provide additional context"
              placement="right"
            >
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
          <TextAreaComponent
            label="Email Addresses"
            placeholder="Enter email and press Enter"
            isTaggedInput
            tags={tagsWithInitial}
            onTagChange={({ tags }) => setTagsWithInitial(tags)}
            name="withTags"
          />
          <TextAreaComponent
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

TextAreaShowcase.storyName = 'Showcase - All Variants';
TextAreaShowcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all TextArea variants including basic states, validation states, sizes, label positions, number of lines, max characters, and more.',
    },
  },
};
