## Component Name

VisuallyHidden

## Description

The VisuallyHidden component makes content hidden from sighted users but available for screen reader users. It allows you to provide additional context for assistive technologies without visually displaying that information. This component is essential for improving accessibility in your application by providing information exclusively for screen readers.

## TypeScript Types

These are the props that the VisuallyHidden component accepts. When using the VisuallyHidden component, you'll need to provide these props to configure its behavior:

```typescript
type VisuallyHiddenProps = {
  /**
   * Content to be hidden visually but available to screen readers
   */
  children: React.ReactNode;
} & TestID;
```

## Usage Guidelines

**Do**

- Use `VisuallyHidden` to provide accessible labels for screen readers when the visual label is absent or redundant (e.g., icon-only buttons, checkboxes without visible labels).
- Wrap text content that adds context for assistive technology users but would be redundant for sighted users.
- Use inside interactive components like `Checkbox`, `IconButton`, or custom controls that lack visible labels.

**Don't**

- Don't use `VisuallyHidden` to conditionally hide content for sighted users — it's an accessibility utility, not a display toggle.
- Don't use it as a replacement for `aria-label` on components that already support the `accessibilityLabel` prop — prefer the prop-based approach.
- Don't wrap complex interactive components inside `VisuallyHidden` — only use it for supplementary text content.
- Don't use `display: none` or `visibility: hidden` instead — those remove content from the accessibility tree entirely.

## Example

### Basic Usage

This example demonstrates how to use the VisuallyHidden component to create accessible controls with hidden labels that are only available to screen readers.

```tsx
import { VisuallyHidden, Checkbox, Box, Text } from '@razorpay/blade/components';

function AccessibleCheckboxExample() {
  return (
    <Box padding="spacing.4">
      <Text marginBottom="spacing.3">
        The checkbox below has a label that is only visible to screen readers.
      </Text>

      <Box display="flex" alignItems="center" gap="spacing.3">
        <Checkbox>
          <VisuallyHidden>
            <Text>Toggle dark mode</Text>
          </VisuallyHidden>
        </Checkbox>
        <Text>Enable dark mode</Text>
      </Box>

      <Box marginTop="spacing.5">
        <Text marginBottom="spacing.3">
          This technique is useful when you want to provide additional context to screen reader
          users without cluttering the visual interface.
        </Text>
      </Box>
    </Box>
  );
}

export default AccessibleCheckboxExample;
```
