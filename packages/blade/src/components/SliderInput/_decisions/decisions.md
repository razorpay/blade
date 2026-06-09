# SliderInput

SliderInput is a compound input component that combines a horizontal slider with a numeric text field, allowing users to adjust a value by either dragging the slider thumb or typing directly into the input. It is designed for configurator surfaces where merchants need precise control over a bounded numeric value — for example, adjusting corner radius, spacing, or opacity in the Checkout Studio customization interface.

The component provides real-time two-way sync between the slider and the input field, supports discrete steps with visual tick marks, and follows the same controlled/uncontrolled patterns used by other Blade input components.

## Design

- [Figma - SliderInput](https://www.figma.com/design/azf0t1g6SuGPbzIZwB8YNi/Checkout-Studio---Playground?node-id=2121-82273&t=w0AJVqcXKnaXXPyf-11)

## Anatomy

The SliderInput consists of:

- **Label**: Text label describing the value being controlled (uses `_FormGroupHeader` internally)
- **Slider Track**: Horizontal track showing the range, with a filled portion indicating the current value
- **Slider Thumb**: Draggable circle positioned on the track at the current value
- **Tick Marks**: Optional step indicator dots along the track (shown when `step` is defined and step count is reasonable)
- **Input Field**: Numeric text input displaying the current value with an optional unit suffix

## API

Overall structure of the API showing the main usage pattern with realistic example:

```jsx
import { SliderInput } from '@razorpay/blade/components';

<SliderInput
  label="Corner Radius"
  value={12}
  onChange={({ value }) => setRadius(value)}
  min={0}
  max={24}
  step={2}
  suffix="px"
  size="small"
/>
```

<details>
  <summary>Alternate APIs</summary>

### Alternate API 1 — Compound component (Slider + Input as children)

```jsx
import { Slider, SliderTrack, SliderThumb, SliderInput } from '@razorpay/blade/components';

<Slider value={12} onChange={({ value }) => setRadius(value)} min={0} max={24}>
  <SliderTrack />
  <SliderThumb />
  <SliderInput suffix="px" />
</Slider>
```

- Pros
  - Maximum composability — consumers can rearrange or omit sub-components
  - Follows the compound component pattern used by Tabs and Modal in Blade
- Cons
  - Over-engineered for this use case — the layout is fixed (label → slider → input in a row)
  - Consumers will almost always render the same sub-components in the same order
  - Increases the number of exports and API surface area without clear benefit
  - The Figma design shows a single rigid layout, not a composable one

### Alternate API 2 — Standalone Slider (no coupled input)

```jsx
import { Slider } from '@razorpay/blade/components';

<Slider
  label="Corner Radius"
  value={12}
  onChange={({ value }) => setRadius(value)}
  min={0}
  max={24}
/>
```

- Pros
  - Simpler component — just a slider, no input field complexity
  - Could be composed with a separate TextInput by the consumer
- Cons
  - Loses the two-way sync DX that makes this component valuable
  - Consumers would need to wire up the sync between a separate Slider and TextInput themselves
  - The Figma design explicitly couples the slider and input as a single component
  - Doesn't match the primary use case (configurator surfaces always need the input field)

</details>

### Props

#### SliderInput

```typescript
type SliderInputCommonProps = {
  /**
   * Current value of the slider input (controlled mode)
   */
  value?: number;

  /**
   * Default value when component is uncontrolled
   */
  defaultValue?: number;

  /**
   * Minimum allowed value. The slider track starts at this value.
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value. The slider track ends at this value.
   * @default 100
   */
  max?: number;

  /**
   * Step increment for the slider. When defined, the slider snaps to discrete
   * values and tick marks are rendered along the track (when step count <= 20).
   * @default 1
   */
  step?: number;

  /**
   * Unit suffix displayed inside the input field (e.g. "px", "%", "rem")
   */
  suffix?: string;

  /**
   * Event handler called when the value changes via slider drag, keyboard, or text input
   */
  onChange?: (args: { name?: string; value: number }) => void;

  /**
   * Event handler called when the user begins interacting with the slider (mousedown/touchstart)
   */
  onChangeStart?: (args: { value: number }) => void;

  /**
   * Event handler called when the user finishes interacting with the slider (mouseup/touchend).
   * Useful for committing the value only on drag end rather than on every intermediate value.
   */
  onChangeEnd?: (args: { value: number }) => void;

  /**
   * The name attribute for form integration
   */
  name?: string;

  /**
   * Label position relative to the slider
   * @default 'left'
   */
  labelPosition?: 'top' | 'left';

  /**
   * Size of the component. Affects input height and typography.
   * @default 'small'
   */
  size?: 'small' | 'medium';

  /**
   * Disables the slider and input
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Marks the field as required
   * @default false
   */
  isRequired?: boolean;

  /**
   * State indicating validation status
   * @default 'none'
   */
  validationState?: 'none' | 'error';

  /**
   * Text shown below the component providing guidance
   */
  helpText?: string;

  /**
   * Text shown below the component when validationState is 'error'
   */
  errorText?: string;

  /**
   * Test ID for automation
   */
  testID?: string;
} & StyledPropsBlade;

type SliderInputPropsWithLabel = {
  /**
   * Label describing the value being controlled
   */
  label: string;
  /**
   * Accessibility label for the input (optional override)
   */
  accessibilityLabel?: string;
};

type SliderInputPropsWithA11yLabel = {
  /**
   * Label describing the value being controlled
   */
  label?: undefined;
  /**
   * Accessibility label — required when label is not provided
   */
  accessibilityLabel: string;
};

type SliderInputProps = (SliderInputPropsWithLabel | SliderInputPropsWithA11yLabel) &
  SliderInputCommonProps;
```

## Examples

### Basic Usage

A simple slider with label, range, and unit suffix. The slider and input field stay in sync automatically.

```jsx
import { SliderInput } from '@razorpay/blade/components';

const App = () => {
  const [radius, setRadius] = useState(8);

  return (
    <SliderInput
      label="Corner Radius"
      value={radius}
      onChange={({ value }) => setRadius(value)}
      min={0}
      max={24}
      suffix="px"
    />
  );
};
```

### With Discrete Steps

When `step` is provided, the slider snaps to increments and renders tick marks along the track. Useful for values with a fixed set of valid options.

```jsx
import { SliderInput } from '@razorpay/blade/components';

const App = () => {
  const [opacity, setOpacity] = useState(100);

  return (
    <SliderInput
      label="Opacity"
      value={opacity}
      onChange={({ value }) => setOpacity(value)}
      min={0}
      max={100}
      step={10}
      suffix="%"
    />
  );
};
```

### Uncontrolled Usage

For simpler forms where you only need the final value on submit.

```jsx
import { SliderInput } from '@razorpay/blade/components';

const App = () => {
  return (
    <form onSubmit={handleSubmit}>
      <SliderInput
        label="Border Width"
        name="borderWidth"
        defaultValue={1}
        min={0}
        max={8}
        step={1}
        suffix="px"
      />
      <Button type="submit">Apply</Button>
    </form>
  );
};
```

### Checkout Studio Configurator

Real-world usage in a merchant-facing configurator panel where multiple SliderInputs control visual properties. Uses `onChangeEnd` for performance — applies changes only when the user releases the slider.

```jsx
import { SliderInput } from '@razorpay/blade/components';

const ConfiguratorPanel = () => {
  const [config, setConfig] = useState({
    cornerRadius: 12,
    spacing: 16,
    shadowBlur: 4,
  });

  const updateConfig = (key) => ({ value }) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const applyConfig = (key) => ({ value }) => {
    applyToPreview({ ...config, [key]: value });
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <SliderInput
        label="Corner Radius"
        value={config.cornerRadius}
        onChange={updateConfig('cornerRadius')}
        onChangeEnd={applyConfig('cornerRadius')}
        min={0}
        max={24}
        step={2}
        suffix="px"
      />
      <SliderInput
        label="Spacing"
        value={config.spacing}
        onChange={updateConfig('spacing')}
        onChangeEnd={applyConfig('spacing')}
        min={0}
        max={48}
        step={4}
        suffix="px"
      />
      <SliderInput
        label="Shadow Blur"
        value={config.shadowBlur}
        onChange={updateConfig('shadowBlur')}
        onChangeEnd={applyConfig('shadowBlur')}
        min={0}
        max={20}
        suffix="px"
      />
    </Box>
  );
};
```

### With Validation

Error state when the value falls outside business rules beyond just min/max constraints.

```jsx
import { SliderInput } from '@razorpay/blade/components';

const App = () => {
  const [fontSize, setFontSize] = useState(14);
  const isAccessible = fontSize >= 12;

  return (
    <SliderInput
      label="Font Size"
      value={fontSize}
      onChange={({ value }) => setFontSize(value)}
      min={8}
      max={32}
      suffix="px"
      validationState={isAccessible ? 'none' : 'error'}
      errorText="Font size below 12px does not meet accessibility standards"
    />
  );
};
```

### Disabled State

```jsx
<SliderInput
  label="Corner Radius"
  value={8}
  min={0}
  max={24}
  suffix="px"
  isDisabled
/>
```

## Accessibility

- **ARIA Role**: The slider uses `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext` (includes suffix, e.g. "12 px")
- **Keyboard Navigation**: Arrow keys (Left/Down to decrement, Right/Up to increment), Home/End to jump to min/max. When `step` is defined, Page Up/Page Down move by `step * 10` for faster navigation.
- **Focus Management**: Tab moves focus between the slider thumb and the text input. Both elements have visible focus rings.
- **Label Association**: The label is linked to the slider via `aria-labelledby` and to the input via the standard `<label>` element
- **Screen Reader Announcements**: Value changes are announced with the unit suffix (e.g. "Corner Radius: 12 px")
- **Disabled State**: Both slider and input receive `aria-disabled="true"` and are removed from the tab order

## Open Questions

- **Should we also ship a standalone `Slider` component?** The current proposal bundles the slider with the input. A standalone `Slider` (without the input field) could be useful for simpler use cases like volume controls. We could extract the track/thumb as internal sub-components and expose a `Slider` in a follow-up.
- **React Native support**: The initial implementation targets web only. React Native would require a gesture handler (react-native-gesture-handler) for drag interactions. Should this be scoped for the first version?
- **Input width**: The Figma design shows a fixed-width input field. Should we expose an `inputWidth` prop for cases where the value + suffix might be wider (e.g. "1000 px"), or keep it fixed and truncate?
- **Tick mark rendering threshold**: Currently proposed to auto-render ticks when `(max - min) / step <= 20`. Is this the right threshold, or should we expose a `showTicks` boolean for explicit control?
