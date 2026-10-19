## Component Name

Counter

## Description

Counter shows a count in a small pill: unread notifications, items in a filter, pending tasks. It comes in six colours, a tinted (`subtle`) or filled (`intense`) emphasis and three sizes (16, 20 and 24px tall, as wide at one digit), and with `max` it caps the display at `max+`. It is not interactive.

## Important Constraints

- `value` is required and is a number; there are no children
- Past `max` it reads `max+` (`max={99}` shows `99+`); `max={0}` also counts, showing `0+` for any positive value
- `class` places it; its look is `color`, `emphasis` and `size`

## Props

```typescript
type CounterColor = 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';

interface CounterProps {
  /** The count. */
  value: number;
  /** Above it, the counter reads `max+`; `0` too. */
  max?: number;
  /** @default 'neutral' */
  color?: CounterColor;
  /** `subtle` is tinted; `intense` is filled with white text. @default 'subtle' */
  emphasis?: 'subtle' | 'intense';
  /** 16, 20 or 24px tall, with 10, 12 or 14px text. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Use Counter for numbers and Badge for words.
- Set `max` (often `99`) wherever the count can grow large, so the pill keeps its size.
- Use `negative` or `primary` with `intense` for counts that need attention (unread, failed), `neutral` `subtle` for plain tallies.
- Hide the Counter yourself when the count is zero, unless a zero is meaningful.
- Don't restyle it through `class`.

## Examples

### Next to a label

```svelte
<script lang="ts">
  import { Counter, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-3">
  <div class="flex items-center gap-blade-2">
    <Text>Disputes</Text>
    <Counter value={3} color="negative" emphasis="intense" />
  </div>
  <div class="flex items-center gap-blade-2">
    <Text>Notifications</Text>
    <Counter value={128} max={99} color="primary" />
  </div>
</div>
```

### Colours and sizes

```svelte
<script lang="ts">
  import { Counter } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-wrap items-center gap-blade-3">
  <Counter value={7} size="small" />
  <Counter value={42} color="positive" />
  <Counter value={5} color="notice" size="large" />
  <Counter value={12} color="information" emphasis="intense" />
</div>
```
