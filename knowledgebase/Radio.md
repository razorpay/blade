## Component Name

Radio & RadioGroup

## Description

The Radio and RadioGroup components are used in forms when a user needs to select a single value from multiple options. RadioGroup serves as a container for Radio components, allowing users to make a single selection from a set of options. It handles state management and provides accessible markup with features like validation states, help text, and various size options.

## TypeScript Types

These types represent the props that the component accepts. When using the Radio component along with RadioGroup, you'll need to understand these types to properly configure them.

```typescript
type RadioProps = {
  /**
   * Sets the label text of the Radio
   */
  children?: StringChildrenType;
  /**
   * Help text for the Radio
   */
  helpText?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * If `true`, the Radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the radios
   *
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;

type RadioGroupProps = {
  /**
   * Accepts multiple radios as children
   */
  children: React.ReactNode;
  /**
   * Help text of the radio group
   */
  helpText?: string;
  /**
   * Error text of the radio group
   * Renders when `validationState` is set to 'error'
   *
   * Overrides helpText
   */
  errorText?: string;
  /**
   * Sets the error state of the radioGroup
   * If set to `error` it will render the `errorText` of the group,
   * and propagate `invalid` prop to every radio
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after radioGroup label
   *
   * If set to `undefined` it renders nothing.
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the radioGroup
   * If set to `true` it propagate down to all the radios
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the radioGroup
   * @default false
   */
  isRequired?: boolean;
  /**
   * Renders the label of the radio group
   */
  label?: string;
  /**
   * Sets the position of the label
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial value of the radio group
   */
  defaultValue?: string;
  /**
   * value of the radio group
   *
   * Use `onChange` to update its value
   */
  value?: string;
  /**
   * The callback invoked when any of the radio's state changes
   */
  onChange?: ({
    name,
    value,
    event,
  }: {
    name: string | undefined;
    value: string;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => void;
  /**
   * The name of the input field in a radio
   * (Useful for form submission).
   */
  name?: string;
  /**
   * Size of the radios
   *
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event: React.ChangeEvent;
  value?: string;
}) => void;

type RadioGroupContextType = Pick<
  RadioGroupProps,
  | 'validationState'
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'necessityIndicator'
  | 'size'
> & { state?: State };
```

## Example

### Basic Usage

```tsx
import { RadioGroup, Radio } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function BasicRadioExample() {
  const handleChange = ({ name, value }) => {
    console.log(`Selected ${value} for ${name}`);
  };

  return (
    <Box gap="spacing.5">
      {/* Standard RadioGroup with different sizes and states */}
      <RadioGroup
        label="Where do you want to collect payments?"
        helpText="Select only one option"
        name="payment-collection"
        onChange={handleChange}
        defaultValue="website"
        necessityIndicator="required"
      >
        <Radio value="website">Website</Radio>
        <Radio value="android">Android App</Radio>
        <Radio value="ios">iOS App</Radio>
        <Radio value="social-media" helpText="Like WhatsApp, Facebook, Instagram">
          Social Media
        </Radio>
        <Radio value="offline-store" isDisabled>
          Offline Store
        </Radio>
      </RadioGroup>
    </Box>
  );
}
```

### Controlled Radio Example

```tsx
import { RadioGroup, Radio } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { useState } from 'react';

function ControlledRadioExample() {
  const [selected, setSelected] = useState('apple');

  return (
    <Box>
      <RadioGroup
        label="Select your favorite fruit"
        helpText={`You selected: ${selected}`}
        name="fruits"
        value={selected}
        onChange={({ value }) => setSelected(value)}
        size="medium"
        labelPosition="left"
      >
        <Radio value="apple" helpText="Apples are 25% air">
          Apple
        </Radio>
        <Radio value="mango" helpText="The name 'mango' originated in India">
          Mango
        </Radio>
        <Radio value="orange" helpText="There are over 600 varieties of oranges">
          Orange
        </Radio>
      </RadioGroup>
    </Box>
  );
}
```
