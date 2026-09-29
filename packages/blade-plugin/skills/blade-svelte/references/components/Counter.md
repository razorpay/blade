## Component Name

Counter

## Description

Counter is a small, non-interactive pill that shows a number, such as pending disputes, unread notifications or failed webhooks. Colors carry meaning, emphasis controls contrast, and `max` caps long numbers as `99+`. Use it next to a label, tab or navigation item to show how many items it holds.

## Important Constraints

- `value` is required and must be a number
- When `max` is set and `value` is greater than `max`, Counter shows `{max}+`
- Counter has no click, focus or other event props

## TypeScript Types

These are the props the Counter component accepts.

```typescript
type CounterSize = 'small' | 'medium' | 'large';
type CounterColor = 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';
type CounterEmphasis = 'subtle' | 'intense';

interface CounterProps extends StyledPropsBlade {
  /**
   * The value to be displayed in the counter.
   *
   * This is the numerical value shown within the counter component.
   */
  value: number;

  /**
   * Sets the maximum value for the counter.
   *
   * If the value exceeds this maximum, it will be displayed as `max+`.
   * For example, if max is 99 and value is 140, it will show "99+".
   */
  max?: number;

  /**
   * Sets the color of the counter.
   *
   * Available colors:
   * - `neutral`: Default neutral color
   * - `positive`: Positive feedback color (success)
   * - `negative`: Negative feedback color (error)
   * - `notice`: Notice/warning color
   * - `information`: Information color
   * - `primary`: Primary brand color
   *
   * @default 'neutral'
   */
  color?: CounterColor;

  /**
   * Sets the contrast/intensity of the counter background.
   *
   * - `subtle`: Lighter background with darker text
   * - `intense`: Darker background with lighter text (higher contrast)
   *
   * @default 'subtle'
   */
  emphasis?: CounterEmphasis;

  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: CounterSize;

  /**
   * Test ID for automated testing.
   *
   * Used to identify the counter component in test suites.
   */
  testID?: string;

  /**
   * Analytics tracking attributes.
   *
   * Use data-analytics-* props for tracking component interactions.
   */
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `Counter` for a count attached to another element, such as "Disputes 12" or "Failed webhooks 3".
- Set `max` (usually `99`) when the count can grow large, so the layout stays stable.
- Use semantic colors: `negative` for items needing action, `notice` for pending items, `neutral` for plain totals.
- Use `emphasis="intense"` only for the one count that needs attention; keep others `subtle`.
- Match `size` to the label it sits next to: `small` in dense lists, `medium` next to body text.

**Don't**

- Don't make a Counter clickable; wrap the label and Counter in a `Button` or `Link`, or use `Chip` for filters.
- Don't use `Counter` for text statuses such as "Captured"; use `Badge`.
- Don't use `Counter` for money or decimal values; use `Amount` or `Text`.
- Don't rely on the number alone; the adjacent label must say what is being counted.

## Examples

### Dashboard section counts

Counts next to section labels, with a capped, high-contrast count for disputes that need action.

```svelte
<script lang="ts">
  import { Counter, Text } from '@razorpay/blade-svelte/components';

  const sections = [
    { id: 'disputes', label: 'Open disputes', count: 142, color: 'negative' as const, emphasis: 'intense' as const },
    { id: 'refunds', label: 'Pending refunds', count: 8, color: 'notice' as const, emphasis: 'subtle' as const },
    { id: 'payouts', label: 'Payouts today', count: 26, color: 'neutral' as const, emphasis: 'subtle' as const },
  ];
</script>

<ul class="section-list">
  {#each sections as section (section.id)}
    <li class="section-row">
      <Text size="medium">{section.label}</Text>
      <Counter
        value={section.count}
        max={99}
        color={section.color}
        emphasis={section.emphasis}
        size="medium"
        testID={`${section.id}-counter`}
        data-analytics-counter={section.id}
      />
    </li>
  {/each}
</ul>

<style>
  .section-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .section-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
</style>
```

### Live notification count

A small counter that updates from state and spaces itself with a styled prop.

```svelte
<script lang="ts">
  import { Button, Counter, Text } from '@razorpay/blade-svelte/components';

  let unread = $state(3);
</script>

<div class="inbox-row">
  <Text size="small">Unread alerts</Text>
  <Counter value={unread} max={9} color="primary" size="small" marginLeft="spacing.2" />
  <Button variant="tertiary" size="small" isDisabled={unread === 0} onClick={() => (unread = 0)}>
    Mark all as read
  </Button>
</div>

<style>
  .inbox-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
</style>
```
