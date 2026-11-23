## Component Name

SideNav

## Description

The SideNav component provides a responsive side navigation layout positioned along the left side of the screen. It enables quick access to different sections or functionalities of an application with support for multi-level navigation, collapsible sections, and mobile responsiveness. SideNav supports both standalone usage and integration with routing libraries like React Router.

## Important Constraints

- `SideNavLink`: `as` prop requires React Router's Link. Always install React Router while using this component. Example:

  ```jsx
  import { Link } from 'react-router-dom';

  <SideNavLink as={Link} />;
  ```

- Explicitly add `position` prop to `SideNav` component to ensure it is positioned correctly.

## TypeScript Types

The following types represent the props that the SideNav component and its subcomponents accept. These types help configure the navigation structure properly.

```typescript
/**
 * Gray surface background color tokens
 */
type SideNavBackgroundColor =
  | 'surface.background.gray.subtle'
  | 'surface.background.gray.moderate'
  | 'surface.background.gray.intense';

/**
 * Blade icon component, for example `CheckIcon` from `@razorpay/blade/components`
 */
type IconComponent = React.ComponentType<any>;

/**
 * Subset of Blade LinkProps used in this doc
 */
type LinkProps = {
  href?: string;
  target?: string;
  rel?: string;
};

/**
 * Subset of Blade DrawerProps used in this doc
 */
type DrawerProps = {
  isOpen?: boolean;
  onDismiss?: () => void;
};

/**
 * Tooltip config, same as Tooltip component props
 */
type TooltipifyComponentProps = {
  tooltip?: {
    title?: string;
    content: string;
    placement?: 'top' | 'right' | 'bottom' | 'left';
  };
};

/**
 * Blade background color token, for example `surface.background.gray.subtle`
 */
type BackgroundColorToken = string;

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
   * Callback that gets triggered when controlled full expand state changes.
   *
   * **Only applicable in desktop**
   */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;
  /**
   * Callback that gets triggered when controlled full expand/collapse transition ends.
   *
   * **Only applicable in desktop**
   */
  onExpandTransitionEnd?: ({ isExpanded }: { isExpanded: boolean }) => void;
  /**
   * **Only applicable in desktop**
   *
   * Controls whether SideNav should remain fully expanded.
   * - `true` (default): existing behavior with hover-based temporary expansion.
   * - `false`: keeps SideNav collapsed and disables hover/focus-based expansion.
   */
  isExpanded?: boolean;
  /**
   * Banner slot for usecases like adding Activation Panel
   *
   * IMPORTANT: Avoid adding promotional items in this
   */
  banner?: React.ReactElement;
  /**
   * Sets background color of the SideNav surface.
   *
   * @default `surface.background.gray.moderate`
   */
  backgroundColor?: SideNavBackgroundColor;
  /**
   * Position of the SideNav.
   *
   * It is position="fixed" by default with top="spacing.0" and left="spacing.0" and height="100%"
   *
   * @default 'fixed'
   */
  position?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky';
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
   * Trailing slot for item. Sits at the end of the item, on top of the link.
   *
   * By default it is visible on hover of the item and while the item has keyboard focus.
   * Use `trailingVisibility` to keep it visible.
   *
   * The item keeps room for it, so a long title truncates 12px before the trailing slot
   * instead of running under it.
   *
   * On an item that opens the next level (L2 trigger), the chevron moves next to the title
   * and trailing takes the end of the item.
   *
   * Used for <Button />, <IconButton />
   */
  trailing?: React.ReactElement;
  /**
   * Controls when the trailing slot is visible
   *
   * - `on-hover`: visible on hover of the item and while the item has keyboard focus
   * - `always`: always visible.
   *   Use it when trailing shows the state of the item, e.g. a pinned item that can be unpinned
   *
   * @default 'on-hover'
   */
  trailingVisibility?: 'on-hover' | 'always';
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
   * import { Link } from 'react-router-dom';
   *
   * <SideNavLink as={Link} />
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
   * <SideNavLink title="L2 Trigger" href="/l2-first-item">
   *  <SideNavLevel>
   *    <SideNavLink title="L2 Item" href="/l2-first-item" />
   *    <SideNavLink title="L2 Item 2" href="/l2-second-item" />
   *  </SideNavLevel>
   * </SideNavLink>
   */
  children?: React.ReactElement;
  /**
   * Tooltip object to add tooltip to SideNavLink
   *
   * <SideNavLink
   *  tooltip={{
   *    title: 'Tooltip Title',
   *    content: 'Tooltip description'
   *  }}
   * />
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
  leading: React.ReactElement | IconComponent;
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
  backgroundColor?: BackgroundColorToken;
  /**
   * Tooltip object to add tooltip to SideNavItem
   *
   * <SideNavItem
   *  tooltip={{
   *    title: 'Tooltip Title',
   *    content: 'Tooltip description'
   *  }}
   * />
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
  /**
   * Slot after the title of the level.
   *
   * @default undefined
   */
  titleSuffix?: React.ReactElement;
};
```

### SideNavVisibility

```typescript
type SideNavVisibilityProps = {
  /**
   * State of the SideNav in which the children are visible
   *
   * - `expanded`: visible while SideNav shows titles of items. Hidden when it collapses to icons
   * - `collapsed`: visible only while SideNav is collapsed to icons
   */
  visibleWhen: 'expanded' | 'collapsed';
  /**
   * Content to show or hide with the collapsed state of SideNav
   */
  children: React.ReactElement | React.ReactElement[];
} & DataAnalyticsAttribute;
```

Use `SideNavVisibility` for your own content inside `SideNav` (e.g. a custom "+3 More" link) so it hides or shows with the collapsed state like Blade's own items. Do not hard-code Blade's class names for this.

## Usage Guidelines

**Do**

- Use `SideNav` for complex, hierarchical navigation with 5+ items and multi-level nesting (L1, L2, L3).
- Pass the `as` prop on `SideNavLink` with your router's link component (e.g., React Router `Link`) — it's required.
- Manage active state externally using `isActive` prop with `useLocation()` and `matchPath()`.
- Use `SideNavSection` to group related links under collapsible headings.
- Use `SideNavFooter` for utility items like Settings or Test Mode toggles.
- Use the `banner` slot only for critical activation or onboarding UI, not promotions.
- Pair with `SkipNav` for keyboard accessibility to let users skip past the navigation.
- Use `trailingVisibility="always"` on a `SideNavLink` when its `trailing` shows the state of the item (e.g. a pin on a pinned item). Leave the default (`on-hover`) for a shortcut action.
- Use `SideNavVisibility` for your own content inside `SideNav` that should show only in the expanded state or only in the collapsed (icons) state, e.g. a "+3 More" link.

**Don't**

- Don't use `SideNav` for simple mobile-only navigation with 2–5 items — use `BottomNav` instead.
- Don't use `SideNav` without a routing library integration — the `as` prop requires a router component.
- Don't put promotional content in the `banner` slot — it's reserved for critical UI like activation cards.
- Don't expect automatic active state detection — Blade is routing-library agnostic, so consumers manage it.
- Don't use `SideNavItem` for navigable links — it's for static items with trailing interactions like switches.
- Don't hard-code Blade's class names (`hide-when-collapsed`, `show-when-collapsed`) to follow the collapsed state — use `SideNavVisibility`.
- Don't use `SideNavVisibility` outside `SideNav` — it throws an error.

## Example

### Comprehensive SideNav with React Router Integration

This example demonstrates a fully-featured SideNav implementation with multi-level navigation, React Router integration, dynamic active state handling, nested sections, responsive design for mobile, and interactive elements like a test mode toggle and activation banner.

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

### Pinned Items with `trailingVisibility` and `SideNavVisibility`

This example shows items that can be pinned. A pinned item moves to the top and keeps its pin visible with `trailingVisibility="always"`; other items show their pin on hover or keyboard focus. The title truncates 12px before the pin, and on an item that opens the next level the chevron sits next to the title. `SideNavVisibility` swaps a "+3 More" link for "+3" when the SideNav collapses to icons.

```tsx
import React, { useState } from 'react';
import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavLink,
  SideNavLevel,
  SideNavVisibility,
  IconButton,
  Link,
  Box,
  PinIcon,
  PaymentLinkIcon,
  MagicCheckoutIcon,
  InvoicesIcon,
} from '@razorpay/blade/components';
import type { IconComponent } from '@razorpay/blade/components';

type NavItem = {
  id: string;
  title: string;
  href: string;
  icon: IconComponent;
  nextLevel?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
  { id: 'payment-links', title: 'Payment Links', href: '/payment-links', icon: PaymentLinkIcon },
  {
    id: 'magic-checkout',
    title: 'Magic Checkout',
    href: '/magic-checkout/orders',
    icon: MagicCheckoutIcon,
    nextLevel: [
      { title: 'Orders', href: '/magic-checkout/orders' },
      { title: 'Settings', href: '/magic-checkout/settings' },
    ],
  },
  { id: 'invoices', title: 'Invoices', href: '/invoices', icon: InvoicesIcon },
];

const PinnableSideNav = ({ isExpanded }: { isExpanded: boolean }) => {
  const location = useLocation();
  const [pinnedIds, setPinnedIds] = useState<string[]>(['payment-links']);

  const isActive = (href: string) => Boolean(matchPath(location.pathname, { path: href }));
  const togglePin = (id: string) =>
    setPinnedIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  // Pinned items first, in the order they were pinned. The rest keep their original order
  const orderedItems = [
    ...pinnedIds.flatMap((id) => navItems.filter((item) => item.id === id)),
    ...navItems.filter((item) => !pinnedIds.includes(item.id)),
  ];

  return (
    <SideNav isExpanded={isExpanded}>
      <SideNavBody>
        {orderedItems.map((item) => {
          const isPinned = pinnedIds.includes(item.id);

          return (
            <SideNavLink
              key={item.id}
              as={RouterLink}
              icon={item.icon}
              title={item.title}
              href={item.href}
              isActive={
                item.nextLevel
                  ? item.nextLevel.some(({ href }) => isActive(href))
                  : isActive(item.href)
              }
              // Pinned: the pin is always visible. Not pinned: it shows on hover and keyboard focus
              trailingVisibility={isPinned ? 'always' : 'on-hover'}
              trailing={
                <IconButton
                  icon={PinIcon}
                  accessibilityLabel={isPinned ? `Unpin ${item.title}` : `Pin ${item.title} to top`}
                  onClick={() => togglePin(item.id)}
                />
              }
            >
              {item.nextLevel ? (
                <SideNavLevel>
                  {item.nextLevel.map((l2Item) => (
                    <SideNavLink
                      key={l2Item.href}
                      as={RouterLink}
                      title={l2Item.title}
                      href={l2Item.href}
                      isActive={isActive(l2Item.href)}
                    />
                  ))}
                </SideNavLevel>
              ) : undefined}
            </SideNavLink>
          );
        })}

        {/* Your own content that follows the collapsed state of SideNav */}
        <SideNavVisibility visibleWhen="expanded">
          <Box paddingX="spacing.4" paddingY="spacing.2">
            <Link variant="button" size="small" color="neutral">
              +3 More
            </Link>
          </Box>
        </SideNavVisibility>
        <SideNavVisibility visibleWhen="collapsed">
          <Box paddingX="spacing.4" paddingY="spacing.2">
            <Link variant="button" size="small" color="neutral">
              +3
            </Link>
          </Box>
        </SideNavVisibility>
      </SideNavBody>
    </SideNav>
  );
};

export default PinnableSideNav;
```
