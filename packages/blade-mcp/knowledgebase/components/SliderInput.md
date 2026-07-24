## Component Name

SliderInput

## Description

SliderInput is a horizontal slider component coupled with a numeric input field for bounded value selection. It supports controlled and uncontrolled modes, keyboard navigation, touch/drag interaction, discrete stepping with auto-rendered tick marks, and accessibility features including ARIA slider role, labeledby, and describedby. Primarily designed for configurator UIs where users adjust numeric properties like corner radius, opacity, or spacing.

## Important Constraints

- Either `label` or `accessibilityLabel` must be provided — at least one is required for accessibility.
- `step` must be a positive number; if omitted, defaults to `1`.
- When `step` is provided and `(max - min) / step` is an integer ≤ 20, tick marks are auto-rendered on the track.
- `validationState` of `'error'` requires `errorText` to display the error message; `'success'` requires `successText`.
- The native (React Native) implementation is not yet available and will throw an error if used.
- `suffix` only supports a trailing unit label (e.g. 'px', '%'); a leading prefix is not supported in v1.

## TypeScript Types

These types define the props that the SliderInput component accepts, allowing you to configure the component when using it in your application.

```typescript
type SliderInputBaseProps = Pick<
  BaseInputProps,
  'labelPosition' | 'name' | 'isDisabled' | 'isRequired' | 'testID' | keyof DataAnalyticsAttribute
> & {
  onFocus?: (args: { name?: string; value: number }) => void;
  onBlur?: (args: { name?: string; value: number }) => void;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  size?: 'medium' | 'large';
  necessityIndicator?: 'required' | 'optional' | 'none';
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
  successText?: string;
  onChangeStart?: (args: { value: number }) => void;
  onChangeEnd?: (args: { value: number }) => void;
  onChange?: (args: { value: number }) => void;
} & StyledPropsBlade;

type SliderInputPropsWithLabel = {
  label: string;
  accessibilityLabel?: string;
};

type SliderInputPropsWithA11yLabel = {
  label?: undefined;
  accessibilityLabel: string;
};

export type SliderInputProps = (SliderInputPropsWithLabel | SliderInputPropsWithA11yLabel) &
  SliderInputBaseProps;
```

## Usage Guidelines

- Use `onChange` for real-time value tracking during drag; use `onChangeEnd` for performance-critical scenarios where you only need the final committed value.
- Provide `helpText` to guide users on acceptable value ranges or units.
- Use `validationState` with `errorText` to indicate when a value falls outside acceptable bounds.
- Prefer `labelPosition="top"` for most use cases; use `"left"` only when horizontal space is constrained and the label is short.
- When using `suffix`, keep it short (e.g. 'px', '%', 'rem') to avoid layout overflow in the numeric input.
- Do not use SliderInput for unbounded values — it requires `min` and `max` bounds.
- Do not use SliderInput for precise decimal input where the slider step doesn't align — use a TextInput instead.
- The component supports both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) modes; pick one and stick with it.
