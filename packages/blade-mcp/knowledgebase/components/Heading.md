## Component Name

Heading

## Description

The Heading component is designed for creating section headings in a page's hierarchy. It automatically maps different sizes to appropriate HTML heading tags (h1-h6) while maintaining consistent styling. The component supports various sizes, weights, and customization options, making it ideal for creating clear visual hierarchies in your content structure. It's built with accessibility in mind, automatically applying the correct semantic heading tags based on the size prop.

## TypeScript Types

The following types define the props that the Heading component accepts. These types help you understand what properties you can pass to customize the Heading component's appearance and behavior.

```typescript
type HeadingProps = {
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Overrides the color of the Heading component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of heading
   */
  color?: string;
  weight?: 'regular' | 'semibold';
  children: React.ReactNode;
  textAlign?: string;
  textDecorationLine?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
} & TestID &
  StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Heading` for section titles and page hierarchy — it auto-maps sizes to semantic h-tags (small=h6, medium=h5, large=h4, xlarge=h3, 2xlarge=h2).
- Use `as` prop to override the auto-mapped tag only when the visual size differs from the semantic level.
- Use `as="span"` with nested Headings for inline color/weight variations within a heading.
- Keep heading hierarchy consistent on the page for accessibility (don't skip levels).

**Don't**

- Don't use `Heading` for body content or paragraphs — use `Text` instead.
- Don't use `Heading` for hero/landing page titles — use `Display` for maximum visual impact.
- Don't override `as` without reason — the auto-mapping ensures proper semantic structure.
- Don't use `weight="regular"` on headings unless specifically required — semibold (default) provides proper visual hierarchy.

## Example

Here's a comprehensive example showcasing the Heading component's various features and props, demonstrating different sizes, colors, weights, and semantic variations to create page hierarchy:

```tsx
import { Heading, Box, Text } from '@razorpay/blade/components';

function HeadingExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Main page heading with largest size */}
      <Heading size="2xlarge" color="surface.text.primary.normal" textAlign="center">
        Welcome to Our Platform
      </Heading>

      {/* Section heading with custom color and weight */}
      <Heading size="xlarge" weight="regular" color="surface.text.primary.normal">
        Features Overview
      </Heading>

      {/* Subsection heading with mixed styles */}
      <Heading size="large">
        Discover our{' '}
        <Heading as="span" size="large" color="feedback.text.information.intense">
          Premium
        </Heading>{' '}
        Solutions
      </Heading>

      {/* Semantic override with as prop */}
      <Heading as="h2" size="medium" weight="semibold" textAlign="left">
        Getting Started Guide
      </Heading>

      {/* Small heading with decoration */}
      <Heading size="small" textDecorationLine="underline" color="surface.text.gray.normal">
        Important Notes
      </Heading>

      {/* Heading with superscript */}
      <Box display="flex" alignItems="flex-start">
        <Heading size="medium">
          Special Offer
          <Heading as="span" size="small" color="feedback.text.positive.intense">
            *
          </Heading>
        </Heading>
      </Box>
    </Box>
  );
}

export default HeadingExample;
```
