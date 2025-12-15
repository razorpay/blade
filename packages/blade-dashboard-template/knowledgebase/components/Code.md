## Component Name

Code

## Description

The Code component is designed for displaying inline code snippets, token names, or variable names within text content. It provides a monospace font with optional highlighting and supports both web and React Native platforms. The component automatically handles proper text alignment and spacing, making it ideal for technical documentation, configuration guides, or any content that needs to display code-like text inline with regular content.

## Important Constraints

- `color` prop cannot be used without `isHighlighted={false}`

## TypeScript Types

The following types define the props that the Code component accepts. These types help you understand what properties you can pass to customize the Code component's appearance and behavior.

```typescript
type CodeCommonProps = {
  /**
   * Sets the color of the Heading component.
   */
  children: StringChildrenType;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: 'small' | 'medium';
  weight?: 'regular' | 'bold';
  isHighlighted?: boolean;
  color?: string;
} & TestID &
  StyledPropsBlade;

type CodeHighlightedProps = CodeCommonProps & {
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted?: true;
  /**
   * color prop can only be added when `isHighlighted` is set to `false`
   */
  color?: undefined;
};

type CodeNonHighlightedProps = CodeCommonProps & {
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted: false;
  /**
   * color prop to set color of text when `isHighlighted` is set to false
   */
  color?: string;
};

type CodeProps = CodeHighlightedProps | CodeNonHighlightedProps;
```

## Example

Here's a comprehensive example showcasing the Code component's various features and props:

```tsx
import { Code, Text, Box } from '@razorpay/blade/components';

function CodeExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {/* Basic usage with default highlighting */}
      <Text size="medium">
        Use environment variable <Code>RAZORPAY_API_KEY</Code> to configure the SDK
      </Text>

      {/* Code with custom size and weight */}
      <Text>
        The default export{' '}
        <Code size="medium" weight="bold" testID="export-code">
          RazorpayCheckout
        </Code>{' '}
        is available in the package
      </Text>

      {/* Non-highlighted code with custom color */}
      <Text>
        Status:{' '}
        <Code isHighlighted={false} color="feedback.text.positive.intense" weight="bold">
          COMPLETED
        </Code>
      </Text>

      {/* Multiple code snippets in a sentence */}
      <Text size="small">
        Replace <Code size="small">process.env.KEY_ID</Code> and{' '}
        <Code size="small">process.env.KEY_SECRET</Code> with your credentials
      </Text>

      {/* React Native specific layout */}
      <Box flexWrap="wrap" flexDirection="row" alignItems="flex-start">
        <Text>Configure webhook URL: </Text>
        <Code>https://your-domain.com/webhook</Code>
        <Text> in the dashboard</Text>
      </Box>

      {/* Technical documentation example */}
      <Text>
        Import the component using{' '}
        <Code size="medium">
          import {'{'} PaymentForm {'}'}
        </Code>{' '}
        and initialize with{' '}
        <Code size="medium" isHighlighted={false} color="interactive.text.primary.normal">
          new PaymentForm(config)
        </Code>
      </Text>
    </Box>
  );
}

export default CodeExample;
```
