import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box } from '../../../components/Box';
import {
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItems,
  TabNavItem,
} from '../../../components/TopNav';
import { SearchInput } from '../../../components/Input/SearchInput';
import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';
import {
  HomeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  RazorpayxPayrollIcon,
  AcceptPaymentsIcon,
  ShoppingBagIcon,
  AwardIcon,
  ActivityIcon,
  AnnouncementIcon,
} from '../../../components/Icons';
import { Menu, MenuHeader, MenuItem, MenuFooter, MenuOverlay } from '../../../components/Menu';
import { Link as BladeLink } from '../../../components/Link';
import { Text } from '../../../components/Typography';
import { Badge } from '../../../components/Badge';
import { Tooltip } from '../../../components/Tooltip';

import { RazorpayLogo } from '../assets/razorpay';

// Constants for SideNav widths
const SIDE_NAV_EXPANDED_L1_WIDTH_BASE = 240;
const SIDE_NAV_EXPANDED_L1_WIDTH_XL = 280;

const TopNavigation = (): React.ReactElement => {
  const navigate = useHistory();
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const activeUrl = useLocation().pathname;
  React.useEffect(() => {
    setSelectedProduct(activeUrl);
  }, [activeUrl]);

  return (
    <Box backgroundColor="surface.background.gray.subtle">
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
              const activeProduct = overflowingItems.find((item) => item.href === selectedProduct);
              return (
                <>
                  <TabNavItems>
                    {items.map((item) => {
                      return (
                        <TabNavItem
                          key={item.title}
                          title={item.title}
                          icon={item.icon}
                          onClick={() => {
                            // @ts-expect-error
                            navigate(item.href!);
                            setSelectedProduct(item.href!);
                          }}
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
                                // @ts-expect-error
                                navigate(item.href!);
                                setSelectedProduct(item.href!);
                              }}
                            >
                              <Box display="flex" gap="spacing.3" alignItems="center">
                                {item.icon && <item.icon />}
                                <Box>
                                  <Text size="medium" weight="semibold">
                                    {item.title}
                                  </Text>
                                  <Text size="small" color="surface.text.gray.muted">
                                    {item.description}
                                  </Text>
                                </Box>
                              </Box>
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
        <Box
          marginLeft={{
            base: '100%',
            m: `${SIDE_NAV_EXPANDED_L1_WIDTH_BASE}px`,
            xl: `${SIDE_NAV_EXPANDED_L1_WIDTH_XL}px`,
          }}
        />
      </Box>
    </Box>
  );
};

export default TopNavigation;
