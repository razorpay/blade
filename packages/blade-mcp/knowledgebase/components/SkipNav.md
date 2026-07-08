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

## Usage Guidelines

**Do**

- Place `SkipNavLink` as the first interactive element in the document — before any navigation.
- Place `SkipNavContent` at the start of the main content area (inside `<main>`).
- Ensure the `id` prop on `SkipNavLink` matches the `id` on `SkipNavContent` — they default to `"blade-skip-nav"`.
- Use multiple skip nav pairs with unique custom IDs if your page has distinct content sections.
- Pair `SkipNav` with `SideNav` for apps with complex navigation hierarchies.

**Don't**

- Don't use `SkipNav` on React Native — it's web-only and throws an error on native.
- Don't nest `SkipNavLink` inside `SkipNavContent` or vice versa — they are independent components placed at separate DOM locations.
- Don't use mismatched IDs between the link and content target — navigation won't work.
- Don't style or position `SkipNavLink` manually — it's visually hidden by default and only appears on keyboard focus.

## Example

### Basic Usage

This example demonstrates how to implement the SkipNav component for accessibility, showing proper placement of SkipNavLink at the beginning of the document and SkipNavContent at the start of the main content area.

```tsx
import { SkipNavLink, SkipNavContent, Box, Link, Text, Heading } from '@razorpay/blade/components';

function AccessibleLayout() {
  return (
    <Box>
      {/* Place SkipNavLink at the beginning of your document */}
      <SkipNavLink>Skip to content</SkipNavLink>

      {/* Navigation Section */}
      <nav>
        <Box
          display="flex"
          gap="spacing.4"
          padding="spacing.4"
          backgroundColor="surface.background.gray.subtle"
        >
          <ul>
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
          </ul>
        </Box>
      </nav>

      {/* Main Content - Place SkipNavContent at the beginning of main content */}
      <main>
        <SkipNavContent />
        <Box padding="spacing.4">
          <Heading size="xlarge">Welcome to Our Website</Heading>
          <Text marginTop="spacing.3">
            This is the main content area that users will skip to when using the SkipNavLink.
          </Text>
        </Box>
      </main>
    </Box>
  );
}
```
