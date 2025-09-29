import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import type { CounterInputProps } from './types';
import { CounterInput as CounterInputComponent } from './CounterInput';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getBladeCommonEventArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="CounterInput"
      componentDescription="CounterInput allows users to increment or decrement numerical values using built-in controls with manual text input support."
      figmaURL="https://www.figma.com/design/fGoYjy1l6hjqG759G6XZEF/-Research--Counter-Input?node-id=323-11223&t=GDE5fN6tVSW2JXeR-0"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { CounterInput } from '@razorpay/blade/components';
        import { useState } from 'react';

        function App() {
          const [quantity, setQuantity] = useState(1);

          return (
            <CounterInput 
              label="Quantity" 
              value={quantity}
              onChange={({ value }) => {
                setQuantity(value);
                console.log('Value changed:', value);
              }}
              min={1}
              max={10}
            />
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<CounterInputProps> = {
  title: 'Components/CounterInput',
  component: CounterInputComponent,
  args: {
    label: 'Quantity',
    min: 0,
    max: 100,
    emphasis: 'subtle',
    size: 'medium',
    isLoading: false,
    isDisabled: false,
  },
  tags: ['autodocs'],
  argTypes: {
    ...getBladeCommonEventArgTypes(),
    onChange: { action: 'onChange' },
    onFocus: { action: 'onFocus' },
    onBlur: { action: 'onBlur' },
    emphasis: {
      control: { type: 'select' },
      options: ['subtle', 'intense'],
    },
    size: {
      control: { type: 'select' },
      options: ['xsmall', 'medium', 'large'],
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

// Basic Usage Example
export const BasicUsage: StoryFn<typeof CounterInputComponent> = () => {
  const [value, setValue] = useState(5 as number);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        Basic Usage
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        Simple counter input with label, value, and onChange handler.
      </Text>
      <CounterInputComponent
        label="Basic Counter"
        value={value}
        onChange={({ value: newValue }) => {
          console.log('newValue', newValue);
          setValue(newValue);
        }}
      />
      <Text size="small" color="surface.text.gray.subtle">
        Current value: {value}
      </Text>
    </BaseBox>
  );
};

// Size Variants
export const SizeVariants: StoryFn<typeof CounterInputComponent> = () => {
  const [xsmallValue, setXsmallValue] = useState(1);
  const [mediumValue, setMediumValue] = useState(2);
  const [largeValue, setLargeValue] = useState(3);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <Text size="large" weight="semibold">
        Size Variants
      </Text>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          XSmall Size
        </Text>
        <CounterInputComponent
          label="XSmall Counter"
          size="xsmall"
          value={xsmallValue}
          onChange={({ value }) => setXsmallValue(value)}
          min={0}
        />
      </BaseBox>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          Medium Size (Default)
        </Text>
        <CounterInputComponent
          label="Medium Counter"
          size="medium"
          value={mediumValue}
          onChange={({ value }) => setMediumValue(value)}
          min={0}
        />
      </BaseBox>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          Large Size
        </Text>
        <CounterInputComponent
          label="Large Counter"
          size="large"
          value={largeValue}
          onChange={({ value }) => setLargeValue(value)}
          min={0}
        />
      </BaseBox>
    </BaseBox>
  );
};

// Emphasis Variants
export const EmphasisVariants: StoryFn<typeof CounterInputComponent> = () => {
  const [subtleValue, setSubtleValue] = useState(5);
  const [intenseValue, setIntenseValue] = useState(5);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <Text size="large" weight="semibold">
        Emphasis Variants
      </Text>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          Subtle Emphasis (Default)
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          Gray icons and borders, no progress bar color
        </Text>
        <CounterInputComponent
          label="Subtle Counter"
          emphasis="subtle"
          value={subtleValue}
          onChange={({ value }) => setSubtleValue(value)}
          min={0}
        />
      </BaseBox>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          Intense Emphasis
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          Primary colored icons and borders, blue progress bar
        </Text>
        <CounterInputComponent
          label="Intense Counter"
          emphasis="intense"
          value={intenseValue}
          onChange={({ value }) => setIntenseValue(value)}
          min={0}
        />
      </BaseBox>
    </BaseBox>
  );
};

// Min/Max Constraints
export const MinMaxConstraints: StoryFn<typeof CounterInputComponent> = () => {
  const [value, setValue] = useState(5);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        Min/Max Constraints
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        Counter with minimum value of 1 and maximum value of 10. Buttons disable at limits.
      </Text>
      <CounterInputComponent
        label="Constrained Counter"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        min={1}
        max={10}
      />
      <Text size="small" color="surface.text.gray.subtle">
        Current: {value} | Min: 1 | Max: 10
      </Text>
    </BaseBox>
  );
};

// Uncontrolled Component
export const UncontrolledComponent: StoryFn<typeof CounterInputComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        Uncontrolled Component
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        Counter with defaultValue, manages its own state internally.
      </Text>
      <CounterInputComponent
        label="Uncontrolled Counter"
        defaultValue={3}
        min={0}
        max={20}
        onChange={({ value }) => console.log('Uncontrolled value changed:', value)}
      />
    </BaseBox>
  );
};

// Loading State
export const LoadingState: StoryFn<typeof CounterInputComponent> = () => {
  const [value1, setValue1] = useState(5);
  const [isLoading1, setIsLoading1] = useState(false);

  const [value2, setValue2] = useState(5);
  const [isLoading2, setIsLoading2] = useState(false);

  const handleChange = ({ value: newValue }: { value: number }) => {
    setIsLoading1(true);
    setValue1(newValue);

    // Simulate async operation
    setTimeout(() => {
      setIsLoading1(false);
    }, 2500);
  };

  const handleChange2 = ({ value: newValue }: { value: number }) => {
    setIsLoading2(true);
    setValue2(newValue);

    // Simulate async operation
    setTimeout(() => {
      setIsLoading2(false);
    }, 1000);
  };

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        Loading State
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        Shows loading indicator and disables interactions during async operations.
      </Text>
      <CounterInputComponent
        label="Loading Counter"
        value={value1}
        onChange={handleChange}
        isLoading={isLoading1}
        min={0}
        max={10}
      />
      <CounterInputComponent
        label="Loading Counter"
        emphasis="subtle"
        value={value2}
        onChange={handleChange2}
        isLoading={isLoading2}
        min={0}
        max={10}
      />
    </BaseBox>
  );
};

// Disabled State
export const DisabledState: StoryFn<typeof CounterInputComponent> = () => {
  const [value, setValue] = useState(5);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        Disabled State
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        Counter input in disabled state - no interactions allowed.
      </Text>
      <CounterInputComponent
        label="Disabled Counter"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        isDisabled={true}
      />
      <CounterInputComponent
        label="Disabled Counter"
        emphasis="subtle"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        isDisabled={true}
      />
    </BaseBox>
  );
};

// Label Positioning
export const LabelPositioning: StoryFn<typeof CounterInputComponent> = () => {
  const [topValue, setTopValue] = useState(1);
  const [leftValue, setLeftValue] = useState(2);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <Text size="large" weight="semibold">
        Label Positioning
      </Text>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          Top Position (Default)
        </Text>
        <CounterInputComponent
          label="Top Label"
          labelPosition="top"
          value={topValue}
          onChange={({ value }) => setTopValue(value)}
          min={0}
          max={10}
        />
      </BaseBox>

      <BaseBox display="flex" flexDirection="column" gap="spacing.3">
        <Text size="medium" weight="medium">
          Left Position
        </Text>

        <CounterInputComponent
          label="Left Label"
          labelPosition="left"
          value={leftValue}
          onChange={({ value }) => setLeftValue(value)}
          min={0}
          max={10}
        />
      </BaseBox>
    </BaseBox>
  );
};

export const MultipleCounterInputs: StoryFn<typeof CounterInputComponent> = () => {
  const [formData, setFormData] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const handleFieldChange = (field: keyof typeof formData) => ({ value }: { value: number }) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <Text size="large" weight="semibold">
        Multiple Counter Inputs
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        Multiple counter inputs working together.
      </Text>

      <BaseBox display="flex" flexDirection="column" gap="spacing.4">
        <CounterInputComponent
          label="Adults"
          name="adults"
          value={formData.adults}
          onChange={handleFieldChange('adults')}
          min={1}
          max={10}
        />

        <CounterInputComponent
          label="Children"
          name="children"
          value={formData.children}
          onChange={handleFieldChange('children')}
          min={0}
          max={8}
        />

        <CounterInputComponent
          label="Rooms"
          name="rooms"
          value={formData.rooms}
          onChange={handleFieldChange('rooms')}
          min={1}
          max={5}
        />
      </BaseBox>

      <BaseBox
        padding="spacing.4"
        backgroundColor="surface.background.gray.intense"
        borderRadius="medium"
      >
        <Text size="small" weight="medium">
          Counter Inputs Data:
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          Adults: {formData.adults}, Children: {formData.children}, Rooms: {formData.rooms}
        </Text>
      </BaseBox>
    </BaseBox>
  );
};

export default meta;
