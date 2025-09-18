## Component Name

TopNav

## Description

The TopNav component is a navigation bar positioned at the top of the screen that provides quick access to different products, search functionality, and user profile. TopNav always uses TabNav for multi-product navigation. TopNav has a responsive design that adapts well to different viewport sizes and integrates seamlessly with side navigation systems.

## TypeScript Types

Below are the props that the TopNav component and its subcomponents accept. These types allow you to properly configure each component to build a complete navigation system.

````typescript
// Main TopNav Component Types
type TopNavProps = {
  children: React.ReactNode;
} & Pick<
  BoxProps,
  | 'padding'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingX'
  | 'paddingY'
  | 'backgroundColor'
  | 'position'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'width'
  | 'zIndex'
  | keyof DataAnalyticsAttribute
> &
  TestID &
  StyledPropsBlade;

// TopNav Subcomponents Types - These components have simple props
type TopNavBrandProps = {
  children: React.ReactNode;
};

type TopNavContentProps = {
  children: React.ReactNode;
};

type TopNavActionsProps = {
  children: React.ReactNode;
};

// TabNav Types (Used within TopNav)
type TabNavProps = {
  items: Item[];
  children: (props: {
    items: TabNavItemData[];
    overflowingItems: TabNavItemData[];
  }) => React.ReactElement;
};

type Item = TabNavItemProps & {
  description?: string;
  isAlwaysOverflowing?: boolean;
};

type TabNavItemData = Item & {
  isOverflowing?: boolean;
  tabWidth?: number;
  offsetX?: number;
};

// TabNavItem Types
type TabNavItemProps = {
  /**
   * href of the link
   */
  href?: LinkProps['href'];
  /**
   * Anchor tag `target` attribute
   */
  target?: LinkProps['target'];
  /**
   * as prop to pass ReactRouter's Link component.
   *
   * @default 'a'
   *
   * @example
   * ```
   * import { Link } from 'react-router-dom';
   *
   * <TabNavItem as={Link} />
   * ```
   */
  as?: React.ComponentType<any> | 'a' | 'button';
  /**
   * Selected state of the navigation item.
   *
   * @default false
   */
  isActive?: boolean;
  /**
   * Leading icon for TabNavItem.
   *
   * @default undefined
   */
  icon?: IconComponent;
  /**
   * Element to render after the navigation item.
   *
   * @default undefined
   */
  trailing?: React.ReactElement;
  /**
   * Title of the navigation item.
   */
  title?: string;
  /**
   * Accessibility label for the navigation item.
   */
  accessibilityLabel?: string;
} & MenuTriggerProps;

type MenuTriggerProps = {
  onMouseDown?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onPointerDown?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onKeyDown?: Platform.Select<{ web: React.KeyboardEventHandler; native: undefined }>;
  onKeyUp?: Platform.Select<{ web: React.KeyboardEventHandler; native: undefined }>;
  onClick?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
};
````

## Example

Below is a comprehensive example showing how to use the TopNav component with its subcomponents, including TabNav integration and responsive behavior:

```tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItems,
  TabNavItem,
  Box,
  SearchInput,
  Button,
  Tooltip,
  Avatar,
  Text,
  Menu,
  MenuHeader,
  MenuItem,
  MenuFooter,
  MenuOverlay,
  Link as BladeLink,
  Badge,
  HomeIcon,
  SearchIcon,
  ActivityIcon,
  AnnouncementIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  AcceptPaymentsIcon,
  RazorpayxPayrollIcon,
  ShoppingBagIcon,
  AwardIcon,
} from '@razorpay/blade/components';

// Helper function to determine if a route is active
const isRouteActive = (currentPath, routePath, activeOnPaths = []) => {
  if (currentPath === routePath) return true;
  if (activeOnPaths.some((path) => currentPath.startsWith(path))) return true;
  return false;
};

// Example item format for a product in the navigation
const ExploreItem = ({ icon: Icon, title, description }) => {
  return (
    <Box display="flex" gap="spacing.4">
      <Box
        borderRadius="medium"
        padding="spacing.5"
        backgroundColor="surface.background.gray.subtle"
      >
        <Icon color="interactive.icon.neutral.subtle" size="medium" />
      </Box>
      <Box>
        <Text color="surface.text.gray.subtle" size="medium" weight="semibold">
          {title}
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          {description}
        </Text>
      </Box>
    </Box>
  );
};

const AppNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update selectedProduct when route changes
  useEffect(() => {
    setSelectedProduct(location.pathname);
  }, [location.pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Product navigation items
  const navItems = [
    {
      title: 'Home',
      href: '/home',
      icon: HomeIcon,
    },
    {
      title: 'Payroll',
      href: '/payroll',
      icon: RazorpayxPayrollIcon,
      description: 'Automate payroll with ease.',
    },
    {
      title: 'Payments',
      href: '/payments',
      icon: AcceptPaymentsIcon,
      description: 'Manage payments effortlessly.',
    },
    {
      title: 'Checkout',
      href: '/checkout',
      icon: ShoppingBagIcon,
      description: 'Fast, one-click checkout.',
    },
    {
      title: 'Growth',
      href: '/growth',
      icon: AwardIcon,
      isAlwaysOverflowing: true,
      description: 'Boost your business growth.',
    },
  ];

  return (
    <TopNav>
      {isMobile ? (
        /* Mobile View */
        <>
          <BladeLink icon={HomeIcon} size="medium" href="/home">
            Home
          </BladeLink>
          <Text size="medium" weight="semibold" textAlign="center">
            {navItems.find((item) => item.href === selectedProduct)?.title || 'Dashboard'}
          </Text>
          <Menu openInteraction="click">
            <Avatar size="medium" name="Jane Smith" />
            <MenuOverlay>
              <MenuHeader title="Profile" />
              <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                <Avatar size="medium" name="Jane Smith" />
                <Box display="flex" flexDirection="column" gap="spacing.2">
                  <Text size="medium" weight="semibold">
                    Jane Smith
                  </Text>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    Business Admin
                  </Text>
                </Box>
              </Box>
              <MenuItem onClick={() => navigate('/settings')}>
                <Text color="surface.text.gray.subtle">Settings</Text>
              </MenuItem>
              <MenuItem color="negative" onClick={() => navigate('/logout')}>
                <Text color="feedback.text.negative.intense">Logout</Text>
              </MenuItem>
            </MenuOverlay>
          </Menu>
        </>
      ) : (
        /* Desktop View */
        <>
          <TopNavBrand>
            <BladeLink href="/home">Home</BladeLink>
          </TopNavBrand>

          <TopNavContent>
            <TabNav items={navItems}>
              {({ items, overflowingItems }) => {
                const activeProduct = overflowingItems.find(
                  (item) => item.href === selectedProduct,
                );

                return (
                  <>
                    <TabNavItems>
                      {items.map((item) => (
                        <TabNavItem
                          key={item.title}
                          as={Link}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          isActive={isRouteActive(location.pathname, item.href)}
                          accessibilityLabel={`Go to ${item.title}`}
                        />
                      ))}
                    </TabNavItems>

                    {overflowingItems.length > 0 && (
                      <Menu openInteraction="hover">
                        <TabNavItem
                          title={activeProduct ? `More: ${activeProduct.title}` : 'More'}
                          trailing={<ChevronDownIcon />}
                          isActive={Boolean(activeProduct)}
                          accessibilityLabel="View more navigation options"
                        />
                        <MenuOverlay>
                          <MenuHeader
                            title="Products for you"
                            trailing={
                              <Badge emphasis="subtle" color="notice">
                                Recommended
                              </Badge>
                            }
                          />
                          {overflowingItems.map((item) => (
                            <MenuItem
                              key={item.href}
                              onClick={() => {
                                navigate(item.href);
                                setSelectedProduct(item.href);
                              }}
                            >
                              <ExploreItem
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                              />
                            </MenuItem>
                          ))}
                          <MenuFooter>
                            <BladeLink
                              href="/products"
                              icon={ChevronRightIcon}
                              iconPosition="right"
                            >
                              View all products
                            </BladeLink>
                          </MenuFooter>
                        </MenuOverlay>
                      </Menu>
                    )}
                  </>
                );
              }}
            </TabNav>
          </TopNavContent>

          <TopNavActions>
            <SearchInput placeholder="Search..." accessibilityLabel="Search across application" />
            <Tooltip content="View system status">
              <Button
                variant="tertiary"
                icon={ActivityIcon}
                accessibilityLabel="View system status"
              />
            </Tooltip>
            <Tooltip content="View announcements">
              <Button
                variant="tertiary"
                icon={AnnouncementIcon}
                accessibilityLabel="View announcements"
              />
            </Tooltip>
            <Menu openInteraction="click">
              <Avatar size="medium" name="Jane Smith" />
              <MenuOverlay>
                <MenuHeader title="Profile" />
                <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                  <Avatar size="medium" name="Jane Smith" />
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Text size="medium" weight="semibold">
                      Jane Smith
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Business Admin
                    </Text>
                  </Box>
                </Box>
                <MenuItem onClick={() => navigate('/settings')}>
                  <Text color="surface.text.gray.subtle">Settings</Text>
                </MenuItem>
                <MenuItem color="negative" onClick={() => navigate('/logout')}>
                  <Text color="feedback.text.negative.intense">Logout</Text>
                </MenuItem>
              </MenuOverlay>
            </Menu>
          </TopNavActions>
        </>
      )}
    </TopNav>
  );
};

export default AppNavigation;
```

### Usage with React Router v6

When using TopNav with React Router, you need to handle the active state for navigation items by checking the current location against routes:

```tsx
import { useLocation, Link, TabNavItem } from 'react-router-dom';

// Inside your component
const location = useLocation();

// Check if a route is active
const isActive = (path) => {
  return location.pathname === path || location.pathname.startsWith(`${path}/`);
};

// Then use it with TabNavItem
<TabNavItem as={Link} to="/dashboard" title="Dashboard" isActive={isActive('/dashboard')} />;
```

### Responsive Design

The TopNav component adapts to different screen sizes by showing a simplified interface on mobile:

```tsx
import { useBreakpoint } from '@razorpay/blade/utils';
import { useTheme } from '@razorpay/blade/components';
import { TopNav } from '@razorpay/blade/components';

const MyTopNav = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <TopNav>
      {isMobile
        ? {
            /* Mobile view with essential controls */
          }
        : {
            /* Desktop view with full navigation */
          }}
    </TopNav>
  );
};
```
