export const SideNavWithReactRouterv6 = `import React from 'react';
  import { matchPath, useLocation, Link, Routes, Route } from 'react-router-dom';
  import {
    Collapsible,
    CollapsibleBody,
    CollapsibleLink,
    SideNavBody,
    SideNav,
    SideNavLink,
    SideNavLevel,
    SideNavSection,
    SideNavFooter,
    SideNavItem,
    Box,
    Heading,
    Button,
    Tooltip,
    Indicator,
    Switch as BladeSwitch,
    ArrowUpRightIcon,
    BillIcon,
    BoxIcon,
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
    SettingsIcon,
    StampIcon,
    UserCheckIcon,
    UserIcon,
  } from '@razorpay/blade/components';

  import type { SideNavLinkProps, SideNavSectionProps } from '@razorpay/blade/components';


  type ItemsType = Pick<
    SideNavLinkProps,
    'icon' | 'title' | 'href' | 'trailing' | 'tooltip'
  >;
  type NavItemsJSONType = {
    type: 'section';
    title?: SideNavSectionProps['title'];
    maxItemsVisible?: SideNavSectionProps['maxVisibleItems'];
    items: (ItemsType & {
      items?: (ItemsType & { items?: ItemsType[] })[];
    })[];
  };
  const navItemsJSON: NavItemsJSONType[] = [
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

  const Page = ({ match }: { match: any }): React.ReactElement => (
    <Box padding={{ base: 'spacing.2', m: 'spacing.6' }}>
      <Heading>ID: {JSON.stringify(match)}</Heading>
      <Collapsible defaultIsExpanded={true}>
        <CollapsibleLink>Hi</CollapsibleLink>
        <CollapsibleBody>hi hi hi </CollapsibleBody>
      </Collapsible>
    </Box>
  );

  const getAllChildHrefs = (
    l1ItemChildren?: (ItemsType & { items?: ItemsType[] })[]
  ): string[] => {
    const hrefs: string[] = [];
    l1ItemChildren?.forEach((l2Item) => {
      if (l2Item.href) {
        hrefs.push(l2Item.href);
      }

      l2Item.items?.forEach((l3Item) => {
        if (l3Item.href) {
          hrefs.push(l3Item.href);
        }
      });
    });

    return hrefs;
  };

  const isItemActive = (
    location: { pathname: string },
    { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] }
  ): boolean => {
    const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));

    const isSubItemActive = Boolean(
      activeOnLinks?.find((href) => matchPath(location.pathname, href))
    );

    return isCurrentPathActive || isSubItemActive;
  };

  const NavItem = (
    props: Omit<SideNavLinkProps, 'as'> & {
      activeOnLinks?: string[];
    }
  ): React.ReactElement => {
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

  const App = () => {
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const [isTestModeActive, setIsTestModeActive] = React.useState(false);
    const location = useLocation();

    const getSectionExpanded = (items: NavItemsJSONType['items']): boolean => {
      const activeItem = items.find((l1Item) =>
        isItemActive(location, {
          href: l1Item.href,
          activeOnLinks: getAllChildHrefs(l1Item.items),
        })
      );

      if (location.pathname.includes('reports')) {
        console.log({ activeItem, items });
      }

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
                  defaultIsExpanded={getSectionExpanded(l1Sections.items)}
                >
                  {l1Sections.items.map((l1Item) => {
                    if (!l1Item.items) {
                      return <NavItem key={l1Item.title} {...l1Item} />;
                    }

                    return (
                      <NavItem
                        key={l1Item.title}
                        {...l1Item}
                        activeOnLinks={getAllChildHrefs(l1Item.items)}
                        href={l1Item.items[0].href}
                      >
                        <SideNavLevel key={l1Item.title}>
                          {l1Item.items?.map((l2Item) => {
                            if (!l2Item.items) {
                              return <NavItem key={l2Item.title} {...l2Item} />;
                            }

                            return (
                              <NavItem
                                key={l2Item.title}
                                {...l2Item}
                                activeOnLinks={getAllChildHrefs(l2Item.items)}
                                href={undefined}
                              >
                                <SideNavLevel key={l2Item.title}>
                                  {l2Item.items?.map((l3Item) => {
                                    return (
                                      <NavItem key={l3Item.title} {...l3Item} />
                                    );
                                  })}
                                </SideNavLevel>
                              </NavItem>
                            );
                          })}
                        </SideNavLevel>
                      </NavItem>
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
            <NavItem
              title="Settings"
              icon={SettingsIcon}
              href="/settings/user"
              activeOnLinks={['/settings/user', '/settings/account']}
            >
              <SideNavLevel>
                <NavItem
                  icon={UserIcon}
                  title="User Settings"
                  href="/settings/user"
                />
                <NavItem
                  icon={BoxIcon}
                  title="Account Settings"
                  href="/settings/account"
                />
              </SideNavLevel>
            </NavItem>
          </SideNavFooter>
        </SideNav>

        <Box marginLeft={{ base: 'spacing.0', m: '300px' }}>
          <Button
            display={{ base: undefined, m: 'none' }}
            onClick={() => setIsMobileOpen(true)}
          >
            Open Mobile Drawer
          </Button>
          <Routes>
            <Route path="/app/dashboard" element={<Page />} />
            <Route path="/app/payouts" element={<Page />} />
            <Route path="/app/reports" element={<Page />} />
            <Route path="/nice" element={<Page />} />
            <Route path="/settings" element={<Page />} />
            <Route path="/settings/user" element={<Page />} />
            <Route path="/settings/user/home" element={<Page />} />
            <Route path="/settings/user/account" element={<Page />} />
            <Route path="/settings/subscriptions" element={<Page />} />
          </Routes>
        </Box>
      </Box>
    );
  };

  export default App;

`;
