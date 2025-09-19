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
          figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=110199-7268&p=f&t=Vkpr2l6vN8DJ0Bnw-0"
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

// Basic 12-hour TimePicker example
export const BasicTimePicker: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <TimePicker
      label="Select a timeweee"
      size="medium"
      timeFormat="12h"
      value={time}
      onChange={({ value }) => {
        setTime(value);
        console.log('Selected time:', value);
      }}
      showFooterActions={false}
    />
  );
};
BasicTimePicker.storyName = 'Basic';

// 24-hour format example
export const TwentyFourHourTimePicker: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <TimePicker
      label="Select a time"
      size="medium"
      timeFormat="24h"
      value={time}
      onChange={({ value }) => {
        setTime(value);
        console.log('Selected time:', value);
      }}
      onApply={({ value }) => {
        console.log('Time applied:', value);
      }}
    />
  );
};
TwentyFourHourTimePicker.storyName = 'Twenty-Four Hour';

// Disabled state
export const DisabledTimePicker: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState<Date | null>(new Date('2024-01-01T14:30:00'));

  return (
    <TimePicker
      label="Select a time"
      size="medium"
      timeFormat="24h"
      isDisabled={true}
      value={time}
      onChange={({ value }) => {
        setTime(value);
        console.log('Selected time:', value);
      }}
    />
  );
};
DisabledTimePicker.storyName = 'Disabled';

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

// Uncontrolled TimePicker example
export const UncontrolledTimePicker: StoryFn<typeof TimePicker> = () => {
  return (
    <TimePicker
      label="Meeting Time"
      defaultValue={new Date('2024-01-01T14:30:00')}
      onChange={({ value }) => {
        console.log('Time changed:', value);
      }}
    />
  );
};

UncontrolledTimePicker.storyName = 'Uncontrolled TimePicker';

// Validation examples
export const Validations: StoryFn<typeof TimePicker> = () => {
  // Separate state for each TimePicker to avoid conflicts
  const [businessTime, setBusinessTime] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [hasBusinessError, setHasBusinessError] = useState(false);

  const validateBusinessTime = (selectedTime: Date | null): void => {
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
        <TimePicker
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
        <TimePicker
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
  const [time1, setTime1] = React.useState<Date | null>(null);
  const [time2, setTime2] = React.useState<Date | null>(null);
  const [time3, setTime3] = React.useState<Date | null>(null);
  const [time4, setTime4] = React.useState<Date | null>(null);

  return (
    <Box>
      <Text marginBottom="spacing.5">
        The <Code size="medium">minuteStep</Code> prop controls the minute intervals available for
        selection. Supported values are <Code size="medium">1</Code>, <Code size="medium">5</Code>,{' '}
        <Code size="medium">15</Code>, and <Code size="medium">30</Code>.
      </Text>

      <Box display="flex" flexDirection="column" gap="spacing.5" maxWidth="400px">
        <TimePicker
          label="1-minute intervals (Default)"
          minuteStep={1}
          helpText="All minutes available"
          value={time1}
          onChange={({ value }) => setTime1(value)}
        />

        <TimePicker
          label="5-minute intervals"
          minuteStep={5}
          helpText="00, 05, 10, 15, 20, etc."
          value={time2}
          onChange={({ value }) => setTime2(value)}
        />

        <TimePicker
          label="15-minute intervals"
          minuteStep={15}
          helpText="00, 15, 30, 45"
          value={time3}
          onChange={({ value }) => setTime3(value)}
        />

        <TimePicker
          label="30-minute intervals"
          minuteStep={30}
          helpText="00, 30"
          value={time4}
          onChange={({ value }) => setTime4(value)}
        />
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

// Range selection example
export const RangeSelection: StoryFn<typeof TimePicker> = () => {
  const [startTime, setStartTime] = React.useState<Date | null>(() => {
    const now = new Date();
    now.setHours(9, 0, 0, 0); // 9:00 AM
    return now;
  });
  const [endTime, setEndTime] = React.useState<Date | null>(() => {
    const now = new Date();
    now.setHours(11, 0, 0, 0); // 11:00 AM
    return now;
  });

  // Calculate duration
  const duration = React.useMemo(() => {
    if (!startTime || !endTime) return null;
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return 'End time must be after start time';
    if (diffHours === 0 && diffMinutes === 0) return '0 minutes';
    if (diffHours === 0) return `${diffMinutes} minutes`;
    if (diffMinutes === 0) return `${diffHours} hours`;
    return `${diffHours} hours ${diffMinutes} minutes`;
  }, [startTime, endTime]);

  const isValidRange = startTime && endTime && endTime.getTime() > startTime.getTime();

  return (
    <Box>
      <Text marginBottom="spacing.5">
        Use multiple TimePicker components to create time range selections for scheduling,
        appointments, or work shifts.
      </Text>

      <Box display="flex" flexDirection="row" gap="spacing.5" maxWidth="400px">
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={({ value }) => setStartTime(value)}
          helpText="Select the beginning time"
          timeFormat="12h"
        />

        <TimePicker
          label="End Time"
          value={endTime}
          onChange={({ value }) => setEndTime(value)}
          helpText="Select the ending time"
          timeFormat="12h"
          errorText={duration === 'End time must be after start time' ? duration : undefined}
          validationState={duration === 'End time must be after start time' ? 'error' : undefined}
        />
      </Box>
      {/* Duration Display */}
      <Box
        padding="spacing.4"
        backgroundColor={
          isValidRange ? 'feedback.background.positive.subtle' : 'surface.background.gray.moderate'
        }
        borderRadius="medium"
        width="30%"
        margin={['spacing.5', 'spacing.0']}
      >
        <Text weight="semibold" size="small">
          Time Range Summary:
        </Text>
        <Text size="small" marginTop="spacing.2">
          Start: {startTime ? startTime.toLocaleTimeString() : 'Not selected'}
        </Text>
        <Text size="small">End: {endTime ? endTime.toLocaleTimeString() : 'Not selected'}</Text>
        <Text size="small" weight="semibold" marginTop="spacing.2">
          Duration: {duration ?? 'Select both times'}
        </Text>
      </Box>
    </Box>
  );
};

RangeSelection.storyName = 'Time Range Selection';

// Template for storybook controls
