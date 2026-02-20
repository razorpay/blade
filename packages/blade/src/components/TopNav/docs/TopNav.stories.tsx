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
  UserIcon,
  RayIcon,
} from '~components/Icons';
import { RazorpayLogoWhite } from '~components/SideNav/docs/RazorpayLogo';
import { SearchInput } from '~components/Input/SearchInput';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem, ActionListItemIcon } from '~components/ActionList';
import { IconButton } from '~components/Button/IconButton';
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
            <>
              <BladeLink icon={HomeIcon} size="medium" href="/home">
                Home
              </BladeLink>
              <Heading textAlign="center" size="small" weight="semibold">
                Payments
              </Heading>
              <Menu openInteraction="click">
                <Avatar size="medium" variant="square" name="Anurag Hazra" />
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
                <RazorpayLogoWhite />
              </TopNavBrand>
              <TopNavContent>
                <TabNav
                  items={[
                    {
                      title: 'Ray',
                      href: '/home',
                      icon: RayIcon,
                      indicatorGlowColor: theme.colors.surface.icon.onSea.onSubtle,
                    },
                    {
                      href: '/payroll',
                      title: 'Payroll',
                      icon: RazorpayxPayrollIcon,
                      selectedStateIcon: RazorpayxPayrollFilledIcon,
                      description: 'Automate payroll with ease.',
                    },
                    {
                      href: '/payments',
                      title: 'Payments',
                      icon: AcceptPaymentsIcon,
                      selectedStateIcon: AcceptPaymentsFilledIcon,
                      description: 'Manage payments effortlessly.',
                    },
                    {
                      href: '/magic-checkout',
                      title: 'Magic Checkout',
                      icon: ShoppingBagIcon,
                      selectedStateIcon: MagicCheckoutFilledIcon,
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
                  <IconButton
                    icon={UserIcon}
                    size={isMobile ? 'small' : 'medium'}
                    accessibilityLabel="User Icon"
                    onClick={noop}
                    isHighlighted={true}
                  />
                  {/* <Avatar size="medium" variant="square" name="Anurag Hazra" /> */}
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
          borderTopRightRadius="large"
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
      <BaseBox>
        <TopNav>
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
                  icon: RazorpayxPayrollIcon,
                  selectedStateIcon: RazorpayxPayrollFilledIcon,
                  description: 'Automate payroll with ease.',
                },
                {
                  href: '/payments',
                  title: 'Payments',
                  icon: AcceptPaymentsIcon,
                  selectedStateIcon: AcceptPaymentsFilledIcon,
                  description: 'Manage payments effortlessly.',
                },
                {
                  href: '/magic-checkout',
                  title: 'Magic Checkout',
                  icon: ShoppingBagIcon,
                  selectedStateIcon: MagicCheckoutFilledIcon,
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
            <Avatar size="small" variant="circle" name="Anurag Hazra" />
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

const TopNavSearchDropdownTemplate: StoryFn<typeof TopNav> = () => {
  return (
    <DashboardBackground>
      <BaseBox>
        <TopNav>
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
            <Avatar size="small" variant="circle" name="Anurag Hazra" />
          </TopNavActions>
        </TopNav>
      </BaseBox>

      <Box paddingY="spacing.4" backgroundColor="surface.background.gray.moderate" height="100%">
        <Text margin="spacing.5">
          Click on the search input to see the dropdown with search results. Type to filter items.
        </Text>
      </Box>
    </DashboardBackground>
  );
};

export const SearchWithDropdown = TopNavSearchDropdownTemplate.bind({});
SearchWithDropdown.storyName = 'Search With Dropdown';

// const ProgressiveBlurWrapper = styled.div({
//   position: 'relative',
//   width: '121.41px',
//   height: '121.41px',
//   overflow: 'visible',
//   flexShrink: 0,
// });

// const BlurLayer = styled.div<{ blurAmount: number; zIndex: number; maskGradient: string }>(
//   ({ blurAmount, zIndex: z, maskGradient }) => ({
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     boxSizing: 'border-box',
//     padding: '8px',
//     background:
//       'conic-gradient(from 90deg at 54.92% 50%, hsla(218, 89%, 51%, 1) 0deg, hsla(210, 6%, 13%, 0) 360deg)',
//     transform: 'rotate(-180deg)',
//     pointerEvents: 'none',
//     filter: `blur(${blurAmount}px)`,
//     zIndex: z,
//     WebkitMaskImage: maskGradient,
//     maskImage: maskGradient,
//   }),
// );

// const FlippedContainer = styled.div({
//   transform: 'scaleX(-1)',
//   position: 'relative',
//   zIndex: 0,
//   flexShrink: 0,
// });

// const SCENE_WIDTH = 121.41 * 2;
// const SCENE_HEIGHT = 121.41;
// const ELLIPSE_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${SCENE_WIDTH}' height='${SCENE_HEIGHT}'%3E%3Cdefs%3E%3Cfilter id='b' filterUnits='userSpaceOnUse' x='0' y='0' width='${SCENE_WIDTH}' height='${SCENE_HEIGHT}'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3C/defs%3E%3Cellipse cx='${
//   SCENE_WIDTH / 2
// }' cy='${SCENE_HEIGHT / 2}' rx='75.5' ry='17.5' fill='black' filter='url(%23b)'/%3E%3C/svg%3E")`;

// const HALF_SCENE_HEIGHT = SCENE_HEIGHT / 2 + 4;

// const Scene = styled.div({
//   position: 'relative',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'flex-start',
//   gap: 0,
//   width: `${SCENE_WIDTH}px`,
//   height: `${HALF_SCENE_HEIGHT}px`,
//   opacity: 0.64,
//   overflow: 'hidden',
//   WebkitMaskImage: ELLIPSE_MASK,
//   WebkitMaskRepeat: 'no-repeat',
//   WebkitMaskPosition: 'center top',
//   maskImage: ELLIPSE_MASK,
//   maskRepeat: 'no-repeat',
//   maskPosition: 'center top',
// });

// const BLUR_LAYERS = [
//   {
//     blurAmount: 94,
//     zIndex: 7,
//     maskGradient:
//       'linear-gradient(to bottom, black 0%, transparent 35%, transparent 65%, black 100%)',
//   },
//   {
//     blurAmount: 32,
//     zIndex: 8,
//     maskGradient:
//       'linear-gradient(to bottom, transparent 10%, black 25%, transparent 40%, transparent 60%, black 75%, transparent 90%)',
//   },
//   {
//     blurAmount: 8,
//     zIndex: 9,
//     maskGradient:
//       'linear-gradient(to bottom, transparent 25%, black 40%, transparent 48%, transparent 52%, black 60%, transparent 75%)',
//   },
//   {
//     blurAmount: 0,
//     zIndex: 10,
//     maskGradient:
//       'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)',
//   },
// ];

// const ProgressiveBlurEffect = (): React.ReactElement => {
//   return (
//     <Scene>
//       <FlippedContainer>
//         <ProgressiveBlurWrapper>
//           {BLUR_LAYERS.map((layer) => (
//             <BlurLayer key={layer.zIndex} {...layer} />
//           ))}
//         </ProgressiveBlurWrapper>
//       </FlippedContainer>
//       <ProgressiveBlurWrapper>
//         {BLUR_LAYERS.map((layer) => (
//           <BlurLayer key={layer.zIndex} {...layer} />
//         ))}
//       </ProgressiveBlurWrapper>
//     </Scene>
//   );
// };

// const ProgressiveBlurTemplate: StoryFn<typeof TopNav> = () => {
//   return (
//     <DashboardBackground>
//       <BaseBox backgroundColor="interactive.background.gray.default">
//         <TopNav>
//           <TopNavBrand>
//             <RazorpayLogoWhite />
//           </TopNavBrand>
//           <TopNavContent>
//             <TabNav
//               items={[
//                 { title: 'Home', href: '/home', icon: HomeIcon },
//                 {
//                   href: '/payments',
//                   title: 'Payments',
//                   icon: AcceptPaymentsIcon,
//                 },
//               ]}
//             >
//               {({ items }) => (
//                 <TabNavItems>
//                   {items.map((item) => (
//                     <TabNavItemLink key={item.title} title={item.title} href={item.href} />
//                   ))}
//                 </TabNavItems>
//               )}
//             </TabNav>
//           </TopNavContent>
//           <TopNavActions>
//             <Avatar size="medium" variant="square" name="Anurag Hazra" />
//           </TopNavActions>
//         </TopNav>
//       </BaseBox>

//       <Box padding="spacing.8" backgroundColor="surface.background.gray.moderate" height="100vh">
//         <Heading marginBottom="spacing.4">Progressive Blur Experiment</Heading>
//         <Text marginBottom="spacing.7">
//           The progressive blur effect is rendered next to the logo in the TopNav above. Below is a
//           standalone larger preview:
//         </Text>

//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           padding="spacing.10"
//           backgroundColor="surface.background.gray.intense"
//           borderRadius="large"
//         >
//           <ProgressiveBlurEffect />
//         </Box>
//       </Box>
//     </DashboardBackground>
//   );
// };

// export const ProgressiveBlur = ProgressiveBlurTemplate.bind({});
// ProgressiveBlur.storyName = 'Progressive Blur Experiment';

// const SVG_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='157.2734375' height='60.705'%3E%3Cdefs%3E%3Cfilter id='b' filterUnits='userSpaceOnUse' x='0' y='0' width='157.2734375' height='60.705'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3C/defs%3E%3Cellipse cx='78.63671875' cy='60.705' rx='55.045703124999996' ry='17.5' fill='black' filter='url(%23b)'/%3E%3C/svg%3E")`;

// const SvgMaskGlow = styled.div<{ color: string }>(({ color }) => ({
//   width: '157.27px',
//   height: '60.71px',
//   opacity: 0.64,
//   background: color,
//   WebkitMaskImage: SVG_MASK,
//   WebkitMaskRepeat: 'no-repeat',
//   WebkitMaskPosition: 'center',
//   WebkitMaskSize: '100% 100%',
//   maskImage: SVG_MASK,
//   maskRepeat: 'no-repeat',
//   maskPosition: 'center',
//   maskSize: '100% 100%',
// }));

// const SvgMaskTemplate: StoryFn<typeof TopNav> = () => {
//   const { theme } = useTheme();
//   const glowColor = theme.colors.surface.background.primary.intense;

//   return (
//     <DashboardBackground>
//       <BaseBox backgroundColor="interactive.background.gray.default">
//         <TopNav>
//           <TopNavBrand>
//             <RazorpayLogoWhite />
//           </TopNavBrand>
//           <TopNavContent>
//             <TabNav
//               items={[
//                 { title: 'Home', href: '/home', icon: HomeIcon },
//                 {
//                   href: '/payments',
//                   title: 'Payments',
//                   icon: AcceptPaymentsIcon,
//                 },
//               ]}
//             >
//               {({ items }) => (
//                 <TabNavItems>
//                   {items.map((item) => (
//                     <TabNavItemLink key={item.title} title={item.title} href={item.href} />
//                   ))}
//                 </TabNavItems>
//               )}
//             </TabNav>
//           </TopNavContent>
//           <TopNavActions>
//             <Avatar size="medium" variant="square" name="Anurag Hazra" />
//           </TopNavActions>
//         </TopNav>
//       </BaseBox>

//       <Box padding="spacing.8" backgroundColor="surface.background.gray.moderate" height="100vh">
//         <Heading marginBottom="spacing.4">SVG Mask Glow Experiment</Heading>
//         <Text marginBottom="spacing.7">
//           Uses an inline SVG mask with a Gaussian-blurred ellipse anchored at the bottom, filled
//           with the <code>surface.background.primary.intense</code> token.
//         </Text>

//         <Box
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//           gap="spacing.8"
//           padding="spacing.10"
//           backgroundColor="surface.background.gray.intense"
//           borderRadius="large"
//         >
//           <SvgMaskGlow color={glowColor} />

//           <Box display="flex" gap="spacing.8">
//             <SvgMaskGlow color={glowColor} />
//             <SvgMaskGlow color={glowColor} />
//           </Box>
//         </Box>
//       </Box>
//     </DashboardBackground>
//   );
// };

// export const SvgMaskExperiment = SvgMaskTemplate.bind({});
// SvgMaskExperiment.storyName = 'SVG Mask Experiment';
