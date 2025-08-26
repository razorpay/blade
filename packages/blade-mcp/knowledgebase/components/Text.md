## Component Name

Text

## Description

The Text component is a versatile typography component used to display main content on a page. It is designed to work seamlessly with Title or Heading components to create hierarchical content structures. The component automatically applies responsive styles based on the device it's being rendered on. It supports different variants (body and caption), weights, sizes, and can be customized with various text properties like color, alignment, and truncation.

## Important Constraints

- `variant="caption"` only accepts `size="small"` or `size="medium"`

## TypeScript Types

The following types define the props that the Text component and its variants accept. These types help you understand what properties you can pass to customize the Text component's appearance and behavior.

```typescript
type TextVariant = 'body' | 'caption';

type TextCommonProps = {
  as?: 'p' | 'span' | 'div' | 'abbr' | 'figcaption' | 'cite' | 'q' | 'label';
  truncateAfterLines?: number;
  children: React.ReactNode;
  weight?: 'regular' | 'medium' | 'semibold';
  /**
   * Overrides the color of the Text component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of text
   */
  color?: string;
  textAlign?: string;
  textDecorationLine?: string;
  wordBreak?: string;
} & TestID &
  StyledPropsBlade;

type TextBodyVariant = TextCommonProps & {
  variant?: 'body';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
};

type TextCaptionVariant = TextCommonProps & {
  variant?: 'caption';
  size?: 'small' | 'medium';
};

type TextProps<T> = T extends { variant: infer Variant }
  ? Variant extends 'caption'
    ? TextCaptionVariant
    : Variant extends 'body'
    ? TextBodyVariant
    : T
  : T;
```

## Example

Here's a comprehensive example showcasing the Text component's various features and props, demonstrating different text variants, sizes, weights, and styling options for creating properly formatted content:

```tsx
import { Text } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function TextExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {/* Body variant with different sizes and weights */}
      <Text
        variant="body"
        size="large"
        weight="semibold"
        color="surface.text.primary.normal"
        textAlign="center"
      >
        This is a large body text with semibold weight
      </Text>

      {/* Caption variant with truncation */}
      <Text variant="caption" size="medium" truncateAfterLines={2} color="surface.text.gray.normal">
        This is a medium caption text that will be truncated after 2 lines. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </Text>

      {/* Nested text with different semantic elements */}
      <Text as="p">
        Regular paragraph with
        <Text as="span" weight="semibold" color="surface.text.primary.normal">
          emphasized text
        </Text> and <Text as="cite" variant="body" size="small" textDecorationLine="underline">
          citation
        </Text>
      </Text>

      {/* Accessibility example with label */}
      <Text as="label" variant="body" size="medium" weight="medium" testID="form-label">
        Form Input Label
      </Text>

      {/* Text with word break and custom styling */}
      <Text
        variant="body"
        size="medium"
        wordBreak="break-word"
        textAlign="left"
        color="surface.text.gray.normal"
        margin="spacing.2"
      >
        This text demonstrates word-break and custom styling with margin
      </Text>
    </Box>
  );
}

export default TextExample;
```
