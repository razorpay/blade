# ColorInput

## Component Name

ColorInput

## Description

ColorInput is a form input for picking a color. It shows a color swatch, a hex value field, and an optional opacity field. The value is an object with a 6-character hex string and an opacity percentage (0–100). It supports labels, help and validation text, disabled and required states, and controlled or uncontrolled usage. Use it for theme settings, branding configuration, and any form that collects a color.

## Usage Guidelines

- Use `ColorInput` when users must pick or type a color value.
- Set `showOpacity={false}` when opacity is not supported by the consumer of the value.
- Always pass a `label`, or an `accessibilityLabel` when a visible label is not shown.
- Don't use `ColorInput` to choose from a small fixed set of colors. Use `RadioGroup` or `ChipGroup` for that.

## TypeScript Types

The following types define the props that the ColorInput component accepts.

```typescript
type ColorInputValue = {
  /**
   * 6-character uppercase hex string with '#' prefix.
   * @example '#FF5733'
   */
  hex: string;
  /**
   * Integer percentage 0–100
   */
  opacity: number;
};

type ColorInputOnChange = ({ name, value }: { name?: string; value: ColorInputValue }) => void;
type ColorInputOnFocusBlur = ({ name, value }: { name?: string; value: ColorInputValue }) => void;

type ColorInputProps = {
  /**
   * Label to be shown for the input field
   */
  label?: string;
  /**
   * Accessibility label for the input. Required when `label` is not passed
   */
  accessibilityLabel?: string;
  /**
   * Size of the input
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Position of the label relative to the input
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Name of the input field
   */
  name?: string;
  /**
   * Validation state of the input
   * @default 'none'
   */
  validationState?: 'none' | 'error' | 'success';
  /**
   * Text shown when `validationState` is `error`
   */
  errorText?: string;
  /**
   * Text shown when `validationState` is `success`
   */
  successText?: string;
  /**
   * Help text for the input
   */
  helpText?: string;
  /**
   * Shows a required or optional indicator next to the label
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Whether the input is required
   * @default false
   */
  isRequired?: boolean;
  /**
   * Whether the input is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Focuses the input on mount
   * @default false
   */
  autoFocus?: boolean;
  testID?: string;
  /**
   * Value of the input (controlled)
   */
  value?: ColorInputValue;
  /**
   * Initial value of the input (uncontrolled)
   */
  defaultValue?: ColorInputValue;
  /**
   * Callback invoked when the color or opacity changes
   */
  onChange?: ColorInputOnChange;
  /**
   * Callback invoked when the input receives focus
   */
  onFocus?: ColorInputOnFocusBlur;
  /**
   * Callback invoked when the input loses focus
   */
  onBlur?: ColorInputOnFocusBlur;
  /**
   * Whether to show the opacity input
   * @default true
   */
  showOpacity?: boolean;
} & DataAnalyticsAttribute &
  StyledPropsBlade;
```

## Examples

### Controlled ColorInput with Validation

```tsx
import React, { useState } from 'react';
import { ColorInput, Box } from '@razorpay/blade/components';

function BrandColorExample(): React.ReactElement {
  const [color, setColor] = useState({ hex: '#305EFF', opacity: 100 });
  const isTooTransparent = color.opacity < 20;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <ColorInput
        label="Brand color"
        name="brandColor"
        size="medium"
        necessityIndicator="required"
        isRequired
        value={color}
        onChange={({ value }) => setColor(value)}
        helpText="Used for buttons and links on the checkout page"
        validationState={isTooTransparent ? 'error' : 'none'}
        errorText="Opacity must be at least 20%"
      />
    </Box>
  );
}

export default BrandColorExample;
```

### Sizes, Label Position and Without Opacity

```tsx
import React from 'react';
import { ColorInput, Box } from '@razorpay/blade/components';

function ColorInputSizesExample(): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <ColorInput label="XSmall" size="xsmall" defaultValue={{ hex: '#FF5733', opacity: 100 }} />
      <ColorInput label="Small" size="small" defaultValue={{ hex: '#FF5733', opacity: 100 }} />
      <ColorInput label="Medium" size="medium" defaultValue={{ hex: '#33FF57', opacity: 75 }} />
      <ColorInput label="Large" size="large" defaultValue={{ hex: '#3357FF', opacity: 50 }} />
      <ColorInput
        label="Text color"
        labelPosition="left"
        showOpacity={false}
        defaultValue={{ hex: '#000000', opacity: 100 }}
      />
      <ColorInput
        accessibilityLabel="Disabled color"
        isDisabled
        defaultValue={{ hex: '#CCCCCC', opacity: 100 }}
      />
    </Box>
  );
}

export default ColorInputSizesExample;
```
