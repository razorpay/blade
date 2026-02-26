/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Link, matchPath, useHistory, useLocation } from 'react-router-dom';
import storyRouterDecorator from 'storybook-react-router';
import { Title } from '@storybook/addon-docs';
import styled from 'styled-components';
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
  AcceptPaymentsFilledIcon,
  AwardIcon,
  ShoppingBagIcon,
  MagicCheckoutFilledIcon,
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
  RazorpayxPayrollFilledIcon,
  RayIcon,
} from '~components/Icons';
import { RazorpayLogoWhite } from '~components/SideNav/docs/RazorpayLogo';
import { SearchInput } from '~components/Input/SearchInput';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem, ActionListItemIcon } from '~components/ActionList';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Tooltip } from '~components/Tooltip';
import { Avatar } from '~components/Avatar';
import { Text } from '~components/Typography';
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

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
        openFile="SideNavExample.tsx,utils.tsx,App.tsx,TopNavExample.tsx"
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
} as Meta<typeof TopNav>;

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
  const isActive = isItemActive(location, {
    href: props.href,
    activeOnLinks: props.activeOnLinks,
  });
  return <TabNavItem ref={ref} {...props} as={Link} isActive={isActive} />;
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
    background: '#000000',
  };
});

const searchMenuItems = [
  { title: 'Payment Links', icon: PaymentLinkIcon },
  { title: 'Payment Pages', icon: PaymentPagesIcon },
  { title: 'Payment Gateway', icon: PaymentGatewayIcon },
  { title: 'Payment Buttons', icon: PaymentButtonIcon },
];

const popularSearchItems = [
  { title: 'Transactions', icon: ActivityIcon },
  { title: 'Settlements', icon: AcceptPaymentsIcon },
  { title: 'Refunds', icon: ShoppingBagIcon },
];

const SearchContainer = styled.div<{ isActive: boolean }>(({ isActive }) => ({
  width: isActive ? '300px' : '200px',
  transition: 'width 200ms ease-in-out',
}));

const TopNavSearchDropdown = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearchActive, setIsSearchActive] = React.useState(false);

  const filteredItems = searchMenuItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SearchContainer isActive={isSearchActive}>
      <Dropdown onOpenChange={(isOpen) => setIsSearchActive(isOpen)}>
        <SearchInput
          placeholder="Search in payments"
          accessibilityLabel="Search Across Razorpay"
          onChange={({ value }) => setSearchTerm(value as string)}
        />
        <DropdownOverlay>
          {filteredItems.length === 0 && searchTerm.length > 0 ? (
            <Box padding="spacing.5" display="flex" justifyContent="center">
              <Text color="surface.text.gray.muted">No results found</Text>
            </Box>
          ) : (
            <ActionList>
              {(searchTerm.length === 0 ? popularSearchItems : filteredItems).map((item) => (
                <ActionListItem
                  key={item.title}
                  title={item.title}
                  value={item.title}
                  leading={<ActionListItemIcon icon={item.icon} />}
                />
              ))}
            </ActionList>
          )}
        </DropdownOverlay>
      </Dropdown>
    </SearchContainer>
  );
};

const TopNavSearchDropdownWithContext = (): React.ReactElement => {
  return <TopNavSearchDropdown />;
};

const MobileTopNav = (): React.ReactElement => {
  return (
    <>
      <Box display="flex" alignItems="center" marginLeft="spacing.2">
        <RazorpayLogoWhite />
      </Box>
      <Box />
      <Box marginRight="spacing.2">
        <Menu openInteraction="click">
          <Avatar size="medium" name="RK" />
          <MenuOverlay>
            <MenuHeader title="Profile" />
            <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
              <Avatar size="medium" name="RK" />
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="medium" weight="semibold">
                  Anurag Hazra
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
      </Box>
    </>
  );
};

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
      <BaseBox>
        <TopNav>
          {isMobile ? (
            <MobileTopNav />
          ) : (
            <>
              <TopNavBrand>
                <RazorpayLogoWhite />
              </TopNavBrand>
              <TopNavContent>
                <TabNav
                  items={[
                    {
                      title: 'Ray',
                      href: '/home',
                      icon: RayIcon,
                    },
                    {
                      href: '/payroll',
                      title: 'Payroll',
                      icon: { default: RazorpayxPayrollIcon, selected: RazorpayxPayrollFilledIcon },
                      description: 'Automate payroll with ease.',
                    },
                    {
                      href: '/payments',
                      title: 'Payments',
                      icon: { default: AcceptPaymentsIcon, selected: AcceptPaymentsFilledIcon },
                      description: 'Manage payments effortlessly.',
                    },
                    {
                      href: '/magic-checkout',
                      title: 'Magic Checkout',
                      icon: { default: ShoppingBagIcon, selected: MagicCheckoutFilledIcon },
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
                          {items.map((item) => (
                            <TabNavItemLink key={item.title} {...item} />
                          ))}
                        </TabNavItems>
                        {overflowingItems.length ? (
                          <Menu openInteraction="hover">
                            <TabNavItem
                              title={activeProduct ? `More: ${activeProduct.title}` : 'More'}
                              trailing={<ChevronDownIcon color="surface.icon.staticWhite.subtle" />}
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
                                const OverflowIcon =
                                  item.icon &&
                                  typeof item.icon === 'object' &&
                                  'default' in item.icon
                                    ? item.icon.default
                                    : item.icon;
                                return (
                                  <MenuItem
                                    key={item.href}
                                    onClick={() => {
                                      history.push(item.href!);
                                      setSelectedProduct(item.href!);
                                    }}
                                  >
                                    <ExploreItem
                                      icon={OverflowIcon as IconComponent}
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
                    <IconButton
                      size={isMobile ? 'small' : 'medium'}
                      icon={SearchIcon}
                      onClick={noop}
                      accessibilityLabel="Search in payments"
                    />
                  </Tooltip>
                ) : (
                  <Box width="200px">
                    <SearchInput
                      placeholder="Search in payments"
                      accessibilityLabel="Search Across Razorpay"
                    />
                  </Box>
                )}
                <Tooltip content="View Ecosystem Health">
                  <IconButton
                    size={isMobile ? 'small' : 'medium'}
                    icon={ActivityIcon}
                    onClick={noop}
                    accessibilityLabel="View Ecosystem Health"
                    isHighlighted={true}
                  />
                </Tooltip>
                <Tooltip content="View Announcements">
                  <IconButton
                    size={isMobile ? 'small' : 'medium'}
                    icon={AnnouncementIcon}
                    onClick={noop}
                    accessibilityLabel="View Announcements"
                    isHighlighted={true}
                  />
                </Tooltip>
                <Menu openInteraction="click">
                  <Avatar size="small" name="Anurag Hazra" />
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
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
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
              base: '0px',
              m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
              xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
            }}
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
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  return (
    <DashboardBackground>
      <BaseBox>
        <TopNav>
          {isMobile ? (
            <MobileTopNav />
          ) : (
            <>
              <TopNavBrand>
                <RazorpayLogoWhite />
              </TopNavBrand>
              <TopNavContent>
                <TabNav
                  items={[
                    { title: 'Home', href: '/home', icon: HomeIcon },
                    {
                      href: '/payroll',
                      title: 'Payroll',
                      icon: { default: RazorpayxPayrollIcon, selected: RazorpayxPayrollFilledIcon },
                      description: 'Automate payroll with ease.',
                    },
                    {
                      href: '/payments',
                      title: 'Payments',
                      icon: { default: AcceptPaymentsIcon, selected: AcceptPaymentsFilledIcon },
                      description: 'Manage payments effortlessly.',
                    },
                    {
                      href: '/magic-checkout',
                      title: 'Magic Checkout',
                      icon: { default: ShoppingBagIcon, selected: MagicCheckoutFilledIcon },
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
                          {items.map((item) => (
                            <TabNavItemLink key={item.title} {...item} />
                          ))}
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
                                const OverflowIcon =
                                  item.icon &&
                                  typeof item.icon === 'object' &&
                                  'default' in item.icon
                                    ? item.icon.default
                                    : item.icon;
                                return (
                                  <MenuItem
                                    key={item.href}
                                    onClick={() => {
                                      history.push(item.href!);
                                      setSelectedProduct(item.href!);
                                    }}
                                  >
                                    <ExploreItem
                                      icon={OverflowIcon as IconComponent}
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
                <Box width="200px">
                  <SearchInput
                    placeholder="Search in payments"
                    accessibilityLabel="Search Across Razorpay"
                  />
                </Box>
                <Tooltip content="View Ecosystem Health">
                  <IconButton
                    size="medium"
                    icon={ActivityIcon}
                    onClick={noop}
                    isHighlighted={true}
                    accessibilityLabel="View Ecosystem Health"
                  />
                </Tooltip>
                <Tooltip content="View Announcements">
                  <IconButton
                    icon={AnnouncementIcon}
                    onClick={noop}
                    isHighlighted={true}
                    size="medium"
                    accessibilityLabel="View Announcements"
                  />
                </Tooltip>
                <Menu openInteraction="click">
                  <Avatar size="small" name="Anurag Hazra" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                      <Avatar size="medium" name="Anurag Hazra" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          Anurag Hazra
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
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
          borderBottomLeftRadius="none"
          borderBottomRightRadius="none"
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <Box
            height="calc(100vh - 58px)"
            padding="spacing.5"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text margin="spacing.5">
              This is a minimal example usage of TopNav, checkout Full Dashboard Layout example for
              other features & integration details.
            </Text>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};

export const Minimal = TopNavMinimalTemplate.bind({});
Minimal.storyName = 'Minimal';

export const FullExample = TopNavFullTemplate.bind({});
FullExample.storyName = 'Full Example';

const TopNavSearchDropdownTemplate: StoryFn<typeof TopNav> = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <DashboardBackground>
      <BaseBox>
        <TopNav>
          {isMobile ? (
            <MobileTopNav />
          ) : (
            <>
              <TopNavBrand>
                <RazorpayLogoWhite />
              </TopNavBrand>
              <TopNavContent>
                <TabNav
                  items={[
                    { title: 'Home', href: '/home', icon: HomeIcon },
                    {
                      href: '/payments',
                      title: 'Payments',
                      icon: AcceptPaymentsIcon,
                    },
                  ]}
                >
                  {({ items }) => (
                    <TabNavItems>
                      {items.map((item) => (
                        <TabNavItemLink key={item.title} {...item} />
                      ))}
                    </TabNavItems>
                  )}
                </TabNav>
              </TopNavContent>
              <TopNavActions>
                <TopNavSearchDropdown />
                <Tooltip content="View Announcements">
                  <IconButton
                    icon={AnnouncementIcon}
                    onClick={noop}
                    accessibilityLabel="View Announcements"
                    isHighlighted={true}
                    size="medium"
                  />
                </Tooltip>
                <Menu openInteraction="click">
                  <Avatar size="small" name="Anurag Hazra" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                      <Avatar size="medium" name="Anurag Hazra" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          Anurag Hazra
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
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
          borderBottomLeftRadius="none"
          borderBottomRightRadius="none"
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <Box
            height="calc(100vh - 58px)"
            padding="spacing.5"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text margin="spacing.5">
              {isMobile
                ? 'Resize your browser to see the desktop version with the search dropdown.'
                : 'Click on the search input to see the dropdown with search results. Type to filter items.'}
            </Text>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};

export const SearchWithDropdown = TopNavSearchDropdownTemplate.bind({});
SearchWithDropdown.storyName = 'Search With Dropdown';

const TopNavActionsWithContextTemplate: StoryFn<typeof TopNav> = () => {
  return (
    <BaseBox>
      <TopNavActions>
        <TopNavSearchDropdownWithContext />
        <Tooltip content="View Announcements">
          <IconButton
            icon={AnnouncementIcon}
            onClick={noop}
            accessibilityLabel="View Announcements"
            isHighlighted={true}
            size="medium"
          />
        </Tooltip>
        <Menu openInteraction="click">
          <Avatar size="small" name="Anurag Hazra" />
          <MenuOverlay>
            <MenuHeader title="Profile" />
            <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
              <Avatar size="medium" name="Anurag Hazra" />
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="medium" weight="semibold">
                  Anurag Hazra
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

      <Box
        overflow="hidden"
        position="relative"
        borderRadius={{ base: 'none', m: 'large' }}
        borderTopRightRadius={{ base: 'none', m: 'large' }}
        borderBottomLeftRadius="none"
        borderBottomRightRadius="none"
        height="100%"
        marginX={{ base: 'spacing.0', m: 'spacing.3' }}
      >
        <Box
          height="calc(100vh - 58px)"
          padding="spacing.5"
          backgroundColor="surface.background.gray.moderate"
        >
          <Text margin="spacing.5">
            This example shows direct usage of `TopNavContext.Provider` using TopNavActions
            component to wrap search and preserve app color scheme for search overlays.
          </Text>
        </Box>
      </Box>
    </BaseBox>
  );
};

export const TopNavActionsWithContext = TopNavActionsWithContextTemplate.bind({});
TopNavActionsWithContext.storyName = 'TopNavActions With Context';

const TopNavWithButtonTemplate: StoryFn<typeof TopNav> = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <DashboardBackground>
      <BaseBox>
        <TopNav>
          {isMobile ? (
            <MobileTopNav />
          ) : (
            <>
              <TopNavBrand>
                <RazorpayLogoWhite />
              </TopNavBrand>
              <TopNavContent>
                <TabNav
                  items={[
                    { title: 'Home', href: '/home', icon: HomeIcon },
                    {
                      href: '/payments',
                      title: 'Payments',
                      icon: AcceptPaymentsIcon,
                    },
                  ]}
                >
                  {({ items }) => (
                    <TabNavItems>
                      {items.map((item) => (
                        <TabNavItemLink key={item.title} {...item} />
                      ))}
                    </TabNavItems>
                  )}
                </TabNav>
              </TopNavContent>
              <TopNavActions>
                <Button variant="primary" size="medium">
                  Activate
                </Button>
                <Tooltip content="View Announcements">
                  <IconButton
                    icon={AnnouncementIcon}
                    onClick={noop}
                    accessibilityLabel="View Announcements"
                    isHighlighted={true}
                    size="medium"
                  />
                </Tooltip>
                <Menu openInteraction="click">
                  <Avatar size="small" name="Anurag Hazra" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                      <Avatar size="medium" name="Anurag Hazra" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          Anurag Hazra
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
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
          borderBottomLeftRadius="none"
          borderBottomRightRadius="none"
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <Box
            height="calc(100vh - 58px)"
            padding="spacing.5"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text margin="spacing.5">
              This example shows a Button inside TopNavActions alongside other action items.
            </Text>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};

export const WithButton = TopNavWithButtonTemplate.bind({});
WithButton.storyName = 'With Button';
