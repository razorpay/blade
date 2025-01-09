/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Link, matchPath, useHistory, useLocation } from 'react-router-dom';
import storyRouterDecorator from 'storybook-react-router';
import { Title } from '@storybook/addon-docs';
import styled from 'styled-components';
import type { TopNavProps } from '../TopNav';
import { TopNav, TopNavActions, TopNavContent, TopNavBrand } from '../TopNav';
import type { TabNavItemProps } from '../TabNav';
import { TabNavItems, TabNav, TabNavItem } from '../TabNav';
import { topNavFullExample } from './code';
import { Box } from '~components/Box';
import type { SideNavLinkProps, SideNavProps } from '~components/SideNav';
import {
  SideNav,
  SideNavBody,
  SideNavLevel,
  SideNavLink,
  SideNavSection,
} from '~components/SideNav';
import type { IconComponent } from '~components/Icons';
import {
  SearchIcon,
  AcceptPaymentsIcon,
  AwardIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ActivityIcon,
  AnnouncementIcon,
  ChevronRightIcon,
  HomeIcon,
  LayoutIcon,
  PaymentButtonIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  RazorpayxPayrollIcon,
} from '~components/Icons';
import { RazorpayLogo } from '~components/SideNav/docs/RazorpayLogo';
import { SearchInput } from '~components/Input/SearchInput';
import { Button } from '~components/Button';
import { Tooltip } from '~components/Tooltip';
import { Avatar } from '~components/Avatar';
import { Heading, Text } from '~components/Typography';
import { Menu, MenuFooter, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';
import { Link as BladeLink } from '~components/Link';
import { Badge } from '~components/Badge';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

import { Alert } from '~components/Alert';
import { List, ListItem } from '~components/List';
import { makeSize, useBreakpoint, useTheme } from '~utils';
import {
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
} from '~components/SideNav/tokens';
import BaseBox from '~components/Box/BaseBox';

const DocsPage = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TopNav"
      componentDescription="The top navigation bar is positioned at the top of the screen that provides quick access to different products, search & user profile."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=90311-235393&m=dev"
    >
      <Title>Usage (with React Router v6)</Title>
      <Alert
        color="notice"
        title="State Management Note"
        description="TopNav component requires you to handle active link and active menu item on consumer end
        since the component is detached from React Router. The example below includes some boilerplate in handling these active states using React Router v6. Make sure to test your edge cases while implementing."
        isFullWidth
        isDismissible={false}
      />

      <Sandbox
        files={topNavFullExample}
        editorHeight={600}
        hideNavigation={false}
        openFile="SideNavExample.js,utils.js,App.js,TopNavExample.js"
      />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
  decorators: [storyRouterDecorator(undefined, { initialEntries: ['/home'] })] as unknown,
} as Meta<TopNavProps>;

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

const NavLink = (
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
  isOpen,
  onDismiss,
}: Pick<SideNavProps, 'isOpen' | 'onDismiss'>): React.ReactElement => {
  return (
    <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
      <SideNavBody>
        <NavLink icon={HomeIcon} title="Home" href="/home" />
        <NavLink
          icon={LayoutIcon}
          title="L2 Trigger"
          href="/l2-item"
          activeOnLinks={['/l2-item', '/l2-item-2', '/l3-item', '/l3-item-2']}
        >
          <SideNavLevel>
            <NavLink title="L2 Item" href="/l2-item" />
            <NavLink title="L2 Item 2" href="/l2-item-2" />
            <NavLink title="L3 Trigger" activeOnLinks={['/l3-item', '/l3-item-2']}>
              <SideNavLevel>
                <NavLink title="L3 Item" href="/l3-item" />
                <NavLink title="L3 Item 2" href="/l3-item-2" />
              </SideNavLevel>
            </NavLink>
          </SideNavLevel>
        </NavLink>

        <SideNavSection title="Products" maxVisibleItems={2}>
          <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" />
          <NavLink icon={PaymentLinkIcon} title="Links" href="/links" />
          <NavLink icon={PaymentPagesIcon} title="Pages" href="/pages" />
          <NavLink icon={PaymentButtonIcon} title="Button" href="/button" />
        </SideNavSection>
      </SideNavBody>
    </SideNav>
  );
};

const TabNavItemLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<TabNavItemProps, 'as'> & {
    activeOnLinks?: string[];
  }
>((props, ref) => {
  const location = useLocation();
  return (
    <TabNavItem
      ref={ref}
      {...props}
      as={Link}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
});

const ExploreItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: IconComponent;
  title?: string;
  description: string;
}): React.ReactElement => {
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

const TopNavFullExample = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const { matchedBreakpoint, matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isTablet = matchedBreakpoint === 'm';
  const isMobile = matchedDeviceType === 'mobile';
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const activeUrl = useLocation().pathname;
  React.useEffect(() => {
    setSelectedProduct(activeUrl);
  }, [activeUrl]);

  return (
    <DashboardBackground>
      <BaseBox backgroundColor="interactive.background.gray.default">
        <TopNav>
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
                    { title: 'Home', href: '/home', icon: HomeIcon },
                    {
                      href: '/payroll',
                      title: 'Payroll',
                      icon: RazorpayxPayrollIcon,
                      description: 'Automate payroll with ease.',
                    },
                    {
                      href: '/payments',
                      title: 'Payments',
                      icon: AcceptPaymentsIcon,
                      description: 'Manage payments effortlessly.',
                    },
                    {
                      href: '/magic-checkout',
                      title: 'Magic Checkout',
                      icon: ShoppingBagIcon,
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
                        {overflowingItems.length ? (
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
                                      history.push(item.href!);
                                      setSelectedProduct(item.href!);
                                    }}
                                  >
                                    <ExploreItem
                                      icon={item.icon!}
                                      title={item.title}
                                      description={item.description!}
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
                {isTablet ? (
                  <Tooltip content="Search in payments">
                    <Button
                      size={isMobile ? 'small' : 'medium'}
                      variant="tertiary"
                      icon={SearchIcon}
                    />
                  </Tooltip>
                ) : (
                  <SearchInput
                    placeholder="Search in payments"
                    accessibilityLabel="Search Across Razorpay"
                  />
                )}
                <Tooltip content="View Ecosystem Health">
                  <Button
                    size={isMobile ? 'small' : 'medium'}
                    variant="tertiary"
                    icon={ActivityIcon}
                  />
                </Tooltip>
                <Tooltip content="View Announcements">
                  <Button
                    size={isMobile ? 'small' : 'medium'}
                    variant="tertiary"
                    icon={AnnouncementIcon}
                  />
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
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <SideNavExample
            isOpen={isSideBarOpen}
            onDismiss={() => {
              setIsSideBarOpen(false);
            }}
          />
          <Box
            marginLeft={{
              base: '100%',
              m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
              xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
            }}
            // 100vh - (topnav height [56px] + border [2px])
            height="calc(100vh - 58px)"
          >
            <Box
              height="100vh"
              padding="spacing.5"
              overflowY="scroll"
              backgroundColor="surface.background.gray.moderate"
            >
              <Box width={{ base: 'max-content', m: '100%' }} height="200vh">
                <Text weight="semibold">Active URL: {activeUrl}</Text>
                <Text marginY="spacing.4">This demo integrates:</Text>
                <List>
                  <ListItem>SideNav</ListItem>
                  <ListItem>Menu (Explore Tab)</ListItem>
                  <ListItem>ReactRouter</ListItem>
                  <ListItem>Mobile Responsiveness</ListItem>
                  <ListItem>One Dashboard Layout</ListItem>
                </List>
              </Box>
            </Box>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};
const TopNavFullTemplate: StoryFn<typeof TopNav> = () => <TopNavFullExample />;

const TopNavMinimalTemplate: StoryFn<typeof TopNav> = () => {
  const history = useHistory();
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  return (
    <DashboardBackground>
      <BaseBox backgroundColor="interactive.background.gray.default">
        <TopNav>
          <TopNavBrand>
            <RazorpayLogo />
          </TopNavBrand>
          <TopNavContent>
            <TabNav
              items={[
                { title: 'Home', href: '/home', icon: HomeIcon },
                {
                  href: '/payroll',
                  title: 'Payroll',
                  icon: RazorpayxPayrollIcon,
                  description: 'Automate payroll with ease.',
                },
                {
                  href: '/payments',
                  title: 'Payments',
                  icon: AcceptPaymentsIcon,
                  description: 'Manage payments effortlessly.',
                },
                {
                  href: '/magic-checkout',
                  title: 'Magic Checkout',
                  icon: ShoppingBagIcon,
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
                    {overflowingItems.length ? (
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
                                  history.push(item.href!);
                                  setSelectedProduct(item.href!);
                                }}
                              >
                                <ExploreItem
                                  icon={item.icon!}
                                  title={item.title}
                                  description={item.description!}
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
              <Button variant="tertiary" icon={AnnouncementIcon} />
            </Tooltip>
            <Avatar size="medium" name="Anurag Hazra" />
          </TopNavActions>
        </TopNav>
      </BaseBox>

      <Box paddingY="spacing.4" backgroundColor="surface.background.gray.moderate" height="100%">
        <Text margin="spacing.5">
          This is a minimal example usage of TopNav, checkout Full Dashboard Layout example for
          other features & integration details.
        </Text>
      </Box>
    </DashboardBackground>
  );
};

export const Minimal = TopNavMinimalTemplate.bind({});
Minimal.storyName = 'Minimal';

export const FullExample = TopNavFullTemplate.bind({});
FullExample.storyName = 'Full Example';
