## Component Name

Code

## Description

Code renders short inline code, such as API keys, IDs, environment variables or method names, in a monospace font. By default it has a subtle highlighted background; `isHighlighted={false}` removes it and lets you set a text `color`. Place it inside `Text` to mix code with regular copy.

## Important Constraints

- `color` only works with `isHighlighted={false}`; with highlighting on, Code logs `` `color` prop cannot be used without `isHighlighted={false}` `` and ignores the color.
- `size` only accepts `small` or `medium`, and `weight` only `regular` or `bold`.
- Code has no `className`, `styleOverride` or `as` prop; it always renders a `<code>` inside a `<span>`.

## TypeScript Types

These are the props the Code component accepts; defaults are `size="small"`, `weight="regular"` and `isHighlighted={true}`.

```typescript
/**
 * Text color tokens, e.g. 'surface.text.gray.normal', 'feedback.text.positive.intense',
 * 'interactive.text.primary.normal'. See Tokens.md for the full list.
 */
type TextColors =
  | `interactive.text.${string}`
  | `surface.text.${string}`
  | `feedback.text.${string}`;

type CodeHighlightedProps = {
  /**
   * Sets the color of the Code component.
   * Should be a string value (token, variable name, or code snippet).
   */
  children: Snippet | string;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: 'small' | 'medium';
  weight?: 'regular' | 'bold';
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted?: true;
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
  /**
   * color prop can only be added when `isHighlighted` is set to `false`
   */
  color?: undefined;
  testID?: string;
} & StyledPropsBlade;

type CodeNonHighlightedProps = {
  /**
   * Sets the color of the Code component.
   * Should be a string value (token, variable name, or code snippet).
   */
  children: Snippet | string;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: 'small' | 'medium';
  weight?: 'regular' | 'bold';
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted: false;
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
  /**
   * color prop to set color of text when `isHighlighted` is set to false
   */
  color?: TextColors | 'currentColor';
  testID?: string;
} & StyledPropsBlade;

type CodeProps = CodeHighlightedProps | CodeNonHighlightedProps;
```

## Usage Guidelines

**Do**

- Use `Code` for inline technical values inside copy: key IDs, event names, environment variables, method names.
- Keep the default highlighted style for standalone values that users may copy.
- Use `isHighlighted={false}` with a `color` when the code value doubles as a status, such as a webhook event state.
- Match `size` to the surrounding Text: `small` inside `size="small"` Text, `medium` inside default Text.

**Don't**

- Don't pass `color` while highlighting is on; set `isHighlighted={false}` first.
- Don't use `Code` for multi-line code blocks; render a `<pre>` block styled with tokens instead.
- Don't use `Code` for regular emphasis; use `Text` with `weight="semibold"`.
- Don't wrap long URLs or secrets in `Code` inside tight layouts without room to wrap; place them on their own line.

## Examples

### API credentials help text

Highlighted Code values inside body copy for a developer settings page.

```svelte
<script lang="ts">
  import { Box, Code, Text } from '@razorpay/blade-svelte/components';

  const keyId = 'rzp_test_1DP5mmOlF5G5ag';
</script>

<Box className="display-flex flex-col gap-spacing-3">
  <Text>
    Use <Code size="medium" testID="key-id">{keyId}</Code> as your Key ID when you initialise Checkout.
  </Text>
  <Text size="small">
    Store the secret in <Code>RAZORPAY_KEY_SECRET</Code> and never expose it in client code.
  </Text>
</Box>
```

### Webhook event status

Non-highlighted Code with a status color and bold weight, next to regular text.

```svelte
<script lang="ts">
  import { Box, Code, Text } from '@razorpay/blade-svelte/components';

  let isDelivered = $state(true);
</script>

<Box className="display-flex flex-col gap-spacing-2">
  <Text>
    Event <Code size="medium">payment.captured</Code> was
    <Code
      size="medium"
      weight="bold"
      isHighlighted={false}
      color={isDelivered ? 'feedback.text.positive.intense' : 'feedback.text.negative.intense'}
    >
      {isDelivered ? 'DELIVERED' : 'FAILED'}
    </Code>
  </Text>
  <Text size="small" color="surface.text.gray.muted">Last attempt at 10:42 AM, response code 200.</Text>
</Box>
```
