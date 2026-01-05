// @ts-nocheck
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
import Login from '../pages/layout-complexity/Login';
import AccountSettings from '../pages/layout-complexity/AccountSettings';
import Insights from '../pages/layout-complexity/Insights';
import DeveloperConsole from '../pages/component-density/DeveloperConsole';
import Signup from '../pages/component-density/Signup';
import TransactionCard from '../pages/component-density/TransactionCard';
import VisualTestingScreen from '../pages/testing/VisualTestingScreen';
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
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
}): JSX.Element => {
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const SideNavComponent = ({ isOpen, onDismiss }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(isOpen);
  const [isTestModeActive, setIsTestModeActive] = React.useState(false);
  const location = useLocation();

  /**
   * Keeps the section expanded on load if one if the items are active
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
          id="screenshot-element"
        >
          <Routes>
            <Route path="/layout-complexity/login" element={<Login />} />
            <Route path="/layout-complexity/account-settings" element={<AccountSettings />} />
            <Route path="/layout-complexity/insights" element={<Insights />} />

            <Route path="/component-density/developer-console" element={<DeveloperConsole />} />
            <Route path="/component-density/signup" element={<Signup />} />
            <Route path="/component-density/transaction-card" element={<TransactionCard />} />

            <Route path="/testing/visual-testing" element={<VisualTestingScreen />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default SideNavComponent;
