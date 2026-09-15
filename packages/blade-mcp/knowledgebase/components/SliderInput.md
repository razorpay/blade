# SliderInput

## Component Name

SliderInput

## Description

SliderInput lets users pick one numeric value from a continuous or stepped range by dragging a thumb along a track, clicking the track, or using the keyboard. It supports optional tick markers, a scale of value labels, a value indicator above the thumb, custom value formatting, and the standard Blade form field features (label, help text, validation states). It supports controlled and uncontrolled usage, and fires `onChange` on every move and `onChangeEnd` once when an interaction commits.

## Usage Guidelines

**Do**

- Use `SliderInput` when the exact value matters less than its relative position in a range (e.g., volume, opacity, corner radius, budget range).
- Use `step` with `showMarkers` and `showScale` when users must pick from a small set of discrete values.
- Use `formatValue` to show units or currency (e.g., `%`, `px`, `₹`). It applies to the scale, the value indicator and `aria-valuetext`.
- Use `onChangeEnd` for network calls and other expensive work. Use `onChange` only for live display.
- Pair with a `TextInput` (shared state) when users also need to type an exact value.

**Don't**

- Don't use `SliderInput` when users need to enter a precise value in a large range — use `TextInput` or `CounterInput`.
- Don't use `SliderInput` to select a range with two thumbs — it supports a single value only.
- Don't use `SliderInput` for small integer quantities with a few options — use `CounterInput` or `RadioGroup`.
- Don't use `SliderInput` without a `label` or `accessibilityLabel`.

## TypeScript Types

These types define the props that the SliderInput component accepts.

```typescript
type SliderInputProps = {
    /**
     * Label to be shown for the slider
     */
    label?: string;

    /**
     * Position of the label
     *
     * @default 'top'
     */
    labelPosition?: 'top' | 'left';

    /**
     * Displays `(optional)` or `*` next to the label
     *
     * @default 'none'
     */
    necessityIndicator?: 'required' | 'optional' | 'none';

    /**
     * Help text shown below the slider
     */
    helpText?: string;

    /**
     * Error text shown when `validationState` is `error`
     */
    errorText?: string;

    /**
     * Success text shown when `validationState` is `success`
     */
    successText?: string;

    /**
     * Validation state of the slider
     *
     * @default 'none'
     */
    validationState?: 'success' | 'error' | 'none';

    /**
     * Name of the input, forwarded in callbacks
     */
    name?: string;

    /**
     * Disables the slider
     *
     * @default false
     */
    isDisabled?: boolean;

    /**
     * Marks the slider as required
     *
     * @default false
     */
    isRequired?: boolean;

    /**
     * Accessible label when there is no visible label
     */
    accessibilityLabel?: string;

    /**
     * Called when the thumb receives focus.
     */
    onFocus?: (args: { name?: string; value: number }) => void;

    /**
     * Called when the thumb loses focus.
     */
    onBlur?: (args: { name?: string; value: number }) => void;

    /**
     * The value of the slider, in controlled mode.
     *
     * Always snapped to `step` before it is rendered, so a value that does not sit on a step
     * will move the thumb to the nearest one.
     */
    value?: number;

    /**
     * The initial value when the slider is uncontrolled.
     */
    defaultValue?: number;

    /**
     * Called on every change, including each pointer move during a drag.
     *
     * Bind live display to this. For anything expensive, use `onChangeEnd` instead.
     */
    onChange?: (args: { name?: string; value: number }) => void;

    /**
     * Called once when an interaction commits: on pointer release, or on the key up of a
     * keyboard adjustment. Use this for network calls and other expensive work.
     */
    onChangeEnd?: (args: { name?: string; value: number }) => void;

    /**
     * Lowest selectable value.
     *
     * @default 0
     */
    min?: number;

    /**
     * Highest selectable value. Always reachable, even when it is not a whole number of
     * `step`s away from `min`.
     *
     * @default 100
     */
    max?: number;

    /**
     * The increment between selectable values. This is a step size, not a number of steps:
     * `step={10}` over 0-100 gives 11 selectable values.
     *
     * @default 1
     */
    step?: number;

    /**
     * Shows tick markers on the track, one per step.
     *
     * Markers are dropped automatically when the track is too narrow to space them out.
     *
     * @default false
     */
    showMarkers?: boolean;

    /**
     * Shows a row of value labels beneath the track.
     *
     * @default false
     */
    showScale?: boolean;

    /**
     * When false, the scale renders only `min` and `max` rather than a label per step.
     *
     * @default true
     */
    showScaleValues?: boolean;

    /**
     * Formats the value wherever it is displayed: the scale labels, the value indicator and
     * `aria-valuetext`.
     */
    formatValue?: (value: number) => string;

    /**
     * Shows a readout above the thumb on hover, focus and drag.
     *
     * @default true
     */
    showValueIndicator?: boolean;
  } & StyledPropsBlade &
  DataAnalyticsAttribute &
  TestID;

export type { SliderInputProps };
```

## Examples

### Basic, Stepped and Formatted SliderInput

```tsx
import React from 'react';
import { SliderInput, Box } from '@razorpay/blade/components';

function SliderInputExample(): React.ReactElement {
  const [volume, setVolume] = React.useState(40);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="400px">
      {/* Controlled, continuous */}
      <SliderInput
        label="Volume"
        name="volume"
        value={volume}
        onChange={({ value }) => setVolume(value)}
        onChangeEnd={({ value }) => console.log('Save volume', value)}
        helpText="Drag to adjust the output level"
      />

      {/* Uncontrolled, stepped with markers and scale */}
      <SliderInput
        label="Corner Radius"
        labelPosition="left"
        min={0}
        max={40}
        step={8}
        defaultValue={16}
        showMarkers
        showScale
      />

      {/* Formatted values */}
      <SliderInput
        label="Budget"
        min={0}
        max={5000}
        step={1000}
        defaultValue={2000}
        showMarkers
        showScale
        formatValue={(value) => `₹${value / 1000}k`}
      />

      {/* Only min and max labels on the scale */}
      <SliderInput label="Opacity" step={10} showScale showScaleValues={false} defaultValue={70} />

      {/* Validation and disabled states */}
      <SliderInput
        label="Discount"
        necessityIndicator="required"
        isRequired
        validationState="error"
        errorText="Discount is too high"
        defaultValue={90}
        formatValue={(value) => `${value}%`}
      />
      <SliderInput label="Disabled" isDisabled defaultValue={30} showValueIndicator={false} />
    </Box>
  );
}
```
