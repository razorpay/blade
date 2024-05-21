import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { Link, matchPath, Route, Switch, useLocation } from 'react-router-dom';
import type { SideNavSectionProps } from './types';
import type { SideNavLinkProps } from './';
import {
  SideNav,
  SideNavLink,
  SideNavLevel,
  SideNavSection,
  SideNavFooter,
  SideNavSwitch,
} from './';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import {
  ArrowUpRightIcon,
  BillIcon,
  BoxIcon,
  BuildingIcon,
  CashIcon,
  ConfettiIcon,
  CreditCardIcon,
  FilePlusIcon,
  FileTextIcon,
  LayoutIcon,
  PlusIcon,
  RazorpayxPayrollIcon,
  ReportsIcon,
  SettingsIcon,
  StampIcon,
  UserIcon,
} from '~components/Icons';
import { Heading } from '~components/Typography';
import { Button } from '~components/Button';
import { Tooltip } from '~components/Tooltip';

export default {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/settings/user/home'] })] as unknown,
} as Meta<typeof SideNav>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = ({ match }: { match: any }): React.ReactElement => (
  <Box>
    <Heading>ID: {JSON.stringify(match)}</Heading>
  </Box>
);

type ItemsType = Pick<SideNavLinkProps, 'icon' | 'title' | 'href' | 'trailing' | 'tooltip'>;

const navItemsJSON: {
  type: 'section';
  title?: SideNavSectionProps['title'];
  maxItemsVisible?: SideNavSectionProps['maxVisibleItems'];
  items: (ItemsType & {
    items?: (ItemsType & { items?: ItemsType[] })[];
  })[];
}[] = [
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

const getAllChildHrefs = (l1ItemChildren?: (ItemsType & { items?: ItemsType[] })[]): string[] => {
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

const NavItem = (
  props: Omit<SideNavLinkProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();
  const isCurrentPathActive = Boolean(
    matchPath(location.pathname, {
      path: props.href,
      exact: false,
    }),
  );

  const isSubItemActive = Boolean(
    props.activeOnLinks?.find((href) => matchPath(location.pathname, { path: href, exact: false })),
  );

  return <SideNavLink {...props} as={Link} isActive={isCurrentPathActive || isSubItemActive} />;
};

const SideNavTemplate: StoryFn<typeof SideNav> = () => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <Box minHeight="500px">
      <SideNav isOpen={isMobileOpen} onDismiss={() => setIsMobileOpen(false)}>
        {navItemsJSON.map((l1Sections) => {
          return (
            <SideNavSection
              key={l1Sections.title}
              title={l1Sections.title}
              maxVisibleItems={l1Sections.maxItemsVisible}
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
                                return <NavItem key={l3Item.title} {...l3Item} />;
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
        <SideNavFooter>
          <SideNavSwitch />
          <NavItem
            title="Settings"
            icon={SettingsIcon}
            href="/settings/user"
            activeOnLinks={['/settings/user', '/settings/account']}
          >
            <SideNavLevel>
              <NavItem icon={UserIcon} title="User Settings" href="/settings/user" />
              <NavItem icon={BoxIcon} title="Account Settings" href="/settings/account" />
            </SideNavLevel>
          </NavItem>
        </SideNavFooter>
      </SideNav>

      <Box marginLeft={{ base: 'spacing.0', m: '300px' }}>
        <Button display={{ base: undefined, m: 'none' }} onClick={() => setIsMobileOpen(true)}>
          Open Mobile Drawer
        </Button>
        <Switch>
          <Route path="/app/dashboard" component={Page} />
          <Route path="/app/payouts" component={Page} />
          <Route path="/nice" component={Page} />
          <Route path="/settings" exact component={Page} />
          <Route path="/settings/user" exact component={Page} />
          <Route path="/settings/user/home" exact component={Page} />
          <Route path="/settings/user/account" exact component={Page} />
          <Route path="/settings/subscriptions" exact component={Page} />
        </Switch>
      </Box>
    </Box>
  );
};

export const Default = SideNavTemplate.bind({});
