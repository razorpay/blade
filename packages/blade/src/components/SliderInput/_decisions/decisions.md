# SliderInput

SliderInput is a compound input component that combines a horizontal slider with a numeric text field, allowing users to adjust a value by either dragging the slider thumb or typing directly into the input. It is designed for configurator surfaces where merchants need precise control over a bounded numeric value — for example, adjusting corner radius, spacing, or opacity in the Checkout Studio customization interface.

The component provides real-time two-way sync between the slider and the input field, supports discrete steps with visual tick marks, and follows the same controlled/uncontrolled patterns used by other Blade input components (CounterInput, TextInput, FileUpload).

## Design

- [Figma - SliderInput](https://www.figma.com/design/azf0t1g6SuGPbzIZwB8YNi/Checkout-Studio---Playground?node-id=2161-86083&t=w0AJVqcXKnaXXPyf-11)
- [M3 Sliders Reference](https://m3.material.io/components/sliders/overview)
- [WAI-ARIA Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)

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
  size="medium"
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

**Recommendation:** Start with the flat `SliderInput` API. If a standalone `Slider` is needed later, the internal track/thumb sub-components can be extracted and exposed without breaking changes.

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
   * values and tick marks are rendered along the track (auto-hidden when step
   * count exceeds 20 to avoid visual clutter).
   * @default 1
   */
  step?: number;

  /**
   * Unit suffix displayed inside the input field (e.g. "px", "%", "rem")
   */
  suffix?: string;

  /**
   * Event handler called when the value changes via slider drag, keyboard,
   * or text input
   */
  onChange?: (args: { value: number }) => void;

  /**
   * Event handler called when the user begins interacting with the slider
   * (mousedown / touchstart on thumb or track click)
   */
  onChangeStart?: (args: { value: number }) => void;

  /**
   * Event handler called when the user finishes interacting with the slider
   * (mouseup / touchend). Useful for committing the value only on drag end
   * rather than on every intermediate value.
   */
  onChangeEnd?: (args: { value: number }) => void;

  /**
   * The name attribute for form integration
   */
  name?: string;

  /**
   * Label position relative to the slider.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';

  /**
   * Size of the component. Affects input height, thumb size, and typography.
   * @default 'medium'
   */
  size?: 'medium' | 'large';

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
   * Renders a necessity indicator after the label
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * State indicating validation status
   * @default 'none'
   */
  validationState?: 'none' | 'error' | 'success';

  /**
   * Text shown below the component when validationState is 'success'
   */
  successText?: string;

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

### Key API Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Component name** | `SliderInput` | Communicates the compound nature (slider + input). A standalone `Slider` can be added later. |
| **`onChange` signature** | `({ value }) => void` | Matches CounterInput — the closest analog numeric input component. |
| **`onChangeStart` / `onChangeEnd`** | Same `({ value }) => void` shape | All three callbacks use identical arg shape for consistency. |
| **`size` values** | `'medium' \| 'large'` | Aligns with Blade's canonical size vocabulary. `medium` = 36px, `large` = 48px. `xsmall` is excluded because the slider thumb requires a 48px touch target (WCAG 2.5.5) regardless of visual size — `medium` is already the smallest practical size for this touch target constraint. |
| **`labelPosition` default** | `'top'` | Matches all other Blade input components. Consumers opt into `'left'` explicitly. |
| **Standalone Slider** | Deferred to follow-up | Start with `SliderInput`; extract internal track/thumb as `Slider` later if needed. |
| **React Native** | Web-only for v1 | RN requires `react-native-gesture-handler` for drag; scope separately. |
| **Tick marks** | Auto-render when `(max - min) / step <= 20` | Avoids visual clutter. No `showTicks` prop needed — the heuristic covers all practical cases. |
| **Input width** | Fixed width, auto-sized to `max` value + suffix | Prevents layout shift. Truncates with ellipsis if value overflows. |

## Component Variants

| Variant | Description | In Scope |
|---------|-------------|----------|
| **Continuous** | Selects any value in range, no snapping | Yes |
| **Discrete (Stepped)** | Snaps to `step` increments, shows tick marks | Yes |
| **Centered** | Zero at middle, supports positive/negative ranges | No |
| **Range (Multi-thumb)** | Two thumbs for selecting min and max | No |

## States

### State Matrix

Every interactive sub-element must have these states defined. This follows the [M3 interaction states model](https://m3.material.io/foundations/interaction/states/applying-states) and the [WAI-ARIA slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/).

| | **Enabled (Default)** | **Hovered** | **Focused** | **Pressed / Dragging** | **Disabled** | **Error** |
|---|---|---|---|---|---|---|
| **Thumb** | Solid fill, 16px circle | + Halo ring (~40px, 8% opacity overlay) | + Focus ring (2px primary border) | + Scale to 20px, halo intensifies (12% opacity) | Muted fill, `opacity.6`, no halo, `cursor: not-allowed` | — |
| **Active Track** | Solid fill | — | — | — | Muted, `opacity.6` | — |
| **Inactive Track** | Subtle background (~9% opacity) | — | — | — | Muted, `opacity.6` | — |
| **Tick Marks** | Visible (contrast with respective track) | — | — | — | Muted, `opacity.6` | — |
| **Input Field** | Default border | Border: `highlighted` | Border: `primary.default` + focus ring | — | Muted bg + border, `cursor: not-allowed` | Border: `negative.default` (red) |
| **Label** | Muted text color | — | — | — | Dimmed, `opacity.6` | — |
| **Help/Error Text** | Muted text / hidden | — | — | — | Dimmed | Error text visible (red) |

### Thumb States Detail

```
┌─────────────────────────────────────────────────────────┐
│ DEFAULT        HOVERED        FOCUSED        PRESSED    │
│                                                         │
│   ●              ◉              ◎              ◉        │
│  16px        16px+halo     16px+ring      20px+halo     │
│  solid       +8% overlay   +2px primary   +12% overlay  │
│  black       bg circle     border ring    scale up      │
│                                                         │
│ DISABLED                                                │
│   ●                                                     │
│  16px, muted fill, opacity.6                            │
└─────────────────────────────────────────────────────────┘
```

### Track States Detail

```
┌─────────────────────────────────────────────────────────┐
│ ENABLED                                                 │
│  ████████████░░░░░░░░░░░░░░░                            │
│  ← active →   ← inactive →                             │
│  solid black   9% opacity gray                          │
│                                                         │
│ WITH GAP (M3 pattern)                                   │
│  ████████████ · ○ · ░░░░░░░░░░░░                        │
│              ↑ 6px gap around thumb                      │
│              rounded inside corners (2px)                │
│                                                         │
│ DISABLED                                                │
│  ████████████░░░░░░░░░░░░░░░                            │
│  both tracks at opacity.6                               │
└─────────────────────────────────────────────────────────┘
```

### Input Field States Detail

```
┌─────────────────────────────────────────────────────────┐
│ DEFAULT         HOVERED         FOCUSED         ERROR   │
│ ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐│
│ │ 12 px  │     │ 12 px  │     │ 12 px  │     │ 12 px  ││
│ └────────┘     └────────┘     └────────┘     └────────┘│
│ gray border   dark border    primary border  red border │
│ 1px           1px            1px             1px        │
│                                                         │
│ DISABLED                                                │
│ ┌────────┐                                              │
│ │ 12 px  │  muted bg, muted border, dimmed text         │
│ └────────┘                                              │
└─────────────────────────────────────────────────────────┘
```

## Interaction Patterns

### Mouse / Pointer

| Interaction | Behavior |
|-------------|----------|
| **Drag thumb** | Value updates continuously (snaps to `step` if defined). Input field syncs in real-time. Fires `onChangeStart` on mousedown, `onChange` on every value change, `onChangeEnd` on mouseup. |
| **Click track** | Thumb jumps to clicked position immediately. Value snaps to nearest `step`. Fires `onChangeStart` → `onChange` → `onChangeEnd` in sequence. |
| **Type in input** | Slider thumb moves to match. Value is clamped to `[min, max]` on blur. Fires `onChange` on blur with clamped value. |
| **Hover thumb** | Halo ring appears (8% opacity overlay, ~40px). Cursor changes to `grab`. |
| **Hover track** | Cursor changes to `pointer` (indicates click-to-jump). |

### Keyboard (follows WAI-ARIA slider pattern)

| Key | Behavior |
|-----|----------|
| **Right Arrow / Up Arrow** | Increase value by one `step` |
| **Left Arrow / Down Arrow** | Decrease value by one `step` |
| **Home** | Set to `min` value |
| **End** | Set to `max` value |
| **Page Up** | Increase by `step * 10` (large jump) |
| **Page Down** | Decrease by `step * 10` (large jump) |
| **Tab** | Move focus: slider thumb → input field (standard tab order) |

### Touch

| Interaction | Behavior |
|-------------|----------|
| **Touch & drag thumb** | Same as mouse drag. Touch target is 48px minimum (even though visual thumb is 16px). |
| **Tap track** | Same as click track — thumb jumps to tapped position. |

### Two-Way Sync Logic

```
┌──────────────┐     onChange({ value })     ┌──────────────┐
│              │ ──────────────────────────→  │              │
│   Slider     │                              │  Input Field │
│   (drag)     │ ←──────────────────────────  │  (type)      │
│              │     onChange({ value })       │              │
└──────────────┘                              └──────────────┘
                         ↓
              Value clamped to [min, max]
              Snapped to nearest step
              Fires onChange with final value
```

- **Slider → Input**: Updates on every drag tick (real-time)
- **Input → Slider**: Updates on blur (after user finishes typing), not on every keystroke
- **Clamping**: If user types a value outside `[min, max]`, it is clamped on blur
- **Invalid input**: Non-numeric input is rejected (reverts to previous valid value on blur)

## Token Mapping

### Colors

| Element | State | Blade Token | Resolved Value |
|---------|-------|-------------|----------------|
| **Active track** | Enabled | `surface.icon.staticBlack.normal` | `#000000` |
| **Active track** | Disabled | `surface.icon.staticBlack.normal` + `opacity.6` | — |
| **Inactive track** | Enabled | `feedback.background.neutral.subtle` | `rgba(67,75,81,0.09)` |
| **Inactive track** | Disabled | `feedback.background.neutral.subtle` + `opacity.6` | — |
| **Thumb fill** | Enabled | `surface.icon.staticBlack.normal` | `#000000` |
| **Thumb stroke** | Enabled | `surface.background.gray.intense` (white) | `#FFFFFF` |
| **Thumb halo** | Hovered | `surface.icon.staticBlack.normal` @ 8% opacity | — |
| **Thumb halo** | Pressed | `surface.icon.staticBlack.normal` @ 12% opacity | — |
| **Thumb focus ring** | Focused | `interactive.border.primary.default` | — |
| **Tick marks (on active track)** | Enabled | `feedback.background.neutral.subtle` | Contrast with active |
| **Tick marks (on inactive track)** | Enabled | `surface.icon.staticBlack.normal` | Contrast with inactive |
| **Input border** | Default | `interactive.border.gray.default` | `#DEE1E3` |
| **Input border** | Hovered | `interactive.border.gray.highlighted` | — |
| **Input border** | Focused | `interactive.border.primary.default` | — |
| **Input border** | Error | `interactive.border.negative.default` | — |
| **Input border** | Disabled | `interactive.border.gray.disabled` | — |
| **Input background** | Default | `surface.background.gray.intense` | `#FFFFFF` |
| **Input background** | Disabled | `surface.background.gray.subtle` | — |
| **Label text** | Enabled | `surface.text.gray.muted` | `#616D75` |
| **Value text** | Enabled | `interactive.text.gray.normal` | `#050505` |
| **Suffix text** | Enabled | `surface.text.gray.muted` | `#616D75` |
| **Error text** | Error | `feedback.text.negative.intense` | — |
| **Help text** | Enabled | `surface.text.gray.muted` | — |

### Spacing

| Property | Blade Token | Value |
|----------|-------------|-------|
| Label → Slider gap | `spacing.3` | 8px |
| Slider → Input gap | `spacing.3` | 8px |
| Input internal padding (horizontal) | `spacing.3` | 8px |
| Input internal padding (vertical) | `spacing.3` | 8px |
| Tick mark interval | Computed: `trackWidth / ((max - min) / step)` | Dynamic |
| Thumb track gap (M3) | Hardcoded | 6px |

### Sizing

| Property | `medium` | `large` |
|----------|----------|---------|
| Component height | 36px | 48px |
| Input field height | 36px | 48px |
| Track height | 4px | 4px |
| Track border radius | `borderRadius.max` (9999px) | `borderRadius.max` (9999px) |
| Thumb diameter (default) | 16px | 20px |
| Thumb diameter (pressed) | 20px | 24px |
| Thumb touch target | 48px | 48px |
| Tick mark diameter | 2px | 4px |
| Input border radius | `borderRadius.large` (8px) | `borderRadius.large` (8px) |
| Input border width | `borderWidth.thin` (1px) | `borderWidth.thin` (1px) |
| Label typography | `Body/SmallMedium` (12px/500) | `Body/MediumMedium` (14px/500) |
| Value typography | `Body/SmallMedium` (12px/500) | `Body/MediumMedium` (14px/500) |
| Suffix typography | `Body/SmallRegular` (12px/400) | `Body/MediumRegular` (14px/400) |

### Motion

| Transition | Duration Token | Easing Token |
|------------|---------------|--------------|
| Thumb position (value change) | `motion.duration.quick` (200ms) | `motion.easing.standard` |
| Halo appear/disappear | `motion.duration.xquick` (160ms) | `motion.easing.entrance` / `motion.easing.exit` |
| Thumb scale (press/release) | `motion.duration.xquick` (160ms) | `motion.easing.standard` |
| Track fill update | Instant (follows thumb) | — |
| Focus ring (input) | `motion.duration.xgentle` (640ms) | `motion.easing.emphasized` |
| Border color transition (input) | `motion.duration.gentle` (480ms) | `motion.easing.standard` |

### Contrast Requirements

- Active track vs inactive track: ≥ 3:1 contrast ratio with background
- Tick marks on active track must contrast with active track at ≥ 3:1
- Tick marks on inactive track must contrast with inactive track at ≥ 3:1
- Thumb must contrast with both track segments at ≥ 3:1

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

### ARIA Attributes

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Slider thumb | `"slider"` |
| `aria-valuemin` | Slider thumb | Value of `min` prop |
| `aria-valuemax` | Slider thumb | Value of `max` prop |
| `aria-valuenow` | Slider thumb | Current numeric value |
| `aria-valuetext` | Slider thumb | `"{value} {suffix}"` (e.g. "12 px") — provides screen reader context |
| `aria-labelledby` | Slider thumb | ID of the label element |
| `aria-orientation` | Slider thumb | `"horizontal"` (omitted — default) |
| `aria-disabled` | Slider thumb + Input | `"true"` when `isDisabled` |
| `aria-describedby` | Component root | ID of help/error text element |
| `aria-invalid` | Input field | `"true"` when `validationState="error"` |

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| **Right Arrow / Up Arrow** | Increase value by one `step` |
| **Left Arrow / Down Arrow** | Decrease value by one `step` |
| **Home** | Set to `min` value |
| **End** | Set to `max` value |
| **Page Up** | Increase by `step * 10` |
| **Page Down** | Decrease by `step * 10` |
| **Tab** | Move focus: slider thumb → input field |
| **Shift + Tab** | Move focus: input field → slider thumb |

### Focus Management

- Both slider thumb and input field are individually focusable
- Visible focus ring on both elements (consistent with Blade's focus ring pattern)
- When disabled, both elements are removed from tab order (`tabIndex={-1}`)

### Screen Reader

- Value changes on the slider are announced with the suffix (e.g. "Corner Radius: 12 px")
- Error text is associated via `aria-describedby` and announced on focus

### Touch Targets

- Minimum touch target on thumb: **48px** (even though visual thumb is 16-20px)
- Achieved via transparent hit area expansion, not by scaling the visual thumb

## Implementation Notes

### Internal Architecture

```
SliderInput
├── FormGroupHeader (label, necessityIndicator)
├── SliderTrack (internal)
│   ├── ActiveTrack
│   ├── InactiveTrack
│   ├── TickMarks (when step && stepCount <= 20)
│   └── SliderThumb (draggable, keyboard-accessible)
├── NumericInput (internal, not BaseInput — too heavy)
│   ├── Value text
│   └── Suffix text
└── FormHint (helpText / errorText)
```

### State Management

- Uses `useControllableState` hook for controlled/uncontrolled support (same as CounterInput)
- Internal ref tracks drag state to differentiate `onChange` sources
- Input field debounces to avoid slider jitter during typing

### File Structure

```
packages/blade/src/components/SliderInput/
├── SliderInput.tsx
├── SliderTrack.tsx
├── sliderInputTokens.ts
├── types.ts
├── index.ts
├── SliderInput.stories.tsx
├── _decisions/
│   └── decisions.md
└── __tests__/
    └── SliderInput.web.test.tsx
```

### Platform

- **Web only** for v1
- React Native support deferred — requires `react-native-gesture-handler` and `react-native-reanimated` for drag interactions

## Open Questions

All questions include a recommendation. Feedback welcome.

1. **Standalone `Slider` component?**
   - **Recommendation:** No — ship `SliderInput` first. Extract track/thumb as internal sub-components that can be exposed as `Slider` in a follow-up PR if consumer demand emerges.

2. **React Native scope?**
   - **Recommendation:** Web-only for v1. RN requires `react-native-gesture-handler` and a fundamentally different interaction model. Scope separately once web component is stable.

3. **Tick mark rendering threshold?**
   - **Recommendation:** Auto-render when `(max - min) / step <= 20`. No `showTicks` prop. The heuristic handles all practical cases — configurator sliders rarely have more than 20 steps.

4. **Experimental PRs (#3407, #3423, #3430)?**
   - **Recommendation:** Start fresh through formal SDLC. The experimental PRs were AI agent tests that didn't go through design review or API decisions. However, implementation patterns from those PRs can be referenced during development.

5. **Input width?**
   - **Recommendation:** Auto-size based on `max` value digit count + suffix width. Prevents layout shift as value changes. Falls back to truncation with ellipsis if content overflows.

6. **Track gap (M3 pattern)?**
   - **Recommendation:** Include the 6px gap between thumb and track edges with 2px inside corner radius. This is an M3 accessibility improvement that ensures non-text contrast compliance.
