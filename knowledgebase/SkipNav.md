## Component Name

SkipNav

## Description

The SkipNav component lets users skip the navigation and jump to the main content of the page. It improves accessibility by allowing keyboard users to bypass repetitive navigation links and quickly access the primary content. This is especially useful for users with screen readers or those who navigate websites using only a keyboard.

## TypeScript Types

These types define the props that the SkipNav component and its subcomponents accept, allowing you to configure the component when using it in your application.

```typescript
// SkipNavLink Component Props
type SkipNavLinkProps = {
  /**
   * The ID of the element to skip to.
   * Must match the id prop on SkipNavContent.
   * @default 'blade-skip-nav'
   */
  id?: string;

  /**
   * The text content of the skip link.
   * @default 'Skip to content'
   */
  children?: StringChildrenType;

  /**
   * Internal prop - adds background to link.
   * @private
   */
  _hasBackground?: boolean;
};

// SkipNavContent Component Props
type SkipNavContentProps = {
  /**
   * The ID of the element that will be skipped to.
   * Must match the id prop on SkipNavLink.
   * @default 'blade-skip-nav'
   */
  id?: string;
} & TestID;
```

## Example

### Basic Usage

```tsx
import { SkipNavLink, SkipNavContent, Box, Link, Text } from '@razorpay/blade/components';

function AccessibleLayout() {
  return (
    <Box>
      {/* Place SkipNavLink at the beginning of your document */}
      <SkipNavLink>Skip to content</SkipNavLink>

      {/* Navigation Section */}
      <nav>
        <Box
          as="ul"
          display="flex"
          gap="spacing.4"
          padding="spacing.4"
          backgroundColor="surface.background.gray.subtle"
        >
          <li>
            <Link href="#home">Home</Link>
          </li>
          <li>
            <Link href="#features">Features</Link>
          </li>
          <li>
            <Link href="#pricing">Pricing</Link>
          </li>
          <li>
            <Link href="#contact">Contact</Link>
          </li>
        </Box>
      </nav>

      {/* Main Content - Place SkipNavContent at the beginning of main content */}
      <main>
        <SkipNavContent />
        <Box padding="spacing.4">
          <Text variant="heading" size="xlarge">
            Welcome to Our Website
          </Text>
          <Text marginTop="spacing.3">
            This is the main content area that users will skip to when using the SkipNavLink.
          </Text>
        </Box>
      </main>
    </Box>
  );
}
```
