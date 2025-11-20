import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Heading,
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItem,
  TabNavItems,
  Menu,
  MenuItem,
  MenuOverlay,
  MenuHeader,
  MenuFooter,
  Badge,
  useTheme,
  HomeIcon,
  Button,
  Link as BladeLink,
  SearchInput,
  Avatar,
  Tooltip,
  ActivityIcon,
  AnnouncementIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  RazorpayxPayrollIcon,
  AcceptPaymentsIcon,
  MagicCheckoutIcon,
  AwardIcon,
  RazorpayXIcon,
} from '@razorpay/blade/components';
import SideNav from './SideNav';
import { isItemActive, RazorpayLogo } from './utils';

interface TabNavItemLinkProps {
  href?: string;
  title: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeOnLinks?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const TabNavItemLink = React.forwardRef<HTMLAnchorElement, TabNavItemLinkProps>((props, ref) => {
  const location = useLocation();
  return (
    <TabNavItem
      ref={ref}
      {...props}
      as={Link}
      isActive={isItemActive(location, {
        href: props.href,
        activeOnLinks: props.activeOnLinks,
      })}
    />
  );
});

TabNavItemLink.displayName = 'TabNavItemLink';

interface ExploreItemProps {
  icon: React.ComponentType<{ color: string; size: string }>;
  title: string;
  description: string;
}

const ExploreItem = ({ icon: Icon, title, description }: ExploreItemProps) => {
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

const TopNavComponent = (): React.JSX.Element => {
  const { platform } = useTheme();
  const navigate = useNavigate();
  const isMobile = platform === 'onMobile';
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const activeUrl = useLocation().pathname;
  React.useEffect(() => {
    setSelectedProduct(activeUrl);
  }, [activeUrl]);

  return (
    <DashboardBackground>
      <TopNav position="relative">
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
                  {
                    href: '/app',
                    title: 'Payments',
                    icon: AcceptPaymentsIcon,
                    description: 'Manage payments effortlessly.',
                  },
                  {
                    href: '/banking',
                    title: 'Banking',
                    icon: RazorpayXIcon,
                    description: 'Manage your banking needs.',
                  },
                  {
                    href: '/payroll',
                    title: 'Payroll',
                    icon: RazorpayxPayrollIcon,
                    description: 'Automate payroll with ease.',
                  },
                  {
                    href: '/magic-checkout',
                    title: 'Magic Checkout',
                    icon: MagicCheckoutIcon,
                    isAlwaysOverflowing: true,
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
                      {overflowingItems.length > 0 ? (
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
                                    navigate(item.href);
                                    setSelectedProduct(item.href);
                                  }}
                                >
                                  <ExploreItem
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
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
                <Button size="medium" variant="tertiary" icon={AnnouncementIcon} />
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
        height="calc(100vh - 56px)"
        marginX={{
          base: 'spacing.0',
          m: 'spacing.3',
        }}
      >
        <SideNav
          isOpen={isSideBarOpen}
          onDismiss={() => {
            setIsSideBarOpen(false);
          }}
        />
      </Box>
    </DashboardBackground>
  );
};

export default TopNavComponent;
