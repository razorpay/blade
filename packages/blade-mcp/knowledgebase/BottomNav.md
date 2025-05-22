## Component Name

BottomNav

## Description

BottomNav is a persistent navigation component designed for mobile interfaces, positioned at the bottom of the screen. It provides quick access to core functionalities through icons and labels, allowing users to navigate between primary destinations in an application. The component is optimized for touch interaction and follows mobile UI design patterns with clear visual indicators for active states.

## TypeScript Types

The following types represent the props that the BottomNav component and its subcomponents accept. These types allow you to properly configure the navigation according to your app's structure.

````typescript
/**
 * Props for the BottomNav component
 */
type BottomNavProps = {
  /**
   * children slot of BottomNav, accepts BottomNavItem
   */
  children: React.ReactNode;

  /**
   * zIndex of BottomNav
   *
   * @default 100
   */
  zIndex?: number;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;

/**
 * Props for the BottomNavItem component
 */
type BottomNavItemProps = {
  /**
   * Title text of the BottomNavItem
   */
  title: string;

  /**
   * Icon rendered above the title.
   *
   * Accepts icon component from blade
   */
  icon: IconComponent;

  /**
   * href property of link
   *
   * maps to `to` property when react router is being used
   */
  href?: string;

  /**
   * HTML's `target` attribute for anchor links
   */
  target?: string;

  /**
   * HTML's `rel` tag of anchor links
   */
  rel?: string;

  /**
   * as prop to pass ReactRouter's Link component.
   *
   * ```jsx
   * import { NavLink } from 'react-router-dom';
   *
   * <BottomNavItem as={NavLink} />
   * ```
   */
  as?: React.ComponentType<any>;

  /**
   * Active state of the BottomNavItem.
   *
   * Use this to set the current page's active state using react router
   */
  isActive?: boolean;

  /**
   * onClick handler of BottomNavItem
   */
  onClick?: React.MouseEventHandler;
} & TestID &
  DataAnalyticsAttribute;
````

## Example

This example demonstrates how to implement BottomNav with React Router for a mobile application, including active state management and integration with side navigation.

```tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, matchPath } from 'react-router-dom';
import {
  BottomNav,
  BottomNavItem,
  SideNav,
  SideNavBody,
  SideNavLink,
  Box,
  Text,
  HomeIcon,
  PaymentGatewayIcon,
  TransactionsIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  MenuDotsIcon,
  CurrentAccountIcon,
  RazorpayIcon,
} from '@razorpay/blade/components';

// Sample page component to show when a route is matched
const PageContent = ({ title }) => (
  <Box padding="spacing.5" paddingBottom="spacing.6">
    <Text variant="body" size="medium">
      {title} Page Content
    </Text>
  </Box>
);

// Helper function to check if a route is active
const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
): boolean => {
  const isCurrentPathActive = Boolean(
    href && matchPath({ path: href, end: true }, location.pathname),
  );

  const isSubItemActive = Boolean(
    activeOnLinks?.find((link) => matchPath({ path: link, end: true }, location.pathname)),
  );

  return isCurrentPathActive || isSubItemActive;
};

// Custom BottomNavItem with React Router integration
const RouterBottomNavItem = (props) => {
  const { activeOnLinks, ...rest } = props;
  const location = useLocation();

  return (
    <BottomNavItem
      {...rest}
      as={NavLink}
      isActive={isItemActive(location, {
        href: props.href,
        activeOnLinks,
      })}
    />
  );
};

// Custom SideNavLink with React Router integration
const RouterSideNavLink = (props) => {
  const { activeOnLinks, ...rest } = props;
  const location = useLocation();

  return (
    <SideNavLink
      {...rest}
      as={NavLink}
      isActive={isItemActive(location, {
        href: props.href,
        activeOnLinks,
      })}
    />
  );
};

// Main App component with navigation implementation
const MobileAppExample = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // Bottom navigation items
  const mainNavItems = [
    {
      title: 'Home',
      href: '/',
      icon: HomeIcon,
    },
    {
      title: 'Payments',
      href: '/payments',
      icon: PaymentGatewayIcon,
    },
    {
      title: 'Transactions',
      href: '/transactions',
      icon: TransactionsIcon,
    },
    {
      title: 'Links',
      href: '/payment-links',
      icon: PaymentLinkIcon,
    },
  ];

  // Additional items for side navigation
  const sideNavItems = [
    {
      title: 'Pages',
      href: '/payment-pages',
      icon: PaymentPagesIcon,
    },
    {
      title: 'Account',
      href: '/account',
      icon: CurrentAccountIcon,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: RazorpayIcon,
    },
  ];

  return (
    <Box height="100vh" width="100%" position="relative">
      {/* Routes configuration */}
      <Routes>
        <Route path="/" element={<PageContent title="Home" />} />
        <Route path="/payments" element={<PageContent title="Payments" />} />
        <Route path="/transactions" element={<PageContent title="Transactions" />} />
        <Route path="/payment-links" element={<PageContent title="Payment Links" />} />
        <Route path="/payment-pages" element={<PageContent title="Payment Pages" />} />
        <Route path="/account" element={<PageContent title="Account" />} />
        <Route path="/settings" element={<PageContent title="Settings" />} />
      </Routes>

      {/* Side Navigation */}
      <SideNav
        isOpen={isSideNavOpen}
        onDismiss={() => setIsSideNavOpen(false)}
        position="absolute"
        zIndex={200}
      >
        <SideNavBody>
          {/* Include both main and extra navigation items in side nav */}
          {[...mainNavItems, ...sideNavItems].map((item) => (
            <RouterSideNavLink
              key={item.href}
              title={item.title}
              href={item.href}
              icon={item.icon}
              onClick={() => setIsSideNavOpen(false)}
            />
          ))}
        </SideNavBody>
      </SideNav>

      {/* Bottom Navigation */}
      <BottomNav
        position="fixed"
        bottom="spacing.0"
        left="spacing.0"
        testID="main-navigation"
        data-analytics="bottom-nav"
      >
        {/* First 3 main navigation items */}
        {mainNavItems.slice(0, 3).map((item) => (
          <RouterBottomNavItem
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
            testID={`nav-item-${item.title.toLowerCase()}`}
          />
        ))}

        {/* More button that opens side nav */}
        <BottomNavItem
          title="More"
          icon={MenuDotsIcon}
          onClick={() => setIsSideNavOpen(true)}
          testID="nav-item-more"
          activeOnLinks={[
            ...mainNavItems.slice(3).map((item) => item.href),
            ...sideNavItems.map((item) => item.href),
          ]}
        />
      </BottomNav>
    </Box>
  );
};

// Wrap with router for complete example
const App = () => (
  <BrowserRouter>
    <MobileAppExample />
  </BrowserRouter>
);

export default App;
```
