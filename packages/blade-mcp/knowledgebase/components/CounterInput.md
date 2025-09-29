# CounterInput

## Component Name

CounterInput

## Description

CounterInput is a specialized numerical input component that allows users to increment or decrement values using built-in plus/minus button controls alongside manual text input. It provides automatic value constraint enforcement with min/max limits, supports both controlled and uncontrolled usage patterns, and includes loading states with visual feedback. The component is designed for scenarios like quantity selection, subscription management, and any numerical value adjustment with clear boundaries.

## Important Constraints

- CounterInput component is **not available for React Native** - throws an error when used in native applications
- Values are automatically constrained between `min` and `max` bounds when provided
- Invalid or non-numeric input values are automatically converted to the `min` value
- Increment button is disabled when value reaches the `max` limit (if specified)
- Decrement button is disabled when value reaches the `min` limit
- Component is disabled for all interactions when `isLoading` or `isDisabled` is true
- `labelPosition="left"` only applies on desktop devices, falls back to top on mobile

## TypeScript Types

These types define the props that the CounterInput component accepts, along with its context types for internal state management.

```typescript
type CounterInputCommonProps = Pick<
  BaseInputProps,
  | 'labelPosition'
  | 'name'
  | 'onFocus'
  | 'onBlur'
  | 'isDisabled'
  | 'testID'
  | keyof DataAnalyticsAttribute
> & {
  /**
   * Accessibility label for the input (optional override)
   */
  accessibilityLabel?: string;
  /**
   * Label to be shown for the counter input
   */
  label?: string;

  /**
   * The numerical value of the counter input
   */
  value?: number;

  /**
   * The default numerical value when component is uncontrolled
   */
  defaultValue?: number;

  /**
   * Minimum allowed value. When reached, the decrement button will be disabled
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value. When reached, the increment button will be disabled
   * If not provided, the increment button will not be disabled
   */
  max?: number;

  /**
   * Visual emphasis of the counter input
   * @default 'subtle'
   */
  emphasis?: 'subtle' | 'intense';

  /**
   * Size of the counter input
   * @default 'medium'
   */
  size?: 'xsmall' | 'medium' | 'large';

  /**
   * Decides whether to show a loading spinner and disable interaction
   * @default false
   */
  isLoading?: boolean;

  /**
   * Event handler called when the value changes via increment, decrement, or manual input
   */
  onChange?: (args: { value: number }) => void;
} & StyledPropsBlade &
  MotionMetaProp;

export type CounterInputProps = CounterInputCommonProps;

type CounterInputContextType = {
  /**
   * Size of the counter input
   */
  size?: CounterInputProps['size'];
  /**
   * Visual emphasis of the counter input
   */
  emphasis?: CounterInputProps['emphasis'];
  /**
   * Whether the counter input is disabled
   */
  isDisabled?: boolean;
  /**
   * Whether the counter input is in loading state
   */
  isLoading?: boolean;
  /**
   * Color of the counter input
   */
  color?: BaseTextProps['color'];
  /**
   * Disabled color text of the counter input
   */
  disabledTextColor?: BaseTextProps['color'];
  /**
   * Whether the counter input is inside an input group
   */
  isInsideCounterInput?: boolean;
};

export type { CounterInputContextType };
```

## Examples

### Size and Emphasis Variations

```jsx
import { CounterInput, Box } from '@razorpay/blade/components';
import { useState } from 'react';

function SizeEmphasisExample() {
  const [values, setValues] = useState({
    xsmall: 1,
    medium: 5,
    large: 10,
    intense: 3,
  });

  const handleChange = (key) => ({ value }) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <CounterInput
        label="XSmall Size"
        size="xsmall"
        emphasis="subtle"
        value={values.xsmall}
        onChange={handleChange('xsmall')}
        min={0}
        max={20}
        name="xsmall-counter"
        testID="xsmall-counter"
      />

      <CounterInput
        label="Medium Size (Default)"
        size="medium"
        emphasis="subtle"
        value={values.medium}
        onChange={handleChange('medium')}
        min={0}
        max={20}
        labelPosition="top"
      />

      <CounterInput
        label="Large Size with Left Label"
        size="large"
        emphasis="intense"
        labelPosition="left"
        value={values.large}
        onChange={handleChange('large')}
        min={0}
        max={20}
        onFocus={() => console.log('Large counter focused')}
        onBlur={() => console.log('Large counter blurred')}
      />

      <CounterInput
        accessibilityLabel="Counter without visible label using intense emphasis"
        emphasis="intense"
        value={values.intense}
        onChange={handleChange('intense')}
        min={0}
        max={20}
      />
    </Box>
  );
}
```

### Loading, Disabled, and Min/Max States

```jsx
import { CounterInput, Box } from '@razorpay/blade/components';
import { useState } from 'react';

function StateExample() {
  const [quantity, setQuantity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ value }) => {
    setIsLoading(true);
    setQuantity(value);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <CounterInput
        label="Loading State Counter"
        value={quantity}
        onChange={handleChange}
        isLoading={isLoading}
        min={1}
        max={10}
        emphasis="intense"
        size="medium"
      />

      <CounterInput
        label="Disabled Counter"
        value={3}
        onChange={() => {}}
        isDisabled={true}
        min={0}
        max={20}
        emphasis="subtle"
      />

      <CounterInput
        label="Uncontrolled with Default Value"
        defaultValue={7}
        min={5}
        max={15}
        onChange={({ value }) => console.log('Value changed:', value)}
        name="uncontrolled-counter"
      />
    </Box>
  );
}
```
