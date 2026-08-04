# Dashboard Template

## Pattern Name

Dashboard Template

## Description

Dashboard Template is a full dashboard template with SideNav, TopNav and main workspace area. It also includes a navigation structure with sections and items implemented via react-router-dom.

## UI Principles

| # | Principle | Description |
|---|---|---|
| 1 | **One surface container only** | A page must have a single primary surface container. Avoid layering multiple competing containers on the same view. |
| 2 | **Balance UI from the centre** | Layout and visual weight should be anchored from the centre of the workspace. |
| 3 | **Neutral colour palette** | Use a neutral, restrained colour palette. Avoid heavy use of saturated or brand colours in the workspace content area. |
| 4 | **Navigation is always sticky / fixed** | Top Nav and Side Nav must remain fixed/sticky at all times so users always have access to navigation, regardless of scroll position. |

## Dashboard Anatomy

The dashboard shell is composed of three structural regions:

```
┌──────────────────────────────────────────────────┐
│                    TOP NAV                        │  ← Always sticky / fixed
├───────────┬──────────────────────────────────────┤
│           │                                      │
│  SIDE NAV │         WORKSPACE AREA               │
│           │                                      │
│ (sticky)  │   (scrollable content region)        │
│           │                                      │
└───────────┴──────────────────────────────────────┘
```

- **Top Nav** — Persistent horizontal bar; contains logo, primary product navigation tabs/links, and utility actions (search, notifications, account). Always fixed.
- **Side Nav** — Persistent vertical navigation panel on the left. Always fixed. Depth and items vary by Architecture Level.
- **Workspace Area** — The main scrollable region to the right of the Side Nav. All page content lives here.

## Section Types in Workspace Area

The workspace area supports three distinct section types, each mapped to a specific column grid:

| Section Type | Grid | Use Case |
|---|---|---|
| **Full Width Section** | 12-column grid | Default content pages; high-density data tables, dashboards |
| **Narrow Section** | 8-column grid | Forms, focused content, wizard flows, detail pages |
| **With Preview Section** | 6-column grid + 504px fixed aside | Settings pages where changes need a live preview panel |

## How to Build a Page

Follow these three steps to correctly design any page in the Razorpay dashboard.

### Step 1 — Choose Page Position in Architecture

| Level | Description | Side Nav State |
|---|---|---|
| **Level 0** | Top-level landing / root page | No side nav items active; minimal sidebar |
| **Level 1** | First-level section page | Single list of nav items visible in sidebar |
| **Level 2, 3** | Nested sub-pages (child of a Level 1 page) | Sidebar shows parent item + indented children |

> **Rule:** L2 and L3 pages must **always include a Back navigation element** to allow users to return to the parent page.

### Step 2 — Select Page Type in Workspace

#### L1 Page Types (Level 0 and Level 1)

| Page Type | Description |
|---|---|
| **No L1 Page Header** | Content begins immediately below the Top Nav. Used for homepages or self-describing pages. |
| **L1 Page Header** | A page-level header band sits above content. Contains page title and optional CTAs. |
| **Tabs Only** | No page header title; only a tabs row above the content. |
| **L1 Page Header + Tabs** | Combines a page header with a tabs row below it. |

#### L2 Page Types (Level 2 and Level 3)

| Page Type | Description |
|---|---|
| **L2 Page Header** | Header with a **Back** navigation link above the page title. |
| **L2 Page Header + Tabs** | Combines the L2 header (with Back) and a tabs row below it. |

### Step 3 — Choose Section Type & Layout

> **Rule:** Try to use only **one section type per page**. Mixing section types on the same page is strongly discouraged.

#### Full Width Section Layouts (12-column grid)

| Layout | Description |
|---|---|
| **Single Section** | One full-width content block with a section title |
| **Grid Layout** | Multiple content blocks in a responsive grid (1-col, 2-col, 3-col) |
| **2 Column Layout** | Two side-by-side content blocks |

#### Narrow Section Layouts (8-column grid)

| Layout | Description |
|---|---|
| **Single Section** | One centred content block (8 columns) |
| **Grid Layout** | Multiple content blocks in a grid within the 8-column space |
| **Left-Right Layout** | Label/description on left, content on right |

#### With Preview Section (6-column grid)

| Layout | Description |
|---|---|
| **Settings Page** | Content form/list on left (6 columns); fixed 504px Preview panel on right |

## Grid & Workspace Anatomy

### Desktop Dashboard Configurations

| Config | Sidebar | Breakpoint | Grid |
|---|---|---|---|
| Wide Dashboard + Sidebar Nav | Expanded | ≥ 1360px | 12-col |
| Mini Dashboard + Sidebar Nav | Collapsed/icon | 1280–1359px | 12-col (narrower) |
| Grand Dashboard + Sidebar Nav | Expanded | ≥ 1440px | 12-col (wider gutter) |
| Mobile Dashboard | Bottom Nav | ≤ 768px | Single column |

### Section Grid Details

```
12-Column (Full Width):
[ Top Nav                                              ]
[ Side Nav | Section Title                             ]
[ Side Nav | ┌──────────────────────────────────────┐ ]
[           │  Content (Slot Block)                  │ ]
[           └──────────────────────────────────────┘ ]

8-Column (Narrow):
[ Top Nav                                              ]
[ Side Nav |  [gap]  Section Title  [gap]              ]
[ Side Nav |  [gap]  ┌──────────────────┐  [gap]       ]
[           |  [gap]  │  Content Slot     │  [gap]       ]
[           |  [gap]  └──────────────────┘  [gap]       ]

6-Column + Aside (With Preview):
[ Top Nav                                              ]
[ Side Nav | Section Title   |  504px Aside (fixed)   ]
[ Side Nav | ┌────────────┐  |  ┌─────────────────┐   ]
[           │  Main Form  │  |  │  Preview Panel  │   ]
[           └────────────┘  |  └─────────────────┘   ]
```

### Mobile Blueprint

| Layer | Description |
|---|---|
| `Top Navigation` | Sticky header bar |
| `Bottom Navigation` | Fixed bottom tab bar (replaces Side Nav on mobile) |
| `Workspace` | Main scrollable content area |
| `Tabs` | Optional tab row within the workspace |
| `Breadcrumb` | Back/breadcrumb navigation for L2+ pages |
| `Bottom Sheet` | Slide-up overlay panel |

## Quick Reference Decision Tree

```
START
  │
  ├─ What level is this page in the IA?
  │     ├─ Level 0 (top-level)     → Side Nav: minimal
  │     ├─ Level 1 (section root)  → Side Nav: expanded list
  │     └─ Level 2/3 (sub-page)    → Side Nav: parent + children; add Back nav
  │
  ├─ What header does the workspace need?
  │     ├─ No header needed             → No L1 Page Header
  │     ├─ Title + CTAs only            → L1/L2 Page Header
  │     ├─ Sub-sections via tabs only   → Tabs Only
  │     └─ Title + CTAs + tab nav       → L1/L2 Page Header + Tabs
  │
  └─ What section type fits the content?
        ├─ Tables, dashboards, analytics  → Full Width (12-col)
        │     └─ Layout: Single / Grid / 2-Column
        ├─ Forms, wizards, focused tasks  → Narrow (8-col)
        │     └─ Layout: Single / Grid / Left-Right
        └─ Settings with live preview     → With Preview (6-col)
              └─ Layout: Settings page
```

## Components Used

- SideNav
- TopNav

Note: Main route entry points are inside `SideNavComponent` - If you need to add more routes, add them here.

## Example

```js
// file: navigation/NavItems.tsx
import React from 'react';
import { InfoIcon, LayoutIcon, LogInIcon } from '@razorpay/blade/components';

type NavItem = {
  icon: React.ComponentType;
  title: string;
  href: string;
  trailing?: React.ReactNode;
  items?: NavItem[];
};

type NavSection = {
  type: 'section';
  title?: string;
  maxItemsVisible: number;
  items: NavItem[];
};

export const navItemsJSON: NavSection[] = [
  {
    type: 'section',
    title: 'Layout Complexity',
    maxItemsVisible: 5,
    items: [
      {
        icon: LayoutIcon,
        title: 'Login (low)',
        href: '/app/layout-complexity/login',
      },
      {
        icon: LayoutIcon,
        title: 'Account Settings (medium)',
        href: '/app/layout-complexity/account-settings',
      },
      {
        icon: LayoutIcon,
        title: 'Insights (high)',
        href: '/app/layout-complexity/insights',
      },
    ],
  },
];


// file: navigation/TopNav.tsx
import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Heading,
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItem,
  TabNavItems,
  Menu,
  MenuItem,
  MenuOverlay,
  MenuHeader,
  MenuFooter,
  Badge,
  useTheme,
  HomeIcon,
  Button,
  Link as BladeLink,
  SearchInput,
  Avatar,
  Tooltip,
  ActivityIcon,
  AnnouncementIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  RazorpayxPayrollIcon,
  AcceptPaymentsIcon,
  MagicCheckoutIcon,
  AwardIcon,
  RazorpayXIcon,
} from '@razorpay/blade/components';
import SideNav from './SideNav';
import { isItemActive, RazorpayLogo } from './utils';

interface TabNavItemLinkProps {
  href?: string;
  title: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeOnLinks?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const TabNavItemLink = React.forwardRef<HTMLAnchorElement, TabNavItemLinkProps>((props, ref) => {
  const location = useLocation();
  return (
    <TabNavItem
      ref={ref}
      {...props}
      as={Link}
      isActive={isItemActive(location, {
        href: props.href,
        activeOnLinks: props.activeOnLinks,
      })}
    />
  );
});

TabNavItemLink.displayName = 'TabNavItemLink';

interface ExploreItemProps {
  icon: React.ComponentType<{ color: string; size: string }>;
  title: string;
  description: string;
}

const ExploreItem = ({ icon: Icon, title, description }: ExploreItemProps) => {
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

const DashboardBackground = styled.div(() => {
  return {
    height: '100vh',
    background: 'radial-gradient(94.74% 64.44% at 29.03% 15.17%, #FFFFFF 0%, #90A5BB 100%)',
  };
});

const TopNavComponent = () => {
  const { platform } = useTheme();
  const navigate = useNavigate();
  const isMobile = platform === 'onMobile';
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const activeUrl = useLocation().pathname;
  React.useEffect(() => {
    setSelectedProduct(activeUrl);
  }, [activeUrl]);

  return (
    <DashboardBackground>
      <TopNav position="relative">
        {isMobile ? (
          <>
            <BladeLink icon={HomeIcon} size="medium" href="/home">
              Home
            </BladeLink>
            <Heading textAlign="center" size="small" weight="semibold">
              Payments
            </Heading>
            <Menu openInteraction="click">
              <Avatar size="medium" name="Anurag Hazra" />
              <MenuOverlay>
                <MenuHeader title="Profile" />
                <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                  <Avatar size="medium" name="John Doe" />
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Text size="medium" weight="semibold">
                      John Doe
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Razorpay Trusted Merchant
                    </Text>
                  </Box>
                </Box>
                <MenuItem>
                  <Text color="surface.text.gray.subtle">Settings</Text>
                </MenuItem>
                <MenuItem color="negative">
                  <Text color="feedback.text.negative.intense">Logout</Text>
                </MenuItem>
              </MenuOverlay>
            </Menu>
          </>
        ) : (
          <>
            <TopNavBrand>
              <RazorpayLogo />
            </TopNavBrand>
            <TopNavContent>
              <TabNav
                items={[
                  {
                    href: '/app',
                    title: 'Payments',
                    icon: AcceptPaymentsIcon,
                    description: 'Manage payments effortlessly.',
                  },
                  {
                    href: '/banking',
                    title: 'Banking',
                    icon: RazorpayXIcon,
                    description: 'Manage your banking needs.',
                  },
                  {
                    href: '/payroll',
                    title: 'Payroll',
                    icon: RazorpayxPayrollIcon,
                    description: 'Automate payroll with ease.',
                  },
                  {
                    href: '/magic-checkout',
                    title: 'Magic Checkout',
                    icon: MagicCheckoutIcon,
                    isAlwaysOverflowing: true,
                    description: 'Fast, one-click checkout.',
                  },
                  {
                    href: '/rize',
                    title: 'Rize',
                    icon: AwardIcon,
                    isAlwaysOverflowing: true,
                    description: 'Boost your business growth.',
                  },
                ]}
              >
                {({ items, overflowingItems }) => {
                  const activeProduct = overflowingItems.find(
                    (item) => item.href === selectedProduct,
                  );
                  return (
                    <>
                      <TabNavItems>
                        {items.map((item) => {
                          return (
                            <TabNavItemLink
                              key={item.title}
                              title={item.title}
                              href={item.href}
                              icon={item.icon}
                            />
                          );
                        })}
                      </TabNavItems>
                      {overflowingItems.length > 0 ? (
                        <Menu openInteraction="hover">
                          <TabNavItem
                            title={activeProduct ? `More: ${activeProduct.title}` : 'More'}
                            trailing={<ChevronDownIcon />}
                            isActive={Boolean(activeProduct)}
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
                            {overflowingItems.map((item) => {
                              return (
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
                              );
                            })}
                            <MenuFooter>
                              <BladeLink href="" icon={ChevronRightIcon} iconPosition="right">
                                View all products
                              </BladeLink>
                            </MenuFooter>
                          </MenuOverlay>
                        </Menu>
                      ) : null}
                    </>
                  );
                }}
              </TabNav>
            </TopNavContent>
            <TopNavActions>
              <SearchInput
                placeholder="Search in payments"
                accessibilityLabel="Search Across Razorpay"
              />
              <Tooltip content="View Ecosystem Health">
                <Button size="medium" variant="tertiary" icon={ActivityIcon} />
              </Tooltip>
              <Tooltip content="View Announcements">
                <Button size="medium" variant="tertiary" icon={AnnouncementIcon} />
              </Tooltip>
              <Menu openInteraction="click">
                <Avatar size="medium" name="Anurag Hazra" />
                <MenuOverlay>
                  <MenuHeader title="Profile" />
                  <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                    <Avatar size="medium" name="John Doe" />
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="medium" weight="semibold">
                        John Doe
                      </Text>
                      <Text size="xsmall" color="surface.text.gray.muted">
                        Razorpay Trusted Merchant
                      </Text>
                    </Box>
                  </Box>
                  <MenuItem>
                    <Text color="surface.text.gray.subtle">Settings</Text>
                  </MenuItem>
                  <MenuItem color="negative">
                    <Text color="feedback.text.negative.intense">Logout</Text>
                  </MenuItem>
                </MenuOverlay>
              </Menu>
            </TopNavActions>
          </>
        )}
      </TopNav>
      <Box
        overflow="hidden"
        position="relative"
        borderRadius="large"
        borderTopRightRadius="none"
        borderBottomLeftRadius="none"
        borderBottomRightRadius="none"
        height="calc(100vh - 56px)"
        marginX={{
          base: 'spacing.0',
          m: 'spacing.3',
        }}
      >
        <SideNav
          isOpen={isSideBarOpen}
          onDismiss={() => {
            setIsSideBarOpen(false);
          }}
        />
      </Box>
    </DashboardBackground>
  );
};

export default TopNavComponent;

// file: navigation/SideNav.tsx
import React from 'react';
import { matchPath, useLocation, Link, Routes, Route } from 'react-router-dom';
import {
  SideNavBody,
  SideNav,
  SideNavLink,
  SideNavLevel,
  SideNavSection,
  SideNavFooter,
  SideNavItem,
  Box,
  Indicator,
  Switch as BladeSwitch,
  BoxIcon,
  SettingsIcon,
  UserIcon,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
} from '@razorpay/blade/components';
import Example from '../pages/Example';
import { navItemsJSON } from './NavItems';

// Define interfaces for navigation items (used only for type checking)
interface NavItem {
  icon?: React.ComponentType;
  title: string;
  href?: string;
  items?: NavItem[];
  trailing?: React.ReactNode;
  activeOnLinks?: string[];
}

/**
 * Returns all hrefs in child tree for given item
 */
const getAllChildHrefs = (items: NavItem[]): string[] => {
  const hrefs: string[] = [];

  items.forEach((item) => {
    if (item.href) {
      hrefs.push(item.href);
    }
    if (item.items) {
      hrefs.push(...getAllChildHrefs(item.items));
    }
  });

  return hrefs;
};

/**
 * Returns if the given href or one of the items from activeOnLinks are active
 */
const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
) => {
  const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));

  const isSubItemActive = Boolean(
    activeOnLinks?.find((link) => matchPath(location.pathname, link)),
  );

  return isCurrentPathActive || isSubItemActive;
};

/**
 * React Router v6 Wrapper around Blade's SideNavLink that passes active state of item based on react router state
 */
const NavLink = (props: {
  icon?: React.ComponentType;
  title: string;
  href?: string;
  items?: unknown[];
  activeOnLinks?: string[];
  children?: React.ReactNode;
  as?: React.ElementType;
  [key: string]: unknown;
}) => {
  const location = useLocation();

  return (
    // @ts-expect-error - SideNavLink has strict type requirements for trailing prop that we need to bypass. Will figure this out later if needed.
    <SideNavLink
      {...props}
      as={Link}
      isActive={isItemActive(location, {
        href: props.href,
        activeOnLinks: props.activeOnLinks,
      })}
    />
  );
};

const SideNavComponent = ({ isOpen, onDismiss }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(isOpen);
  const [isTestModeActive, setIsTestModeActive] = React.useState(false);
  const location = useLocation();

  /**
   * Keeps the section expanded on load if one if the items are active
   */
  const getDefaultSectionExpanded = (items: NavItem[]) => {
    const activeItem = items.find((l1Item) =>
      isItemActive(location, {
        href: l1Item.href,
        activeOnLinks: l1Item.items ? getAllChildHrefs(l1Item.items) : undefined,
      }),
    );

    return Boolean(activeItem);
  };

  return (
    <>
      <SideNav
        isOpen={isMobileOpen}
        onDismiss={() => {
          onDismiss();
          setIsMobileOpen(false);
        }}
        position="absolute"
      >
        <SideNavBody>
          {navItemsJSON.map((l1Sections) => {
            return (
              <SideNavSection
                key={l1Sections.title}
                title={l1Sections.title}
                maxVisibleItems={l1Sections.maxItemsVisible}
                defaultIsExpanded={getDefaultSectionExpanded(
                  l1Sections.items.slice(l1Sections.maxItemsVisible),
                )}
              >
                {l1Sections.items.map((l1Item) => {
                  if (!l1Item.items) {
                    return <NavLink key={l1Item.title} {...l1Item} />;
                  }

                  return (
                    <NavLink
                      key={l1Item.title}
                      {...l1Item}
                      activeOnLinks={getAllChildHrefs(l1Item.items)}
                      href={l1Item.items[0].href}
                    >
                      <SideNavLevel key={l1Item.title}>
                        {l1Item.items.map((l2Item) => {
                          if (!l2Item.items) {
                            return <NavLink key={l2Item.title} {...l2Item} />;
                          }

                          return (
                            <NavLink
                              key={l2Item.title}
                              {...l2Item}
                              activeOnLinks={getAllChildHrefs(l2Item.items)}
                              href={undefined}
                            >
                              <SideNavLevel key={l2Item.title}>
                                {l2Item.items.map((l3Item) => {
                                  return <NavLink key={l3Item.title} {...l3Item} />;
                                })}
                              </SideNavLevel>
                            </NavLink>
                          );
                        })}
                      </SideNavLevel>
                    </NavLink>
                  );
                })}
              </SideNavSection>
            );
          })}
        </SideNavBody>
        <SideNavFooter>
          <SideNavItem
            as="label"
            title="Test Mode"
            leading={
              <Indicator
                color={isTestModeActive ? 'notice' : 'positive'}
                emphasis="intense"
                accessibilityLabel=""
              />
            }
            backgroundColor={isTestModeActive ? 'feedback.background.notice.subtle' : undefined}
            trailing={
              <BladeSwitch
                accessibilityLabel=""
                size="small"
                isChecked={isTestModeActive}
                onChange={({ isChecked }) => {
                  setIsTestModeActive(isChecked);
                }}
              />
            }
          />
          <NavLink
            title="Settings"
            icon={SettingsIcon}
            href="/settings/user"
            activeOnLinks={['/settings/user', '/settings/account']}
          >
            <SideNavLevel>
              <NavLink icon={UserIcon} title="User Settings" href="/settings/user" />
              <NavLink icon={BoxIcon} title="Account Settings" href="/settings/account" />
            </SideNavLevel>
          </NavLink>
        </SideNavFooter>
      </SideNav>
      <Box
        marginLeft={{
          base: '100%',
          m: `${SIDE_NAV_EXPANDED_L1_WIDTH_BASE}px`,
          xl: `${SIDE_NAV_EXPANDED_L1_WIDTH_XL}px`,
        }}
        height="calc(100vh - 58px)"
      >
        <Box
          height="100%"
          overflowY="scroll"
          backgroundColor="surface.background.gray.intense"
        >
          {/* Main route entry points are here, add more routes here if needed */}
          <Routes>
            <Route path="/app/home" element={<Home />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default SideNavComponent;

// file: navigation/utils.tsx
import React from 'react';
import { matchPath } from 'react-router-dom';

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
) => {
  const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));

  const isSubItemActive = Boolean(
    activeOnLinks?.find((link) => matchPath(location.pathname, link)),
  );

  return isCurrentPathActive || isSubItemActive;
};

const RazorpayLogo = () => {
  return (
    <img width="116" height="24" src="https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png" />
  );
};

export { isItemActive, RazorpayLogo };

// file: index.tsx
// Index entry point
import React from 'react';
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import TopNav from '../navigation/TopNav';

const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: ${(props) => props.theme.typography.fonts.family.text}
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${(props) => props.theme.typography.fonts.family.heading};
}
`;

function AppWrapper() {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <GlobalStyles />
      <BrowserRouter>
        <TopNav />
      </BrowserRouter>
    </BladeProvider>
  );
}

export default AppWrapper;
```
