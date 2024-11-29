import dedent from 'dedent';

export const sideNavWithReactRouter = {
  'App.js': dedent`import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import SideNavExample from './SideNavExample';
  
  const App = () => {
    return (
      <BrowserRouter>
        <SideNavExample />
      </BrowserRouter>
    );
  };

  export default App;
  `,
  'SideNavExample.js': dedent`import React from 'react';
  import {
    matchPath,
    useLocation,
    Link,
    Routes,
    Route,
  } from 'react-router-dom';
  import {
    SideNavBody,
    SideNav,
    SideNavLink,
    SideNavLevel,
    SideNavSection,
    SideNavFooter,
    SideNavItem,
    Box,
    Button,
    Indicator,
    Text,
    Switch as BladeSwitch,
    BoxIcon,
    SettingsIcon,
    UserIcon,
    MenuIcon,
  } from '@razorpay/blade/components';
  import { navItemsJSON } from './navItemsJSON';

  const Page = ({ match }) => (
    <Box padding={{ base: 'spacing.2', m: 'spacing.6' }}>
      <pre>
        <code>{JSON.stringify(match, null, 4)}</code>
      </pre>
    </Box>
  );
  
  /**
   * Returns all hrefs in child tree for given item
   */ 
  const getAllChildHrefs = (
    items
  ) => {
    const hrefs = [];

    if (!items) {
      return [];
    }

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
   * Loops over JSON to return all routes including child routes 
   */ 
  const getAllRoutesFromJSON = () => {
    let allHrefs = [];

    navItemsJSON.forEach((section) => {
      if (section.items) {
        allHrefs = allHrefs.concat(getAllChildHrefs(section.items));
      }
    });

    return allHrefs;
  };

  /**
   * Returns if the given href or one of the items from activeOnLinks are active
   */ 
  const isItemActive = (
    location,
    { href, activeOnLinks }
  ) => {
    const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));

    const isSubItemActive = Boolean(
      activeOnLinks?.find((href) => matchPath(location.pathname, href))
    );

    return isCurrentPathActive || isSubItemActive;
  };

  /**
   * React Router v6 Wrapper around Blade's SideNavLink that passes active state of item based on react router state
   */ 
  const NavLink = (props) => {
    const location = useLocation();

    return (
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

  const SideNavExample = () => {
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const [isTestModeActive, setIsTestModeActive] = React.useState(false);
    const location = useLocation();

    /**
     * Keeps the section expanded on load if one if the items are active
     */ 
    const getDefaultSectionExpanded = (items) => {
      const activeItem = items.find((l1Item) =>
        isItemActive(location, {
          href: l1Item.href,
          activeOnLinks: getAllChildHrefs(l1Item.items),
        })
      );

      return Boolean(activeItem);
    };

    return (
      <Box minHeight="500px">
        <SideNav isOpen={isMobileOpen} onDismiss={() => setIsMobileOpen(false)}>
          <SideNavBody>
            {navItemsJSON.map((l1Sections) => {
              return (
                <SideNavSection
                  key={l1Sections.title}
                  title={l1Sections.title}
                  maxVisibleItems={l1Sections.maxItemsVisible}
                  defaultIsExpanded={getDefaultSectionExpanded(
                    l1Sections.items.slice(l1Sections.maxItemsVisible)
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
                          {l1Item.items?.map((l2Item) => {
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
                                  {l2Item.items?.map((l3Item) => {
                                    return (
                                      <NavLink key={l3Item.title} {...l3Item} />
                                    );
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
              backgroundColor={
                isTestModeActive ? 'feedback.background.notice.subtle' : undefined
              }
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
                <NavLink
                  icon={UserIcon}
                  title="User Settings"
                  href="/settings/user"
                />
                <NavLink
                  icon={BoxIcon}
                  title="Account Settings"
                  href="/settings/account"
                />
              </SideNavLevel>
            </NavLink>
          </SideNavFooter>
        </SideNav>

        <Box marginLeft={{ base: 'spacing.0', m: '300px' }} paddingTop="spacing.10">
          <Button
            display={{ base: undefined, m: 'none' }}
            variant="tertiary"
            icon={MenuIcon}
            onClick={() => setIsMobileOpen(true)}
            position="fixed"
            top="spacing.4"
            right="spacing.4"
            zIndex="2"
          />
          <Text 
            marginY="spacing.4" 
            display={{ base: undefined, m: 'none' }}
          >
            For Desktop version, click Preview tab below to open preview in fullscreen
          </Text>
          <Routes>
            {[...getAllRoutesFromJSON(), '/settings/user', '/settings/account'].map(
              (route) => (
                <Route
                  key={route}
                  path={route}
                  element={<Page match={{ route }} />}
                />
              )
            )}
          </Routes>
        </Box>
      </Box>
    );
  };

  export default SideNavExample;
  `,
  'navItemsJSON.js': dedent`import React from 'react';
  import {
    ArrowUpRightIcon,
    BillIcon,
    BuildingIcon,
    CashIcon,
    CodeSnippetIcon,
    ConfettiIcon,
    CreditCardIcon,
    FilePlusIcon,
    FileTextIcon,
    HeadsetIcon,
    LayoutIcon,
    PlusIcon,
    RazorpayxPayrollIcon,
    ReportsIcon,
    StampIcon,
    UserCheckIcon,
    UserIcon,
    Tooltip,
    Button,
  } from '@razorpay/blade/components';


  export const navItemsJSON = [
    {
      type: 'section',
      title: undefined,
      items: [
        {
          icon: LayoutIcon,
          title: 'Home',
          href: '/app/dashboard',
        },
        {
          icon: ArrowUpRightIcon,
          title: 'Payouts',
          href: '/app/payouts',
          tooltip: {
            content: 'Open Payouts (Cmd + O)',
          },
          trailing: (
            <Tooltip content="Create Payout (Cmd + P)" placement="right">
              <Button icon={PlusIcon} size="xsmall" variant="tertiary" />
            </Tooltip>
          ),
        },
        {
          icon: FileTextIcon,
          title: 'Account Statement',
          href: '/app/account-statement',
        },
      ],
    },
    {
      type: 'section',
      title: 'Offerings',
      maxItemsVisible: 3,
      items: [
        {
          icon: CreditCardIcon,
          title: 'Corporate Credit Card',
          href: '/app/corporate-credit-card',
          items: [
            {
              icon: UserIcon,
              title: 'User Profile',
              href: '/app/user/profile',
            },
            {
              icon: BuildingIcon,
              title: 'Business Profile',
              href: '/app/business/profile',
              items: [
                {
                  title: 'Business Banks',
                  href: '/app/business/banks',
                },
                {
                  title: 'Business Routes',
                  href: '/app/business/routes',
                },
              ],
            },
            {
              icon: FilePlusIcon,
              title: 'Billing',
              href: '/app/billing',
            },
          ],
        },
        {
          icon: BillIcon,
          title: 'Vendor Payments',
          href: '/app/vendor-payments',
        },
        {
          icon: StampIcon,
          title: 'Tax Payments',
          href: '/app/tax-payments',
        },
        {
          icon: RazorpayxPayrollIcon,
          title: 'Payroll',
          href: '/app/payroll',
        },
        {
          icon: ReportsIcon,
          title: 'Reports',
          href: '/app/reports',
        },
        {
          icon: UserCheckIcon,
          title: 'Public Profile',
          href: '/app/public-profile',
        },
        {
          icon: CodeSnippetIcon,
          title: 'Code Snippet',
          href: '/app/code-snippet',
        },
        {
          icon: HeadsetIcon,
          title: 'Support',
          href: '/app/support',
        },
      ],
    },
    {
      type: 'section',
      title: 'Miscellaneous',
      items: [
        {
          icon: CashIcon,
          title: 'Cost Center',
          href: '/app/cost-center',
        },
        {
          icon: ConfettiIcon,
          title: 'Offers',
          href: '/app/confetti',
        },
      ],
    },
  ];
  `,
};
