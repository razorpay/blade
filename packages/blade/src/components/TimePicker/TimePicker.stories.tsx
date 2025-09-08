import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { TimePicker } from './TimePicker';
import { Box } from '~components/Box';
import { Text, Code } from '~components/Typography';
import { Button } from '~components/Button';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { InfoIcon } from '~components/Icons';
import { Link } from '~components/Link';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const propsCategory = {
  BASE_PROPS: 'TimePicker Props',
  INPUT_PROPS: 'Input Props',
};

const baseProp = {
  table: {
    category: propsCategory.BASE_PROPS,
  },
} as const;

const inputProp = {
  table: {
    category: propsCategory.INPUT_PROPS,
  },
} as const;

export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    // TimePicker specific props
    value: baseProp,
    defaultValue: baseProp,
    onChange: baseProp,
    onApply: baseProp,
    timeFormat: baseProp,
    minuteStep: baseProp,
    isOpen: baseProp,
    defaultIsOpen: baseProp,
    onOpenChange: baseProp,
    showFooterActions: baseProp,
    // Input props inherited from BaseInput
    accessibilityLabel: inputProp,
    errorText: inputProp,
    helpText: inputProp,
    successText: inputProp,
    isDisabled: inputProp,
    isRequired: inputProp,
    label: inputProp,
    labelPosition: inputProp,
    size: inputProp,
    validationState: inputProp,
    name: inputProp,
    autoFocus: inputProp,
    necessityIndicator: inputProp,
    placeholder: inputProp,
    labelSuffix: inputProp,
    labelTrailing: inputProp,
    // Hide internal implementation props from documentation
    testID: { table: { disable: true } },
    ref: { table: { disable: true } },
    inputRef: { table: { disable: true } },
    referenceProps: { table: { disable: true } },
    setControlledValue: { table: { disable: true } },
    time: { table: { disable: true } },
    timeValue: { table: { disable: true } },
    onTimeValueChange: { table: { disable: true } },
    onInputClick: { table: { disable: true } },
    createCompleteTime: { table: { disable: true } },
    onFocus: inputProp,
    onBlur: inputProp,
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The TimePicker component is used to select a specific time with support for both 12-hour and 24-hour formats, configurable minute steps, and responsive layouts."
          componentName="TimePicker"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/TimePicker/_decisions/decisions.md"
          figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=88832-1762629&t=oSH8pSWjSoiOUnXo-0"
        >
          <Sandbox editorHeight={600}>
            {`
              import { TimePicker } from '@razorpay/blade/components';

              function App() {
                const [time, setTime] = useState(null);
                
                return (
                  <TimePicker 
                    label="Select Time"
                    value={time}
                    onChange={({ value }) => setTime(value)}
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
} as Meta<typeof TimePicker>;

const TimePickerTemplate: StoryFn<typeof TimePicker> = ({ ...args }) => {
  const [time, setTime] = useState<Date | null>(
    args.isDisabled ? new Date('2024-01-01T14:30:00') : null,
  );

  return (
    <TimePicker
      {...args}
      label="Select Time"
      value={time}
      onChange={({ value }) => {
        setTime(value);
        console.log('Selected time:', value);
      }}
    />
  );
};

// Basic 12-hour TimePicker example
export const BasicTimePicker = TimePickerTemplate.bind({});
BasicTimePicker.storyName = 'Basic';
BasicTimePicker.args = {
  label: 'Select a time',
  size: 'medium',
  timeFormat: '12h',
};

// 24-hour format example
export const TwentyFourHourTimePicker = TimePickerTemplate.bind({});
TwentyFourHourTimePicker.storyName = 'Twenty-Four Hour';
TwentyFourHourTimePicker.args = {
  label: 'Select a time',
  size: 'medium',
  timeFormat: '24h',
};

// Disabled state
export const DisabledTimePicker = TimePickerTemplate.bind({});
DisabledTimePicker.storyName = 'Disabled';
DisabledTimePicker.args = {
  label: 'Select a time',
  size: 'medium',
  timeFormat: '24h',
  isDisabled: true,
};

// Controlled TimePicker example with state management
export const ControlledTimePicker: StoryFn<typeof TimePicker> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">isOpen</Code>, <Code size="medium">value</Code> and associated
        event handlers you can control the TimePicker.
      </Text>
      <Box marginBottom="spacing.5">
        <Text>Selected: {time ? time.toLocaleTimeString() : 'None'}</Text>
        <Text marginTop="spacing.2">IsOpen: {JSON.stringify(isOpen)}</Text>
      </Box>
      <TimePicker
        label="Select Meeting Time"
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        value={time}
        onChange={({ value }) => {
          setTime(value);
          console.log('Time changed:', value);
        }}
      />
      <Button
        onClick={() => {
          const newTime = new Date();
          newTime.setHours(Math.floor(Math.random() * 12) + 1);
          newTime.setMinutes(Math.floor(Math.random() * 60));
          setTime(newTime);
        }}
        marginTop="spacing.5"
      >
        Set Random Time
      </Button>
    </Box>
  );
};

ControlledTimePicker.storyName = 'Controlled TimePicker';

// Validation examples
export const Validations: StoryFn<typeof TimePicker> = () => {
  // Separate state for each TimePicker to avoid conflicts
  const [businessTime, setBusinessTime] = useState<Date | null>(null);
  const [requiredTime, setRequiredTime] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [hasBusinessError, setHasBusinessError] = useState(false);

  const validateBusinessTime = (selectedTime: Date | null) => {
    if (!selectedTime) {
      setHasBusinessError(true);
      return;
    }

    const hour = selectedTime.getHours();
    // Business hours validation: 9 AM to 6 PM
    if (hour < 9 || hour >= 18) {
      setHasBusinessError(true);
    } else {
      setHasBusinessError(false);
    }
  };

  return (
    <Box>
      <Text marginBottom="spacing.5">
        TimePicker supports all common Input props like <Code size="medium">validationState</Code>,{' '}
        <Code size="medium">isRequired</Code>, <Code size="medium">errorText</Code>,{' '}
        <Code size="medium">successText</Code>, etc.
      </Text>

      <Box display="flex" flexDirection="column" gap="spacing.5">
        {/* Error state with business hours validation */}
        <TimePicker
          validationState={hasBusinessError ? 'error' : businessTime ? 'success' : 'none'}
          errorText={
            hasBusinessError
              ? 'Please select a time during business hours (9 AM - 6 PM)'
              : undefined
          }
          successText={
            !hasBusinessError && businessTime ? 'Valid business hours selected' : undefined
          }
          label="Business Hours Meeting Time"
          value={businessTime}
          onChange={({ value }) => {
            setBusinessTime(value);
            validateBusinessTime(value);
          }}
        />

        {/* Required field with separate state */}
        <TimePicker
          label="Required Time"
          isRequired
          validationState={!requiredTime ? 'error' : 'none'}
          errorText={!requiredTime ? 'This field is required' : undefined}
          necessityIndicator="required"
          value={requiredTime}
          onChange={({ value }) => {
            setRequiredTime(value);
          }}
        />

        {/* Help text with separate state */}
        <TimePicker
          label="Appointment Time"
          helpText="Select your preferred appointment time. We recommend scheduling during business hours."
          value={appointmentTime}
          onChange={({ value }) => {
            setAppointmentTime(value);
          }}
        />
      </Box>
    </Box>
  );
};

Validations.storyName = 'Validation States';

// Size variants
export const SizeVariants: StoryFn<typeof TimePicker> = () => {
  const [mediumTime, setMediumTime] = useState<Date | null>(null);
  const [largeTime, setLargeTime] = useState<Date | null>(null);

  return (
    <Box>
      <Text marginBottom="spacing.5">
        TimePicker supports different size variants: <Code size="medium">medium</Code> and{' '}
        <Code size="medium">large</Code>.
      </Text>

      <Box display="flex" flexDirection="column" gap="spacing.5" maxWidth="400px">
        <TimePicker
          label="Medium Size (Default)"
          size="medium"
          value={mediumTime}
          onChange={({ value }) => setMediumTime(value)}
          helpText="This is the default medium size"
        />

        <TimePicker
          label="Large Size"
          size="large"
          value={largeTime}
          onChange={({ value }) => setLargeTime(value)}
          helpText="This is the large size variant"
        />
      </Box>
    </Box>
  );
};

SizeVariants.storyName = 'Size Variants';

// Label position examples
export const LabelPositions: StoryFn<typeof TimePicker> = () => {
  return (
    <Box>
      <Text marginBottom="spacing.5">
        The <Code size="medium">labelPosition</Code> prop controls where the label appears. You can
        also add <Code size="medium">labelSuffix</Code> and <Code size="medium">labelTrailing</Code>{' '}
        for additional content.
      </Text>

      <Box display="flex" flexDirection="column" gap="spacing.5">
        {/* Default top position */}
        <TimePickerTemplate
          label="Meeting Time"
          labelPosition="top"
          labelSuffix={
            <Tooltip content="Select your preferred meeting time" placement="right">
              <TooltipInteractiveWrapper display="flex">
                <InfoIcon size="small" color="surface.icon.gray.muted" />
              </TooltipInteractiveWrapper>
            </Tooltip>
          }
          labelTrailing={<Link size="small">Time zone settings</Link>}
        />

        {/* Left position */}
        <TimePickerTemplate
          label="Start Time"
          labelPosition="left"
          labelSuffix={
            <Tooltip content="Event start time" placement="right">
              <TooltipInteractiveWrapper display="flex">
                <InfoIcon size="small" color="surface.icon.gray.muted" />
              </TooltipInteractiveWrapper>
            </Tooltip>
          }
          labelTrailing={<Link size="small">Learn more</Link>}
        />
      </Box>
    </Box>
  );
};

LabelPositions.storyName = 'Label Positions & Accessories';

// Minute step examples
export const MinuteSteps: StoryFn<typeof TimePicker> = () => {
  return (
    <Box>
      <Text marginBottom="spacing.5">
        The <Code size="medium">minuteStep</Code> prop controls the minute intervals available for
        selection. Supported values are <Code size="medium">1</Code>, <Code size="medium">5</Code>,{' '}
        <Code size="medium">15</Code>, and <Code size="medium">30</Code>.
      </Text>

      <Box display="flex" flexDirection="column" gap="spacing.5" maxWidth="400px">
        <TimePickerTemplate
          label="1-minute intervals (Default)"
          minuteStep={1}
          helpText="All minutes available"
        />

        <TimePickerTemplate
          label="5-minute intervals"
          minuteStep={5}
          helpText="00, 05, 10, 15, 20, etc."
        />

        <TimePickerTemplate label="15-minute intervals" minuteStep={15} helpText="00, 15, 30, 45" />

        <TimePickerTemplate label="30-minute intervals" minuteStep={30} helpText="00, 30" />
      </Box>
    </Box>
  );
};

MinuteSteps.storyName = 'Minute Step Intervals';

// Footer actions examples
export const FooterActions: StoryFn<typeof TimePicker> = () => {
  const [timeWithActions, setTimeWithActions] = useState<Date | null>(null);
  const [timeWithoutActions, setTimeWithoutActions] = useState<Date | null>(null);

  return (
    <Box>
      <Text marginBottom="spacing.5">
        The <Code size="medium">showFooterActions</Code> prop controls whether Apply/Cancel buttons
        are shown. When <Code size="medium">false</Code>, time selection is applied immediately on
        blur.
      </Text>

      <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
        <Box>
          <TimePicker
            label="With Footer Actions (Default)"
            showFooterActions={true}
            value={timeWithActions}
            onChange={({ value }) => {
              setTimeWithActions(value);
              console.log('Time changed (not applied yet):', value);
            }}
            onApply={({ value }) => {
              console.log('Time applied:', value);
            }}
          />
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
            Selected: {timeWithActions ? timeWithActions.toLocaleTimeString() : 'None'}
          </Text>
        </Box>

        <Box>
          <TimePicker
            label="Without Footer Actions"
            showFooterActions={false}
            value={timeWithoutActions}
            onChange={({ value }) => {
              setTimeWithoutActions(value);
              console.log('Time applied immediately:', value);
            }}
          />
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
            Applied immediately:{' '}
            {timeWithoutActions ? timeWithoutActions.toLocaleTimeString() : 'None'}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

FooterActions.storyName = 'Footer Actions';
// Template for storybook controls
