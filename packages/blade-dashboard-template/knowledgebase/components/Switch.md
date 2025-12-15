## Component Name

Switch

## Description

A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turns the switch on/off. The component supports controlled and uncontrolled modes, different sizes, and accessibility features to ensure proper screen reader support.

## TypeScript Types

The following types represent the props that the Switch component accepts. These types are essential for properly implementing and using the Switch component in your applications.

```typescript
type OnChange = ({
  isChecked,
  value,
  event,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

type SwitchProps = {
  /**
   * If `true`, The switch will be checked. This also makes the switch controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the switch will be initially checked. This also makes the switch uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Switch` changes.
   */
  onChange?: OnChange;
  /**
   * The name of the input field in a switch
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the switch input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the switch will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the switch
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
  /**
   * Provides accessible label for internal checkbox component that sets the aria-label prop for screen readers.
   */
  accessibilityLabel: string;
  /**
   * The id of the input field in a switch, useful for associating a label element with the input via htmlFor prop
   */
  id?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;
```

## Example

### Basic Usage

This example demonstrates the basic usage of the Switch component with essential props:

```tsx
import React from 'react';
import { Switch } from '@razorpay/blade/components';

function BasicExample() {
  return (
    <Switch
      accessibilityLabel="Toggle dark mode"
      onChange={(e) => console.log('Switch toggled:', e.isChecked)}
    />
  );
}

export default BasicExample;
```
