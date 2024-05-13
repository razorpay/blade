import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { SideNavLevel } from './SideNavLevel';
import type { SideNavLinkProps } from './';
import { SideNav, SideNavLink } from './';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import {
  ArrowUpRightIcon,
  HomeIcon,
  SettingsIcon,
  SubscriptionsIcon,
  UserIcon,
} from '~components/Icons';
import { Heading } from '~components/Typography';
import { Button } from '~components/Button';

export default {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/app/dashboard'] })] as unknown,
} as Meta<typeof SideNav>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = ({ match }: { match: any }): React.ReactElement => (
  <Box>
    <Heading>ID: {JSON.stringify(match)}</Heading>
  </Box>
);

type SideNavWithoutAsChildren = Omit<SideNavLinkProps, 'as' | 'children'>;
type SideNavJSONChildrenType = {
  children?: (SideNavWithoutAsChildren & SideNavJSONChildrenType)[];
};
type SideNavLinkItemsJSONType = (SideNavWithoutAsChildren & SideNavJSONChildrenType)[];
const navItems: SideNavLinkItemsJSONType = [
  {
    icon: HomeIcon,
    title: 'Home',
    href: '/app/dashboard',
  },
  {
    icon: ArrowUpRightIcon,
    title: 'Payouts',
    href: '/app/payouts',
  },
  {
    icon: ArrowUpRightIcon,
    title: 'Nice',
    href: '/nice',
  },
  {
    icon: SettingsIcon,
    title: 'Settings',
    href: '/settings/user',
    children: [
      {
        icon: UserIcon,
        title: 'User Settings',
        href: '/settings/user',
        children: [
          {
            icon: HomeIcon,
            title: 'Address',
            href: '/settings/user/home',
          },
          {
            icon: UserIcon,
            title: 'Account',
            href: '/settings/user/account',
          },
        ],
      },
      {
        icon: SubscriptionsIcon,
        title: 'Subscriptions',
        href: '/settings/subscriptions',
      },
    ],
  },
  {
    icon: SettingsIcon,
    title: 'Settings 2',
    href: '/settings/user-2',
    children: [
      {
        icon: UserIcon,
        title: 'User Settings 2',
        href: '/settings/user-2',
      },
      {
        icon: SubscriptionsIcon,
        title: 'Subscriptions 2',
        href: '/settings/subscriptions-2',
      },
    ],
  },
];

const getAllChildHrefs = (
  l1ItemChildren?: (SideNavWithoutAsChildren & SideNavJSONChildrenType)[],
): string[] => {
  const hrefs: string[] = [];
  l1ItemChildren?.forEach((l2Item) => {
    hrefs.push(l2Item.href);

    l2Item.children?.forEach((l3Item) => {
      hrefs.push(l3Item.href);
    });
  });

  return hrefs;
};

const NavItem = (
  props: Omit<SideNavLinkProps, 'as'> & {
    subItems?: string[];
  },
): React.ReactElement => {
  const location = useLocation();
  const isSubItemActive = props.subItems?.includes(location.pathname);

  return (
    <SideNavLink
      {...props}
      as={Link}
      isCurrentPage={location.pathname === props.href || isSubItemActive}
    />
  );
};

const SideNavTemplate: StoryFn<typeof SideNav> = () => {
  return (
    <Box>
      <SideNav>
        {navItems.map(({ children: l1Children, ...navItem }) => {
          if (l1Children) {
            return (
              <NavItem key={navItem.title} {...navItem} subItems={getAllChildHrefs(l1Children)}>
                <SideNavLevel>
                  {l1Children.map(({ children: l2Children, ...l2Item }) => {
                    if (!l2Children) {
                      return <NavItem key={l2Item.title} {...l2Item} />;
                    }

                    return (
                      <NavItem key={l2Item.title} {...l2Item}>
                        <SideNavLevel>
                          {l2Children.map(({ children: l3Children, ...l3Item }) => (
                            <NavItem key={l3Item.title} {...l3Item} />
                          ))}
                        </SideNavLevel>
                      </NavItem>
                    );
                  })}
                </SideNavLevel>
              </NavItem>
            );
          }
          return <NavItem key={navItem.title} {...navItem} />;
        })}
      </SideNav>

      <Box marginLeft="300px">
        <Switch>
          <Route path="/app" component={Page} />
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

const SideNavTemplateMobile: StoryFn<typeof SideNav> = () => {
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);
  return (
    <Box>
      <SideNav isOpen={isSideNavOpen} onDismiss={() => setIsSideNavOpen(false)}>
        {navItems.map(({ children: l1Children, ...navItem }) => {
          if (l1Children) {
            return (
              <NavItem key={navItem.title} {...navItem} subItems={getAllChildHrefs(l1Children)}>
                <SideNavLevel>
                  {l1Children.map(({ children: l2Children, ...l2Item }) => {
                    if (!l2Children) {
                      return <NavItem key={l2Item.title} {...l2Item} />;
                    }

                    return (
                      <NavItem key={l2Item.title} {...l2Item}>
                        <SideNavLevel>
                          {l2Children.map(({ children: l3Children, ...l3Item }) => (
                            <NavItem key={l3Item.title} {...l3Item} />
                          ))}
                        </SideNavLevel>
                      </NavItem>
                    );
                  })}
                </SideNavLevel>
              </NavItem>
            );
          }
          return <NavItem key={navItem.title} {...navItem} />;
        })}
      </SideNav>

      <Button onClick={() => setIsSideNavOpen(true)}>Open Nav</Button>
      <Box>
        <Switch>
          <Route path="/app" component={Page} />
          <Route path="/app/payouts" component={Page} />
          <Route path="/nice" component={Page} />
          <Route path="/settings" exact component={Page} />
          <Route path="/settings/user" exact component={Page} />
          <Route path="/settings/subscriptions" exact component={Page} />
        </Switch>
      </Box>
    </Box>
  );
};

export const Default = SideNavTemplate.bind({});
export const Mobile = SideNavTemplateMobile.bind({});
