# Slider

Slider lets users select one value or a bounded range by dragging a thumb, tapping the track, or using the keyboard. It is intended for bounded numeric settings and filters where the available range is meaningful. Use `CounterInput` for small incremental quantities and `TextInput` when unconstrained precision is the primary task.

## Design

- [Slider research and Snowflake component](https://www.figma.com/design/k1V23Ml1EWUokVyqN4TTod/Slider-Research---Snowflake-Component-Exploration?node-id=120-797)
- [Blade ProgressBar](https://blade.razorpay.com/?path=/docs/components-progressbar--docs)
- [WAI-ARIA Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
- [Prior Slider API exploration](https://github.com/razorpay/blade/pull/3475)

The implementation follows the Figma component's single/range variants, small/medium/large sizes, semantic color, header value, thumb value, marks, bounds, disabled state, and error state. Hover, focus, pressed, and dragging are interaction states rather than public props.

The visual thumb is smaller than its interaction target. Every web thumb retains a 44px target while its visible diameter follows the selected size.

## API

```jsx
import { Slider } from '@razorpay/blade/components';

<Slider
  label="Transaction limit"
  value={limit}
  onChange={({ value }) => setLimit(value)}
  min={0}
  max={100}
  step={5}
  showMinMax
/>;
```

Range selection uses the same component with a tuple value:

```jsx
<Slider
  label="Amount"
  variant="range"
  value={[minimumAmount, maximumAmount]}
  onChange={({ value: [minimum, maximum] }) => setAmount([minimum, maximum])}
  min={0}
  max={10000}
  step={500}
/>
```

`Slider` remains standalone. When direct numeric entry is useful, compose it with Blade `TextInput` instead of coupling the two components:

```jsx
<Box display="flex" alignItems="flex-end" gap="spacing.4">
  <Slider
    accessibilityLabel="Opacity"
    value={opacity}
    onChange={({ value }) => setOpacity(value)}
    showValue={false}
  />
  <TextInput
    label="Opacity"
    type="number"
    value={String(opacity)}
    onChange={({ value }) => setOpacity(Number(value))}
    suffix="%"
  />
</Box>
```

## Props

| Prop                     | Type                                  | Default               | Description                                               |
| ------------------------ | ------------------------------------- | --------------------- | --------------------------------------------------------- |
| `variant`                | `'single' \| 'range'`                 | `'single'`            | Selects one value or a start/end tuple.                   |
| `value`                  | `number \| readonly [number, number]` | -                     | Controlled value matching the variant.                    |
| `defaultValue`           | `number \| readonly [number, number]` | `min` or `[min, max]` | Initial uncontrolled value.                               |
| `min`                    | `number`                              | `0`                   | Lower bound. Must be less than `max`.                     |
| `max`                    | `number`                              | `100`                 | Upper bound. Must be greater than `min`.                  |
| `step`                   | `number`                              | `1`                   | Positive increment used for pointer and keyboard changes. |
| `size`                   | `'small' \| 'medium' \| 'large'`      | `'medium'`            | Changes visual thumb, track, and text size.               |
| `color`                  | Blade feedback color                  | `'information'`       | Semantic active track and thumb color.                    |
| `label`                  | `string`                              | -                     | Visible accessible label.                                 |
| `accessibilityLabel`     | `string`                              | -                     | Required when `label` is omitted.                         |
| `showValue`              | `boolean`                             | `true`                | Shows the current value beside the label.                 |
| `valueText`              | `string`                              | -                     | Overrides the generated header value.                     |
| `showThumbValue`         | `boolean`                             | `false`               | Shows formatted values above thumbs.                      |
| `valueFormatter`         | `(value: number) => string`           | `String`              | Formats visible values and `aria-valuetext`.              |
| `showMarks`              | `boolean`                             | `false`               | Shows custom marks or up to 20 generated step marks.      |
| `marks`                  | `{ value: number; label?: string }[]` | -                     | Supplies custom mark positions and labels.                |
| `showMinMax`             | `boolean`                             | `false`               | Shows lower and upper bounds.                             |
| `minLabel` / `maxLabel`  | `string`                              | formatted bounds      | Overrides generated bound labels.                         |
| `validationState`        | `'none' \| 'error'`                   | `'none'`              | Applies error visuals and semantics.                      |
| `helpText` / `errorText` | `string`                              | -                     | Supporting or error copy.                                 |
| `isDisabled`             | `boolean`                             | `false`               | Disables all pointer and keyboard interaction.            |
| `onChange`               | `({ name?, value }) => void`          | -                     | Fires continuously while the value changes.               |
| `onChangeEnd`            | `({ name?, value }) => void`          | -                     | Fires when pointer or keyboard interaction commits.       |

## Examples

Use `showThumbValue` for values that need feedback during dragging. Use `showMinMax` when the endpoints are not already obvious from surrounding content. Use labelled `marks` sparingly; unlabelled marks are generated only when the number of steps is 20 or fewer.

`valueText` is a visual override such as "Recommended". `valueFormatter` is the numeric formatting hook and also controls `aria-valuetext`, so it should include the unit a screen reader needs to announce.

## Accessibility

- The web implementation uses native `input[type="range"]` controls for platform keyboard, touch, focus, and form behavior.
- Arrow keys change by one step. Home/End move to bounds. Page Up/Page Down use native large-step behavior.
- Range sliders expose two separately named controls: "{label} minimum" and "{label} maximum".
- The visible thumb is wrapped by a 44px interaction target.
- Error and help text are connected with `aria-describedby`.
- Consumers must provide either `label` or `accessibilityLabel`.
- `valueFormatter` supplies `aria-valuetext`; include units and context when the raw number is ambiguous.

## Open Questions

- **React Native:** v1 is web-only. Native range selection needs a separate interaction and dependency review.
- **Centered sliders:** a zero-centered variant is not included until a concrete product use case defines its semantics.
- **Crossing range thumbs:** thumbs stop at one another. Swapping thumb ownership was rejected because it can be disorienting for keyboard and assistive-technology users.
