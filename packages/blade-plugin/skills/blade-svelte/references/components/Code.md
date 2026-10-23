## Component Name

Code

## Description

Code marks a short piece of code inside a line of text: a key name, a variable, a status value, an API path. It sets it in the code face (Menlo) at 10 or 12px, regular or bold, and by default highlights it on a neutral chip in the subtle text colour. It is inline (a `<code>` in a `<span>`), meant to sit inside a Text, and is not a code block.

## Important Constraints

- The code is `children`, a snippet (plain text between the tags works)
- Highlighted (the default) Code takes no `color`; `color` is allowed only with `isHighlighted={false}`, and the types enforce it
- `size` is `small` or `medium` only, and `weight` `regular` or `bold`
- It is inline: put it inside a `Text`; for a multi-line snippet use your own `<pre>` styled with Blade's token classes
- `class` places it; its look is `size`, `weight`, `isHighlighted` and `color`

## Props

```typescript
type CodeColor = 'default' | 'subtle' | 'muted' | 'primary' | 'negative' | 'positive' | 'white' | 'inherit';

interface CodeProps {
  /** 10/14 or 12/18px (size/line height). @default 'small' */
  size?: 'small' | 'medium';
  /** @default 'regular' */
  weight?: 'regular' | 'bold';
  /** A neutral chip in the subtle text colour; `false` is plain code. @default true */
  isHighlighted?: boolean;
  /** Only with `isHighlighted={false}`. @default 'default' */
  color?: CodeColor;
  /** The code: a token, a variable name, a short snippet. */
  children: Snippet;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Use Code for anything a user would type or copy exactly: keys, IDs, env variables, endpoints.
- Match its `size` to the text around it: `small` in small or medium Text, `medium` in large Text.
- Use `isHighlighted={false}` with a `color` only when the chip would be noisy, such as in a dense table cell.
- Don't use Code to emphasise ordinary words; use `Text weight="semibold"`.
- Don't wrap long multi-line code in it.

## Examples

### Inside a sentence

```svelte
<script lang="ts">
  import { Code, Text } from '@razorpay/blade-svelte/components';
</script>

<Text>
  Set <Code>RAZORPAY_KEY_ID</Code> in your environment before the build.
</Text>
```

### Sizes, weight and plain code

```svelte
<script lang="ts">
  import { Code, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-3">
  <Text size="small">Webhook path: <Code>/api/webhooks/razorpay</Code></Text>
  <Text size="large">Order ID <Code size="medium" weight="bold">order_Q1w2e3r4t5</Code></Text>
  <Text>
    Status is <Code isHighlighted={false} color="positive" weight="bold">captured</Code>
  </Text>
</div>
```
