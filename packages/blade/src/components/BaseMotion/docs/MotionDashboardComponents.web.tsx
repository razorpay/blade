/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link, matchPath, Route, Switch, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  TopNav,
  TopNavActions,
  TopNavContent,
  TopNavBrand,
  TabNavItems,
  TabNavItem,
  TabNav,
} from '~components/TopNav';
import type { TabNavItemProps } from '~components/TopNav';
import { Box } from '~components/Box';
import type { SideNavLinkProps, SideNavProps } from '~components/SideNav';
import {
  SideNav,
  SideNavBody,
  SideNavLevel,
  SideNavLink,
  SideNavSection,
} from '~components/SideNav';
import {
  SearchIcon,
  AcceptPaymentsIcon,
  ShoppingBagIcon,
  ActivityIcon,
  AnnouncementIcon,
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
import { Menu, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';
import { Link as BladeLink } from '~components/Link';

import { makeSize, useBreakpoint, useTheme } from '~utils';
import {
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
} from '~components/SideNav/tokens';
import BaseBox from '~components/Box/BaseBox';
import { Slide } from '~components/Slide';
import { Move } from '~components/Move';
import { Spinner } from '~components/Spinner';

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
    <Slide direction="left">
      <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
        <SideNavBody>
          <NavLink icon={HomeIcon} title="Home" href="/app/home" />
          <NavLink
            icon={LayoutIcon}
            title="L2 Trigger"
            href="/app/l2-item"
            activeOnLinks={['/app/l2-item', '/app/l2-item-2', '/app/l3-item', '/app/l3-item-2']}
          >
            <SideNavLevel>
              <NavLink title="L2 Item" href="/app/l2-item" />
              <NavLink title="L2 Item 2" href="/app/l2-item-2" />
              <NavLink title="L3 Trigger" activeOnLinks={['/app/l3-item', '/app/l3-item-2']}>
                <SideNavLevel>
                  <NavLink title="L3 Item" href="/app/l3-item" />
                  <NavLink title="L3 Item 2" href="/app/l3-item-2" />
                </SideNavLevel>
              </NavLink>
            </SideNavLevel>
          </NavLink>

          <SideNavSection title="Products" maxVisibleItems={2}>
            <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/app/gateway" />
            <NavLink icon={PaymentLinkIcon} title="Links" href="/app/links" />
            <NavLink icon={PaymentPagesIcon} title="Pages" href="/app/pages" />
            <NavLink icon={PaymentButtonIcon} title="Button" href="/app/button" />
          </SideNavSection>
        </SideNavBody>
      </SideNav>
    </Slide>
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

const DashboardBackground = styled.div(() => {
  return {
    height: '100vh',
    background: 'radial-gradient(94.74% 64.44% at 29.03% 15.17%, #FFFFFF 0%, #90A5BB 100%)',
  };
});

export const DashboardWithRoutingExample = ({
  routeComponent,
}: {
  routeComponent: (props: any) => React.ReactElement;
}): React.ReactElement => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  const { theme } = useTheme();
  const { matchedBreakpoint, matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const location = useLocation();
  const isTablet = matchedBreakpoint === 'm';
  const isMobile = matchedDeviceType === 'mobile';
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);

  return (
    <>
      <Slide direction="top" isVisible={isLoading} type="out" shouldUnmountWhenHidden>
        <Box
          position="fixed"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          backgroundColor="surface.background.gray.intense"
          zIndex={2000}
        >
          <Spinner size="xlarge" accessibilityLabel="Dashboard Loading" />
        </Box>
      </Slide>

      {isLoading ? null : (
        <DashboardBackground>
          <BaseBox backgroundColor="interactive.background.gray.default">
            <Slide direction="top" fromOffset="100%">
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
                          { title: 'Home', href: '/app/home', icon: HomeIcon },
                          {
                            href: '/app/payroll',
                            title: 'Payroll',
                            icon: RazorpayxPayrollIcon,
                            description: 'Automate payroll with ease.',
                          },
                          {
                            href: '/app/payments',
                            title: 'Payments',
                            icon: AcceptPaymentsIcon,
                            description: 'Manage payments effortlessly.',
                          },
                          {
                            href: '/app/magic-checkout',
                            title: 'Magic Checkout',
                            icon: ShoppingBagIcon,
                            description: 'Fast, one-click checkout.',
                          },
                        ]}
                      >
                        {({ items }) => {
                          return (
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
                          <Box
                            display="flex"
                            gap="spacing.4"
                            padding="spacing.4"
                            alignItems="center"
                          >
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
            </Slide>
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
              <Move>
                <Box
                  marginLeft={{
                    base: '100%',
                    m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
                    xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
                  }}
                  // 100vh - (topnav height [56px] + border [2px])
                  height="calc(100vh - 58px)"
                  padding="spacing.6"
                  backgroundColor="surface.background.gray.intense"
                >
                  <AnimatePresence mode="wait">
                    <Switch location={location} key={location.pathname}>
                      <Route path="/app/:id" component={routeComponent} />
                    </Switch>
                  </AnimatePresence>
                </Box>
              </Move>
            </Box>
          </BaseBox>
        </DashboardBackground>
      )}
    </>
  );
};
