import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { Link, matchPath, Route, Switch, useLocation } from 'react-router-dom';
import type { SideNavProps, SideNavSectionProps } from '../types';
import type { SideNavLinkProps } from '..';
import {
  SideNavBody,
  SideNav,
  SideNavLink,
  SideNavLevel,
  SideNavSection,
  SideNavFooter,
  SideNavItem,
} from '..';
import { RazorpayLinesSvg, RazorpayLogo } from './RazorpayLogo';
import { sideNavWithReactRouter } from './code';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import {
  ArrowUpRightIcon,
  BillIcon,
  BoxIcon,
  BuildingIcon,
  CashIcon,
  ChevronRightIcon,
  CodeSnippetIcon,
  ConfettiIcon,
  CreditCardIcon,
  FilePlusIcon,
  FileTextIcon,
  HeadsetIcon,
  LayoutIcon,
  MenuIcon,
  PlusIcon,
  RazorpayxPayrollIcon,
  ReportsIcon,
  SettingsIcon,
  StampIcon,
  UserCheckIcon,
  UserIcon,
} from '~components/Icons';
import { Button } from '~components/Button';
import { Tooltip } from '~components/Tooltip';
import { Indicator } from '~components/Indicator';
import { Switch as BladeSwitch } from '~components/Switch';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Skeleton } from '~components/Skeleton';
import { Card, CardBody } from '~components/Card';
import { ProgressBar } from '~components/ProgressBar';
import { Text } from '~components/Typography';
import { Alert } from '~components/Alert';

const DocsPage = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="SideNav"
      componentDescription="The side navigation is positioned along the left side of the screen that provides quick access to different sections or functionalities of the application."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=87921-138303&m=dev&scaling=min-zoom&page-id=87588%3A51157"
    >
      <Title>Usage (with React Router v6)</Title>
      <Alert
        color="notice"
        title="State Management Note"
        description="SideNav component requires you to handle active link and active menu item on consumer end
        since the component is detached from React Router. The example below includes some boilerplate in handling these active states using React Router v6. Make sure to test your edge cases while implementing. Checkout API Decision of SideNav for more details."
        isFullWidth
        isDismissible={false}
      />

      <Sandbox
        files={sideNavWithReactRouter}
        editorHeight={600}
        hideNavigation={false}
        openFile="App.js,navItemsJSON.js,SideNavExample.js"
      />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/settings/user/home'] })] as unknown,
} as Meta<typeof SideNav>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = ({ match }: { match: any }): React.ReactElement => (
  <Box padding={{ base: 'spacing.2', m: 'spacing.6' }}>
    <pre>
      <code>{JSON.stringify(match, null, 4)}</code>
    </pre>
  </Box>
);

const DashboardSkeleton = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  return (
    <Box
      paddingX="spacing.4"
      backgroundColor="surface.background.gray.moderate"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" display="flex" height="56px" alignItems="center" width="100%">
        <Box position="absolute" bottom="-10px" left="0px">
          <RazorpayLinesSvg />
        </Box>
        <Box width={{ base: undefined, m: '264px' }} textAlign="center">
          <RazorpayLogo />
        </Box>
        <Box flex="1" display={{ base: 'none', m: 'block' }}>
          <Skeleton width="100%" height="12px" borderRadius="medium" />
        </Box>
        <Box flex="3" marginLeft="spacing.6" display={{ base: 'none', m: 'block' }}>
          <Skeleton marginBottom="spacing.2" width="100%" height="12px" borderRadius="medium" />
          <Skeleton width="100%" height="12px" borderRadius="medium" />
        </Box>
      </Box>
      <Box
        position="relative"
        borderRadius="large"
        overflow="hidden"
        paddingTop="spacing.4"
        flex="1"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        elevation="midRaised"
        backgroundColor="surface.background.gray.intense"
        borderBottomWidth="none"
        borderBottomRightRadius="none"
        borderBottomLeftRadius="none"
      >
        {children}
      </Box>
    </Box>
  );
};

type ItemsType = Pick<
  SideNavLinkProps,
  'icon' | 'title' | 'href' | 'trailing' | 'tooltip' | 'onClick'
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

const getAllChildHrefs = (items: (ItemsType & { items?: ItemsType[] })[] | undefined): string[] => {
  const hrefs: string[] = [];

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

const getAllHrefs = (): string[] => {
  let allHrefs: string[] = [];

  navItemsJSON.forEach((section) => {
    if (section.items) {
      allHrefs = allHrefs.concat(getAllChildHrefs(section.items));
    }
  });

  return allHrefs;
};

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
): boolean => {
  const isCurrentPathActive = Boolean(
    matchPath(location.pathname, {
      path: href,
      exact: false,
    }),
  );

  const isSubItemActive = Boolean(
    activeOnLinks?.find((href) => matchPath(location.pathname, { path: href, exact: false })),
  );

  return isCurrentPathActive || isSubItemActive;
};

const NavItem = (
  props: Omit<SideNavLinkProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();

  return (
    <SideNavLink
      {...props}
      as={Link}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
};

const SideNavExample = ({
  showExampleContentPadding = true,
  ...args
}: SideNavProps & { showExampleContentPadding?: boolean }): React.ReactElement => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isTestModeActive, setIsTestModeActive] = React.useState(false);
  const location = useLocation();

  const getSectionExpanded = (items: NavItemsJSONType['items']): boolean => {
    const activeItem = items.find((l1Item) =>
      isItemActive(location, {
        href: l1Item.href,
        activeOnLinks: getAllChildHrefs(l1Item.items),
      }),
    );

    return Boolean(activeItem);
  };

  return (
    <Box minHeight="500px">
      <SideNav {...args} isOpen={isMobileOpen} onDismiss={() => setIsMobileOpen(false)}>
        <SideNavBody>
          {navItemsJSON.map((l1Sections) => {
            return (
              <SideNavSection
                key={l1Sections.title}
                title={l1Sections.title}
                maxVisibleItems={l1Sections.maxItemsVisible}
                defaultIsExpanded={getSectionExpanded(
                  l1Sections.items.slice(l1Sections.maxItemsVisible),
                )}
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
            backgroundColor={isTestModeActive ? `feedback.background.notice.subtle` : undefined}
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
              <NavItem icon={UserIcon} title="User Settings" href="/settings/user" />
              <NavItem icon={BoxIcon} title="Account Settings" href="/settings/account" />
            </SideNavLevel>
          </NavItem>
        </SideNavFooter>
      </SideNav>

      <Box
        marginLeft={{ base: 'spacing.0', m: '300px' }}
        paddingY={showExampleContentPadding ? { base: 'spacing.11', m: 'spacing.0' } : 'spacing.0'}
        paddingX={{ base: 'spacing.4', m: 'spacing.0' }}
      >
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
        <Switch>
          {[...getAllHrefs(), '/settings/user', '/settings/account'].map((route) => (
            <Route key={route} path={route} component={Page} />
          ))}
        </Switch>
      </Box>
    </Box>
  );
};

const SideNavTemplate: StoryFn<typeof SideNav> = ({ ...args }) => {
  return <SideNavExample {...args} />;
};

export const Default = SideNavTemplate.bind({});

const ActivationCard = (): React.ReactElement => {
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
        <ProgressBar label="Progress" showPercentage={true} value={50} />
      </CardBody>
    </Card>
  );
};

export const DashboardLayout: StoryFn<typeof SideNav> = ({ ...args }) => {
  return (
    <DashboardSkeleton>
      <SideNavExample
        position="absolute"
        {...args}
        banner={<ActivationCard />}
        showExampleContentPadding={false}
      />
    </DashboardSkeleton>
  );
};

export const MobileSideNav: StoryFn<typeof SideNav> = ({ ...args }) => {
  return (
    <DashboardSkeleton>
      <SideNavExample
        position="absolute"
        {...args}
        banner={<ActivationCard />}
        showExampleContentPadding={false}
      />
    </DashboardSkeleton>
  );
};

MobileSideNav.storyName = 'Mobile SideNav';

MobileSideNav.parameters = {
  viewport: {
    defaultViewport: 'iPhone6',
  },
};
