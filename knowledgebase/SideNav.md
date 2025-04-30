## Component Name

SideNav

## Description

The SideNav component provides a responsive side navigation layout positioned along the left side of the screen. It enables quick access to different sections or functionalities of an application with support for multi-level navigation, collapsible sections, and mobile responsiveness. SideNav supports both standalone usage and integration with routing libraries like React Router.

## TypeScript Types

The following types represent the props that the SideNav component and its subcomponents accept. These types help configure the navigation structure properly.

````typescript
/**
 * Props for the SideNav component
 */
type SideNavProps = {
  /**
   * Children slot.
   *
   * Supports SideNavFooter, SideNavBody
   */
  children: React.ReactNode;
  /**
   * Only applicable in mobile
   *
   * State for opening / closing the SideNav in mobile
   */
  isOpen?: DrawerProps['isOpen'];
  /**
   * Only applicable in mobile
   *
   * Callback when SideNav is closed
   */
  onDismiss?: DrawerProps['onDismiss'];
  /**
   * Callback that gets triggered when L1 is collapsed or expanded.
   *
   * This callback gets triggered when you-
   * - Select the active link changes between L1 and L2 which can collapse or expand the L1
   * - When you hover / unhover L1 in collapsed state which can temporarily expand the L1
   */
  onVisibleLevelChange?: ({ visibleLevel }: { visibleLevel: number }) => void;
  /**
   * Banner slot for usecases like adding Activation Panel
   *
   * IMPORTANT: Avoid adding promotional items in this
   */
  banner?: React.ReactElement;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the SideNavLink component
 */
type SideNavLinkProps = {
  /**
   * title of the Link
   */
  title: string;
  /**
   * description of the Link
   *
   * Note: Only applicable for L2 items
   */
  description?: string;
  /**
   * Slot after the title.
   *
   * Used for <Badge />, <Counter /> in most cases
   */
  titleSuffix?: React.ReactElement;
  /**
   * Trailing slot for item. Only visible on hover of the item
   *
   * Used for <Button />
   */
  trailing?: React.ReactElement;
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
   * ```jsx
   * import { Link } from 'react-router-dom';
   *
   * <SideNavLink as={Link} />
   * ```
   */
  as: React.ComponentType<any>;
  /**
   * Set Active state of SideNavLink.
   *
   * Checkout SideNav documentation for usage
   */
  isActive?: boolean;
  /**
   * Leading icon for SideNavLink
   */
  icon?: IconComponent;
  /**
   * Children slot to add Nested Menu
   *
   * ```jsx
   * <SideNavLink title="L2 Trigger" href="/l2-first-item">
   *  <SideNavLevel>
   *    <SideNavLink title="L2 Item" href="/l2-first-item" />
   *    <SideNavLink title="L2 Item 2" href="/l2-second-item" />
   *  </SideNavLevel>
   * </SideNavLink>
   * ```
   */
  children?: React.ReactElement;
  /**
   * Tooltip object to add tooltip to SideNavLink
   *
   * ```jsx
   * <SideNavLink
   *  tooltip={{
   *    title: 'Tooltip Title',
   *    content: 'Tooltip description'
   *  }}
   * />
   * ```
   */
  tooltip?: TooltipifyComponentProps['tooltip'];
  /**
   * Click handler for the link
   */
  onClick?: (event: React.MouseEvent) => void;
} & DataAnalyticsAttribute;

/**
 * Props for the SideNavSection component
 */
type SideNavSectionProps = {
  /**
   * Title of the section
   */
  title?: string;
  /**
   * Number of items after which the items are collapsed into `+x more`
   */
  maxVisibleItems?: number;
  /**
   * Default value if the nav section is expanded or collapsed after maxVisibleItems
   *
   * @default false
   */
  defaultIsExpanded?: boolean;
  /**
   * Callback when `+x more is clicked`
   */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;
  /**
   * Children slot for SideNavLink
   */
  children: React.ReactElement[];
} & DataAnalyticsAttribute;

/**
 * Props for the SideNavItem component
 */
type SideNavItemProps = {
  /**
   * Leading slot for SideNavItem.
   *
   * Meant for Indicator, Icon, etc
   */
  leading: React.ReactElement;
  /**
   * Trailing slot for SideNavItem.
   *
   * Meant for Button, Switch, etc
   */
  trailing: React.ReactElement;
  /**
   * Title of SideNavItem
   */
  title: string;
  /**
   * Render item of container. Use as="label" when using Switch or form input in trailing
   *
   * @default div
   */
  as?: 'label' | 'div';
  /**
   * backgroundColor of the item
   *
   * @default undefined
   */
  backgroundColor?: BaseBoxProps['backgroundColor'];
  /**
   * Tooltip object to add tooltip to SideNavItem
   *
   * ```jsx
   * <SideNavItem
   *  tooltip={{
   *    title: 'Tooltip Title',
   *    content: 'Tooltip description'
   *  }}
   * />
   * ```
   */
  tooltip?: SideNavLinkProps['tooltip'];
} & DataAnalyticsAttribute;

/**
 * Props for the SideNavFooter component
 */
type SideNavFooterProps = {
  /**
   * Children slot for SideNavLink, SideNavItem
   */
  children: React.ReactElement[] | React.ReactElement;
};

/**
 * Props for the SideNavBody component
 */
type SideNavBodyProps = {
  /**
   * Children slot for SideNavSection components
   */
  children: React.ReactElement | React.ReactElement[];
};

/**
 * Props for the SideNavLevel component
 */
type SideNavLevelProps = {
  /**
   * Children slot for nested SideNavLink components
   */
  children: React.ReactElement | React.ReactElement[];
};

/**
 * For component testing
 */
type TestID = {
  /**
   * Test ID for testing environments
   *
   * @see https://testing-library.com/docs/queries/bytestid/
   */
  testID?: string;
};

/**
 * For analytics tracking
 */
type DataAnalyticsAttribute = {
  /**
   * Data analytics attributes for tracking user interactions
   * The key is always `data-analytics-` followed by the attribute name
   * E.g., `data-analytics-section="sidebar"`
   */
  [key: `data-analytics-${string}`]: string;
};
````

## Example

Here's a comprehensive example of the SideNav component that demonstrates multi-level navigation with React Router integration, custom styling, accessibility features, and interactive elements:

```tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Link, useLocation, matchPath } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLink,
  SideNavLevel,
  SideNavSection,
  SideNavItem,
  Box,
  Card,
  CardBody,
  Text,
  ProgressBar,
  Indicator,
  Switch,
  Button,
  Tooltip,
  HomeIcon,
  SettingsIcon,
  UserIcon,
  CreditCardIcon,
  BillIcon,
  WalletIcon,
  MenuIcon,
  PlusIcon,
  BankIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from '@razorpay/blade/components';

// Custom activation card for the banner slot
const ActivationCard = () => {
  return (
    <Card href="/activate" padding="spacing.4" elevation="none">
      <CardBody>
        <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
          <Text size="medium" weight="semibold">
            Activation Pending
          </Text>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Box>
        <ProgressBar
          label="Progress"
          showPercentage={true}
          value={50}
          accessibilityLabel="Activation progress: 50% complete"
        />
      </CardBody>
    </Card>
  );
};

// Navigation link with proper active state handling
const NavLink = (props) => {
  const location = useLocation();

  // Helper function to check if a link is active
  const isItemActive = (pathname, { href, activeOnLinks }) => {
    const isCurrentPathActive = matchPath(pathname, {
      path: href,
      exact: false,
    });

    const isSubItemActive = activeOnLinks?.some((link) =>
      matchPath(pathname, { path: link, exact: false }),
    );

    return Boolean(isCurrentPathActive || isSubItemActive);
  };

  return (
    <SideNavLink
      {...props}
      as={Link}
      isActive={isItemActive(location.pathname, {
        href: props.href,
        activeOnLinks: props.activeOnLinks,
      })}
    />
  );
};

// Main SideNav component with all features
const SideNavExample = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTestModeActive, setIsTestModeActive] = useState(false);
  const location = useLocation();

  // Helper to get all child hrefs for managing active states
  const getAllChildHrefs = (items) => {
    if (!items) return [];

    const hrefs = [];
    items.forEach((item) => {
      if (item.href) hrefs.push(item.href);
      if (item.items) hrefs.push(...getAllChildHrefs(item.items));
    });

    return hrefs;
  };

  // Define navigation items (typically would come from an API or config)
  const navigationItems = [
    {
      type: 'section',
      items: [
        {
          icon: HomeIcon,
          title: 'Dashboard',
          href: '/dashboard',
          'data-analytics-section': 'main-nav',
          'data-analytics-element': 'dashboard',
        },
        {
          icon: WalletIcon,
          title: 'Payments',
          href: '/payments',
          tooltip: {
            content: 'View all payment transactions',
            placement: 'right',
          },
          trailing: (
            <Tooltip content="Create new payment (Ctrl+N)" placement="right">
              <Button
                icon={PlusIcon}
                size="xsmall"
                variant="tertiary"
                accessibilityLabel="Create new payment"
              />
            </Tooltip>
          ),
          'data-analytics-section': 'main-nav',
          'data-analytics-element': 'payments',
        },
      ],
    },
    {
      type: 'section',
      title: 'Banking',
      maxVisibleItems: 3,
      items: [
        {
          icon: CreditCardIcon,
          title: 'Credit Cards',
          href: '/banking/credit-cards',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'credit-cards',
          items: [
            {
              title: 'Physical Cards',
              href: '/banking/credit-cards/physical',
              description: 'RBL20I43',
              'data-analytics-section': 'banking',
              'data-analytics-element': 'physical-cards',
            },
            {
              title: 'Virtual Cards',
              href: '/banking/credit-cards/virtual',
              description: 'VIR32L98',
              'data-analytics-section': 'banking',
              'data-analytics-element': 'virtual-cards',
            },
          ],
        },
        {
          icon: BankIcon,
          title: 'Bank Accounts',
          href: '/banking/accounts',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'bank-accounts',
        },
        {
          icon: BillIcon,
          title: 'Statements',
          href: '/banking/statements',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'statements',
        },
        {
          icon: ArrowUpRightIcon,
          title: 'Transfers',
          href: '/banking/transfers',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'transfers',
        },
      ],
    },
  ];

  return (
    <Box height="100vh" position="relative">
      <SideNav
        isOpen={isMobileOpen}
        onDismiss={() => setIsMobileOpen(false)}
        onVisibleLevelChange={({ visibleLevel }) => console.log('Visible level:', visibleLevel)}
        banner={<ActivationCard />}
        testID="main-navigation"
        position="absolute"
        elevation="raised"
      >
        <SideNavBody>
          {navigationItems.map((section, sectionIndex) => {
            // Calculate whether section should be expanded by default
            const sectionItems = section.items || [];
            const hasActiveItem = sectionItems.some(
              (item) =>
                matchPath(location.pathname, { path: item.href, exact: false }) ||
                getAllChildHrefs(item.items).some((childHref) =>
                  matchPath(location.pathname, { path: childHref, exact: false }),
                ),
            );

            return (
              <SideNavSection
                key={`section-${sectionIndex}`}
                title={section.title}
                maxVisibleItems={section.maxVisibleItems}
                defaultIsExpanded={hasActiveItem}
                onExpandChange={({ isExpanded }) =>
                  console.log(`Section "${section.title}" expanded:`, isExpanded)
                }
                data-analytics-section={`nav-section-${sectionIndex}`}
              >
                {sectionItems.map((item, itemIndex) => {
                  if (!item.items) {
                    return <NavLink key={`item-${itemIndex}`} {...item} />;
                  }

                  // For items with children, create nested navigation
                  const childHrefs = getAllChildHrefs(item.items);

                  return (
                    <NavLink
                      key={`item-${itemIndex}`}
                      {...item}
                      activeOnLinks={childHrefs}
                      href={item.items[0]?.href || item.href}
                    >
                      <SideNavLevel>
                        {item.items?.map((subItem, subIndex) => (
                          <NavLink
                            key={`subitem-${subIndex}`}
                            {...subItem}
                            description={subItem.description}
                          />
                        ))}
                      </SideNavLevel>
                    </NavLink>
                  );
                })}
              </SideNavSection>
            );
          })}
        </SideNavBody>

        <SideNavFooter>
          {/* Test mode toggle with accessibility improvements */}
          <SideNavItem
            as="label"
            title="Test Mode"
            leading={
              <Indicator
                color={isTestModeActive ? 'notice' : 'positive'}
                emphasis="intense"
                accessibilityLabel={isTestModeActive ? 'Test mode enabled' : 'Test mode disabled'}
              />
            }
            backgroundColor={isTestModeActive ? 'feedback.background.notice.subtle' : undefined}
            trailing={
              <Switch
                accessibilityLabel="Toggle test mode"
                size="small"
                isChecked={isTestModeActive}
                onChange={({ isChecked }) => setIsTestModeActive(isChecked)}
              />
            }
            data-analytics-section="footer"
            data-analytics-element="test-mode-toggle"
          />

          {/* Settings navigation with nested items */}
          <NavLink
            title="Settings"
            icon={SettingsIcon}
            href="/settings"
            activeOnLinks={['/settings/user', '/settings/account']}
            data-analytics-section="footer"
            data-analytics-element="settings"
          >
            <SideNavLevel>
              <NavLink
                icon={UserIcon}
                title="User Settings"
                href="/settings/user"
                data-analytics-section="settings"
                data-analytics-element="user-settings"
              />
              <NavLink
                icon={SettingsIcon}
                title="Account Settings"
                href="/settings/account"
                data-analytics-section="settings"
                data-analytics-element="account-settings"
              />
            </SideNavLevel>
          </NavLink>
        </SideNavFooter>
      </SideNav>

      {/* Mobile menu toggle button */}
      <Box
        display={{ base: 'block', m: 'none' }}
        position="fixed"
        top="spacing.4"
        right="spacing.4"
        zIndex="2"
      >
        <Button
          variant="tertiary"
          icon={MenuIcon}
          onClick={() => setIsMobileOpen(true)}
          accessibilityLabel="Open navigation menu"
        />
      </Box>

      {/* Main content area with proper spacing based on SideNav */}
      <Box marginLeft={{ base: 'spacing.0', m: '300px' }} padding="spacing.4" height="100%">
        {/* Your application content goes here */}
      </Box>
    </Box>
  );
};

// Wrap with Router for actual usage
const App = () => (
  <Router>
    <SideNavExample />
  </Router>
);

export default App;
```
