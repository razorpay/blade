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
import { useToast, ToastContainer } from '~components/Toast';

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
  title: 'Components/Input/CounterInput',
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
          max={10}
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
          max={10}
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
  const [counters, setCounters] = useState({
    cartQuantity: { value: 5, isLoading: false },
    subscriptionSeats: { value: 3, isLoading: false },
  });

  const handleChange = (key: keyof typeof counters, loadingDuration: number) => ({
    value: newValue,
  }: {
    value: number;
  }) => {
    setCounters((prev) => ({
      ...prev,
      [key]: { value: newValue, isLoading: true },
    }));

    // Simulate async operation
    setTimeout(() => {
      setCounters((prev) => ({
        ...prev,
        [key]: { ...prev[key], isLoading: false },
      }));
    }, loadingDuration);
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
        label="Cart Quantity (2.5s loading)"
        value={counters.cartQuantity.value}
        onChange={handleChange('cartQuantity', 2500)}
        isLoading={counters.cartQuantity.isLoading}
        emphasis="intense"
        min={0}
        max={10}
      />
      <CounterInputComponent
        label="Subscription Seats (1s loading)"
        value={counters.subscriptionSeats.value}
        onChange={handleChange('subscriptionSeats', 1000)}
        isLoading={counters.subscriptionSeats.isLoading}
        emphasis="subtle"
        min={1}
        max={20}
      />
    </BaseBox>
  );
};

// Controlled Loading with User Action Control
export const ControlledLoading: StoryFn<typeof CounterInputComponent> = () => {
  const [value, setValue] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleControlledChange = async ({ value: newValue }: { value: number }) => {
    setIsLoading(true);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve(true);
          } else {
            reject(new Error('API call failed'));
          }
        }, 1500);
      });

      setValue(newValue);
      toast.show({
        content: `Successfully changed value to ${newValue}`,
        color: 'positive',
      });
    } catch (error) {
      toast.show({
        content: `Failed to change value. Please try again.`,
        color: 'negative',
      });
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Text size="large" weight="semibold">
        Controlled Loading Example
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        User has full control over when the value changes and loading state. Value only updates
        after successful async operation.
      </Text>
      <CounterInputComponent
        label="API-Controlled Counter"
        value={value}
        onChange={handleControlledChange}
        isLoading={isLoading}
        min={1}
        max={10}
        emphasis="intense"
      />
      <BaseBox display="flex" flexDirection="column" gap="spacing.2">
        <Text size="small" color="surface.text.gray.subtle">
          Current value: {value}
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          Status: {isLoading ? 'Loading...' : 'Ready'}
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          • Loading starts immediately when button is clicked • Value only changes after successful
          API response • Random 50% failure rate to demonstrate error handling
        </Text>
      </BaseBox>
      <ToastContainer />
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
    quantity: 2,
    licenses: 1,
    users: 5,
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
        Multiple counter inputs for payment and subscription management.
      </Text>

      <BaseBox display="flex" flexDirection="column" gap="spacing.4">
        <CounterInputComponent
          label="Product Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleFieldChange('quantity')}
          min={1}
          max={100}
        />

        <CounterInputComponent
          label="API Licenses"
          name="licenses"
          value={formData.licenses}
          onChange={handleFieldChange('licenses')}
          min={1}
          max={20}
        />

        <CounterInputComponent
          label="Team Members"
          name="users"
          value={formData.users}
          onChange={handleFieldChange('users')}
          min={1}
          max={50}
        />
      </BaseBox>

      <BaseBox
        padding="spacing.4"
        backgroundColor="surface.background.gray.intense"
        borderRadius="medium"
      >
        <Text size="small" weight="medium">
          Subscription Details:
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          Quantity: {formData.quantity}, Licenses: {formData.licenses}, Team Members:{' '}
          {formData.users}
        </Text>
      </BaseBox>
    </BaseBox>
  );
};

// CounterInput with Toast Validation Example
export const WithToastValidation: StoryFn<typeof CounterInputComponent> = () => {
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const handleChange = ({ value }: { value: number }): void => {
    setQuantity(value);

    // Simple validation logic with small thresholds
    if (value > 5) {
      toast.show({
        content: `Quantity ${value} exceeds limit of 5!`,
        color: 'negative',
        autoDismiss: true,
        duration: 3000,
      });
    } else if (value >= 3) {
      toast.show({
        content: `Bulk discount applied for ${value} items!`,
        color: 'positive',
        autoDismiss: true,
        duration: 3000,
      });
    }
  };

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <ToastContainer />

      <Text size="large" weight="semibold">
        Validation with Toast Notifications
      </Text>

      <CounterInputComponent
        label="Order Quantity"
        value={quantity}
        onChange={handleChange}
        min={1}
        max={10}
      />

      <BaseBox
        padding="spacing.4"
        backgroundColor="surface.background.gray.intense"
        borderRadius="medium"
      >
        <Text size="small" weight="medium">
          Validation Rules (Small Thresholds):
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          • 1-2 items: No toast
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          • 3-5 items: Success toast - "Bulk discount applied"
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          • 6+ items: Error toast - "Exceeds limit of 5"
        </Text>
      </BaseBox>
    </BaseBox>
  );
};

export default meta;
