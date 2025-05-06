## Component Name

Breadcrumb

## Description

Breadcrumbs are navigational components that display the user's current location within an application's hierarchy. They provide a clear path back to previous pages or sections, enhancing user orientation and enabling quick navigation between related pages. Breadcrumbs are particularly useful in applications with multiple levels of content organization, helping users understand their current context and navigate efficiently.

## TypeScript Types

The following types represent the props that the Breadcrumb component and its subcomponent BreadcrumbItem accept. These types allow you to properly configure the navigation according to your needs.

```typescript
/**
 * Props for the Breadcrumb component
 */
type BreadcrumbProps = {
  /**
   * The children of the Breadcrumb component
   * Should be BreadcrumbItem components
   */
  children: React.ReactNode;

  /**
   * The size of the Breadcrumb
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The color scheme of the Breadcrumb
   * @default 'primary'
   */
  color?: 'primary' | 'neutral' | 'white';

  /**
   * Whether to show a separator after the last item
   * @default false
   */
  showLastSeparator?: boolean;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;

/**
 * Props for the BreadcrumbItem component
 */
type BreadcrumbItemProps = {
  /**
   * The content of the BreadcrumbItem
   * Not required when using icon-only
   */
  children?: React.ReactNode;

  /**
   * The URL that the breadcrumb item links to
   */
  href?: string;

  /**
   * Icon to display before the item text
   * Can be used alone with accessibilityLabel for icon-only items
   */
  icon?: IconComponent;

  /**
   * Whether this item represents the current page
   * @default false
   */
  isCurrentPage?: boolean;

  /**
   * Accessible label for the breadcrumb item
   * Required for icon-only items
   */
  accessibilityLabel?: string;

  /**
   * Called when the item is clicked
   */
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;

  /**
   * For advanced use cases: render with a custom component (e.g., React Router's Link)
   */
  as?: React.ElementType;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Type for icon components
 */
type IconComponent = React.ComponentType<{
  size?: 'small' | 'medium' | 'large';
  color?: string;
}>;
```

## Example

The following examples demonstrate how to use the Breadcrumb component in various scenarios.

### Basic Breadcrumb with Different Sizes and Colors

This example demonstrates Breadcrumbs with different sizes, colors, and on different backgrounds.

```tsx
import React from 'react';
import { Box, Breadcrumb, BreadcrumbItem, HomeIcon } from '@razorpay/blade/components';

const BreadcrumbExample = () => {
  return (
    <Box padding="spacing.4">
      <Breadcrumb
        size="medium"
        color="primary"
        testID="breadcrumb-example"
        data-analytics="breadcrumb-primary"
      >
        <BreadcrumbItem
          icon={HomeIcon}
          href="/home"
          accessibilityLabel="Home"
          testID="breadcrumb-home"
        />
        <BreadcrumbItem href="/dashboard" testID="breadcrumb-dashboard">
          Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem href="/payments" testID="breadcrumb-payments">
          Payments
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements" testID="breadcrumb-settlements">
          Settlements
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};

export default BreadcrumbExample;
```

### React Router Integration

This example demonstrates how to integrate the Breadcrumb component with React Router for dynamic navigation.

```tsx
import React from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  HomeIcon,
  PaymentIcon,
  ProductIcon,
} from '@razorpay/blade/components';
import { useLocation, Link as RouterLink, matchPath } from 'react-router-dom';

// Custom BreadcrumbItem that integrates with React Router
const RouterBreadcrumbItem = (props) => {
  const location = useLocation();
  const { to, children, icon, ...rest } = props;

  // Check if this item matches the current location
  const isCurrentPage = matchPath({ path: to, end: true }, location.pathname) !== null;

  return (
    <BreadcrumbItem as={RouterLink} href={to} icon={icon} isCurrentPage={isCurrentPage} {...rest}>
      {children}
    </BreadcrumbItem>
  );
};

// Breadcrumb based on the current route
const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Generate breadcrumb items based on the path
  const getItems = () => {
    const items = [];
    let currentPath = '';

    // Always include home
    items.push(
      <RouterBreadcrumbItem key="home" to="/" icon={HomeIcon} accessibilityLabel="Home" />,
    );

    // Add items for each path segment
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Get appropriate icon and label based on the segment
      let icon = null;
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      if (segment === 'products') icon = ProductIcon;
      if (segment === 'payments') icon = PaymentIcon;

      items.push(
        <RouterBreadcrumbItem key={currentPath} to={currentPath} icon={icon}>
          {label}
        </RouterBreadcrumbItem>,
      );
    });

    return items;
  };

  return (
    <Box padding="spacing.4">
      <Breadcrumb
        size="medium"
        color={location.pathname.includes('/payments') ? 'primary' : 'neutral'}
      >
        {getItems()}
      </Breadcrumb>
    </Box>
  );
};

export default DynamicBreadcrumb;
```

### Responsive Breadcrumb with Multi-line Wrapping

This example demonstrates a responsive breadcrumb that wraps to multiple lines on smaller screens.

```tsx
import React from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Text,
  HomeIcon,
  FolderIcon,
} from '@razorpay/blade/components';

const ResponsiveBreadcrumb = () => {
  // Example deep navigation structure
  const navigationItems = [
    { label: 'Home', href: '/home', icon: HomeIcon },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics', icon: FolderIcon },
    { label: 'Computers', href: '/products/electronics/computers' },
    { label: 'Laptops', href: '/products/electronics/computers/laptops' },
    { label: 'Gaming Laptops', href: '/products/electronics/computers/laptops/gaming' },
    { label: 'Accessories', href: '/products/electronics/computers/laptops/gaming/accessories' },
    {
      label: 'Product Details',
      href: '/products/electronics/computers/laptops/gaming/accessories/details',
      isCurrentPage: true,
    },
  ];

  return (
    <Box
      width={{ base: '100%', m: '80%', l: '100%' }}
      padding="spacing.4"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
    >
      <Text variant="body" size="medium" marginBottom="spacing.3">
        Breadcrumb automatically wraps to multiple lines when needed:
      </Text>

      <Breadcrumb size="medium" color="primary">
        {navigationItems.map((item, index) => (
          <BreadcrumbItem
            key={index}
            href={item.href}
            icon={item.icon}
            isCurrentPage={item.isCurrentPage}
            accessibilityLabel={item.icon && !item.label ? item.label : undefined}
          >
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  );
};

export default ResponsiveBreadcrumb;
```
