import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import storyRouterDecorator from 'storybook-react-router';

import {
  BrowserRouter,
  Switch as ReactRouterDomSwitch,
  Route,
  Link as ReactRouterDomLink,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { Box } from '../Box';

import {
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLink,
  SideNavLevel,
  SideNavSection,
  SideNavItem,
} from '../SideNav';
import { Card, CardBody } from '../Card';
import { ProgressBar } from '../ProgressBar';
import { Indicator } from '../Indicator';
import {
  WalletIcon,
  CreditCardIcon,
  BankIcon,
  BillIcon,
  ArrowUpRightIcon,
  PlusIcon,
  SettingsIcon,
  MenuIcon,
  HomeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  RazorpayxPayrollIcon,
  AcceptPaymentsIcon,
  ShoppingBagIcon,
  AwardIcon,
  ActivityIcon,
  AnnouncementIcon,
  ChevronLeftIcon,
  EditIcon,
} from '../Icons';

import { IconButton } from '../Button/IconButton';

import { SearchInput } from '../Input/SearchInput';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { Menu, MenuHeader, MenuItem, MenuFooter, MenuOverlay } from '../Menu';
import { Link as BladeLink } from '../Link';
import { Text, Heading } from '../Typography';
import { Badge } from '../Badge';
import { Tooltip } from '../Tooltip';
import { Scale } from '../Scale';
import { Switch } from '../Switch';

import {
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItems,
  TabNavItem,
} from '../TopNav';
import { useTheme, useBreakpoint } from '../../utils';
import { RazorpayLogo } from './assets/razorpay';
import TeamManagementIcon from './assets/png/team.png';
import BankAccountIcon from './assets/png/bank.png';
import PaymentsIcon from './assets/png/payments.png';
import IntegrationsIcon from './assets/png/integrations.png';
import BusinessProfileIcon from './assets/png/business.png';
import UserProfileIcon from './assets/png/user.png';
import parameters from '~utils/storybook/recipeParameters';

interface NavLinkProps {
  title: string;
  href?: string;
  icon?: React.ComponentType;
  description?: string;
  tooltip?: {
    content: string;
    placement?: 'right' | 'left' | 'top' | 'bottom';
  };
  trailing?: React.ReactElement;
  activeOnLinks?: string[];
  items?: NavLinkProps[];
  children?: React.ReactElement;
  'data-analytics-section'?: string;
  'data-analytics-element'?: string;
}

interface NavigationSection {
  type: 'section';
  title?: string;
  maxVisibleItems?: number;
  items: NavLinkProps[];
}

// Custom activation card for the banner slot
const ActivationCard = (): React.ReactElement => {
  return (
    <Card href="/" padding="spacing.4" elevation="none">
      <CardBody>
        <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
          <Text size="medium" weight="semibold">
            Activation Pending
          </Text>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Box>
        <ProgressBar
          label="Progress"
          showPercentage={true}
          value={50}
          accessibilityLabel="Activation progress: 50% complete"
        />
      </CardBody>
    </Card>
  );
};

// Navigation link with proper active state handling
const NavLink = (props: NavLinkProps): React.ReactElement => {
  const location = useLocation();

  // Helper function to check if a link is active
  const isItemActive = (
    pathname: string,
    { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
  ): boolean => {
    if (!href) return false;

    const isCurrentPathActive = pathname.startsWith(href);
    const isSubItemActive = activeOnLinks?.some((link) => pathname.startsWith(link));

    return Boolean(isCurrentPathActive || isSubItemActive);
  };

  return (
    <SideNavLink
      {...props}
      as={ReactRouterDomLink}
      isActive={isItemActive(location.pathname, {
        href: props.href,
        activeOnLinks: props.activeOnLinks,
      })}
    />
  );
};

// Main SideNav component with all features
const SideNavigation = (): React.ReactElement => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTestModeActive, setIsTestModeActive] = useState(false);
  const location = useLocation();

  // Helper to get all child hrefs for managing active states
  const getAllChildHrefs = (items?: NavLinkProps[]): string[] => {
    if (!items) return [];

    const hrefs: string[] = [];
    items.forEach((item) => {
      if (item.href) hrefs.push(item.href);
      if (item.items) hrefs.push(...getAllChildHrefs(item.items));
    });

    return hrefs;
  };

  // Define navigation items
  const navigationItems: NavigationSection[] = [
    {
      type: 'section',
      items: [
        {
          icon: HomeIcon,
          title: 'Dashboard',
          href: '/dashboard',
          'data-analytics-section': 'main-nav',
          'data-analytics-element': 'dashboard',
        },
        {
          icon: WalletIcon,
          title: 'Payments',
          href: '/payments',
          tooltip: {
            content: 'View all payment transactions',
            placement: 'right',
          },
          trailing: (
            <Tooltip content="Create new payment (Ctrl+N)" placement="right">
              <Button
                icon={PlusIcon}
                size="xsmall"
                variant="tertiary"
                accessibilityLabel="Create new payment"
              />
            </Tooltip>
          ),
          'data-analytics-section': 'main-nav',
          'data-analytics-element': 'payments',
        },
      ],
    },
    {
      type: 'section',
      title: 'Banking',
      maxVisibleItems: 3,
      items: [
        {
          icon: CreditCardIcon,
          title: 'Credit Cards',
          href: '/banking/credit-cards',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'credit-cards',
          items: [
            {
              title: 'Physical Cards',
              href: '/banking/credit-cards/physical',
              description: 'RBL20I43',
              'data-analytics-section': 'banking',
              'data-analytics-element': 'physical-cards',
            },
            {
              title: 'Virtual Cards',
              href: '/banking/credit-cards/virtual',
              description: 'VIR32L98',
              'data-analytics-section': 'banking',
              'data-analytics-element': 'virtual-cards',
            },
          ],
        },
        {
          icon: BankIcon,
          title: 'Bank Accounts',
          href: '/banking/accounts',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'bank-accounts',
        },
        {
          icon: BillIcon,
          title: 'Statements',
          href: '/banking/statements',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'statements',
        },
        {
          icon: ArrowUpRightIcon,
          title: 'Transfers',
          href: '/banking/transfers',
          'data-analytics-section': 'banking',
          'data-analytics-element': 'transfers',
        },
      ],
    },
  ];

  return (
    <Box height="100%" position="relative">
      <SideNav
        isOpen={isMobileOpen}
        onDismiss={() => setIsMobileOpen(false)}
        onVisibleLevelChange={({ visibleLevel }) => console.log('Visible level:', visibleLevel)}
        banner={<ActivationCard />}
        testID="main-navigation"
        position="relative"
      >
        <SideNavBody>
          {navigationItems.map((section, sectionIndex) => {
            // Calculate whether section should be expanded by default
            const sectionItems = section.items || [];
            const hasActiveItem = sectionItems.some(
              (item) =>
                location.pathname.startsWith(item.href ?? '') ||
                getAllChildHrefs(item.items).some((childHref) =>
                  location.pathname.startsWith(childHref),
                ),
            );

            return (
              <SideNavSection
                key={`section-${sectionIndex}`}
                title={section.title}
                maxVisibleItems={section.maxVisibleItems}
                defaultIsExpanded={hasActiveItem}
                onExpandChange={({ isExpanded }) =>
                  console.log(`Section "${section.title}" expanded:`, isExpanded)
                }
                data-analytics-section={`nav-section-${sectionIndex}`}
              >
                {sectionItems.map((item, itemIndex) => {
                  if (!item.items) {
                    return <NavLink key={`item-${itemIndex}`} {...item} />;
                  }

                  // For items with children, create nested navigation
                  const childHrefs = getAllChildHrefs(item.items);

                  return (
                    <NavLink
                      key={`item-${itemIndex}`}
                      {...item}
                      activeOnLinks={childHrefs}
                      href={item.items[0]?.href ?? item.href}
                    >
                      <SideNavLevel>
                        {item.items?.map((subItem, subIndex) => (
                          <NavLink
                            key={`subitem-${subIndex}`}
                            {...subItem}
                            description={subItem.description}
                          />
                        ))}
                      </SideNavLevel>
                    </NavLink>
                  );
                })}
              </SideNavSection>
            );
          })}
        </SideNavBody>

        <SideNavFooter>
          {/* Test mode toggle with accessibility improvements */}
          <SideNavItem
            as="label"
            title="Test Mode"
            leading={
              <Indicator
                color={isTestModeActive ? 'notice' : 'positive'}
                emphasis="intense"
                accessibilityLabel={isTestModeActive ? 'Test mode enabled' : 'Test mode disabled'}
              />
            }
            backgroundColor={isTestModeActive ? 'feedback.background.notice.subtle' : undefined}
            trailing={
              <Switch
                size="small"
                isChecked={isTestModeActive}
                onChange={({ isChecked }: { isChecked: boolean }) => setIsTestModeActive(isChecked)}
                accessibilityLabel="Test mode toggle"
              />
            }
            data-analytics-section="footer"
            data-analytics-element="test-mode-toggle"
          />

          {/* Settings navigation with nested items */}
          <NavLink
            title="Settings"
            icon={SettingsIcon}
            href="/"
            activeOnLinks={['/settings/user', '/settings/account']}
            data-analytics-section="footer"
            data-analytics-element="settings"
          />
        </SideNavFooter>
      </SideNav>

      {/* Mobile menu toggle button */}
      <Box
        display={{ base: 'block', m: 'none' }}
        position="fixed"
        top="spacing.4"
        right="spacing.4"
        zIndex="2"
      >
        <Button
          variant="tertiary"
          icon={MenuIcon}
          onClick={() => setIsMobileOpen(true)}
          accessibilityLabel="Open navigation menu"
        />
      </Box>
    </Box>
  );
};

// Constants for SideNav widths
const SIDE_NAV_EXPANDED_L1_WIDTH_BASE = 240;
const SIDE_NAV_EXPANDED_L1_WIDTH_XL = 280;

const TopNavigation = (): React.ReactElement => {
  const navigate = useHistory();
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isDesktop = matchedDeviceType === 'desktop';

  const activeUrl = useLocation().pathname;
  React.useEffect(() => {
    setSelectedProduct(activeUrl);
  }, [activeUrl]);

  return (
    <Box backgroundColor="surface.background.gray.subtle">
      <TopNav>
        {isDesktop ? (
          <TopNavBrand>
            <RazorpayLogo />
          </TopNavBrand>
        ) : (
          <RazorpayLogo />
        )}

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
        {isDesktop ? (
          <TopNavActions>
            <Box width="200px">
              <SearchInput
                placeholder="Search in payments"
                accessibilityLabel="Search Across Razorpay"
                showSearchIcon={false}
              />
            </Box>
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
        ) : null}
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

interface SettingLink {
  label: string;
  link: string;
}

interface SettingCardProps {
  title: string;
  description: string;
  links: SettingLink[];
  assetImage: string;
}

const SettingCard = ({
  title,
  description,
  links,
  assetImage,
}: SettingCardProps): React.ReactElement => {
  return (
    <Scale motionTriggers={['hover']}>
      <Card
        height="250px"
        isSelected={false}
        backgroundColor="surface.background.gray.intense"
        padding="spacing.0"
        borderRadius="medium"
        elevation="none"
        zIndex={1000}
        width="354px"
        // onClick={handleClick}
      >
        <CardBody>
          <Box position="relative" height="250px" overflow="hidden" padding="spacing.7">
            <Box position="relative" zIndex="1">
              <Box display="flex" flexDirection="column" gap="spacing.7">
                <Box>
                  <Heading
                    size="medium"
                    weight="semibold"
                    marginBottom="spacing.3"
                    color="surface.text.gray.normal"
                  >
                    {title}
                  </Heading>
                  <Text weight="regular" color="surface.text.gray.muted">
                    {description}
                  </Text>
                </Box>

                <Box display="flex" flexDirection="column" gap="spacing.3">
                  {links.map((link, index) => (
                    <ReactRouterDomLink key={index} to={link.link}>
                      <BladeLink key={index} color="primary" size="medium">
                        {link.label}
                      </BladeLink>
                    </ReactRouterDomLink>
                  ))}
                </Box>
              </Box>
            </Box>
            <div
              style={{
                position: 'absolute',
                right: '-100px',
                bottom: '-70px',
                width: '249px',
                height: '249px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at center, hsla(206, 93%, 95%, 0.9) 0%, hsla(206, 93%, 95%, 0.8) 20%, hsla(209, 95%, 97%, 0.6) 40%, hsla(209, 95%, 97%, 0.4) 60%, hsla(0, 0%, 100%, 0.2) 80%, hsla(0, 0%, 100%, 0) 100%)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '40px',
                overflow: 'hidden',
              }}
            >
              <img
                src={assetImage}
                alt={`${title} illustration`}
                style={{
                  width: '138px',
                  height: '138px',
                  objectFit: 'contain',
                  transform: 'translateX(-30%)',
                  marginBottom: '12px',
                }}
              />
            </div>
          </Box>
        </CardBody>
      </Card>
    </Scale>
  );
};

const SettingsData = [
  {
    title: 'User profile',
    description: 'This is your personal profile, contact information and role permissions',
    links: [
      {
        label: 'Email & password',
        link: '/user-settings',
      },
      {
        label: 'Phone number',
        link: '/user-settings',
      },
      {
        label: 'Two factor authentication',
        link: '/user-settings',
      },
      {
        label: 'Notifications',
        link: '/user-settings',
      },
    ],
    assetImage: UserProfileIcon,
    path: '/user-settings',
  },
  {
    title: 'Business profile',
    description: 'These are the details of your business and brand',
    links: [
      {
        label: 'Business details & GST',
        link: '/user-settings',
      },
      {
        label: 'Branding & checkout',
        link: '/user-settings',
      },
    ],
    assetImage: BusinessProfileIcon,
  },
  {
    title: 'Integrations',
    description: 'Manage your integrations and API keys',
    links: [
      {
        label: 'API keys',
        link: '/user-settings',
      },
      {
        label: 'Webhooks',
        link: '/user-settings',
      },
      {
        label: 'Plugins',
        link: '/user-settings',
      },
    ],
    assetImage: IntegrationsIcon,
  },
  {
    title: 'Payments',
    description: 'Configure your payment methods and preferences',
    links: [
      {
        label: 'Payment methods',
        link: '/user-settings',
      },
      {
        label: 'Payment preferences',
        link: '/user-settings',
      },
      {
        label: 'Payment routing',
        link: '/user-settings',
      },
    ],
    assetImage: PaymentsIcon,
  },
  {
    title: 'Bank account & settlements',
    description: 'This is the details of the bank account where settlements are processed',
    links: [
      {
        label: 'Bank account',
        link: '/user-settings',
      },
      {
        label: 'Settlement cycle',
        link: '/user-settings',
      },
      {
        label: 'Balance & credit',
        link: '/user-settings',
      },
    ],
    assetImage: BankAccountIcon,
  },
  {
    title: 'Team management',
    description: 'Manage your team members and their roles',
    links: [
      {
        label: 'Team members',
        link: '/user-settings',
      },
      {
        label: 'Roles & permissions',
        link: '/user-settings',
      },
      {
        label: 'Activity logs',
        link: '/user-settings',
      },
    ],
    assetImage: TeamManagementIcon,
  },
];

const Settings = (): React.ReactElement => {
  return (
    <Box paddingX="spacing.10" marginTop="spacing.6" width="100%" overflow="hidden">
      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          m: '1fr 1fr',
          l: '1fr 1fr 1fr',
        }}
        gap="spacing.6"
        width="100%"
        marginBottom="spacing.4"
        marginTop="spacing.6"
      >
        {SettingsData.map((setting, index) => (
          <SettingCard key={index} {...setting} />
        ))}
      </Box>
    </Box>
  );
};

const SubSectionCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <Box display="flex" flexDirection="column" gap="spacing.2">
        <Heading size="medium" weight="semibold" color="surface.text.gray.normal">
          {title}
        </Heading>
        <Text size="medium" weight="regular" color="surface.text.gray.muted">
          {subtitle}
        </Text>
      </Box>
      <Card
        padding={isMobile ? 'spacing.5' : 'spacing.7'}
        backgroundColor="surface.background.gray.intense"
        elevation="none"
      >
        <CardBody>{children}</CardBody>
      </Card>
    </Box>
  );
};

const User = (): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={{
        xs: 'spacing.5',
        l: 'spacing.10',
      }}
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={{
          xs: '343px',
          m: '718px',
        }}
        marginBottom="spacing.9"
      >
        <Box
          width="100%"
          height="40px"
          display="flex"
          justifyContent="flex-end"
          flexDirection="column"
        >
          <Box
            marginBottom={{
              xs: 'spacing.3',
              l: 'spacing.2',
            }}
          >
            <ReactRouterDomLink to="/settings">
              <BladeLink icon={ChevronLeftIcon} size="small">
                Back
              </BladeLink>
            </ReactRouterDomLink>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-start" width="100%">
          <Heading size="large" weight="semibold" color="surface.text.gray.normal">
            User Profile
          </Heading>
        </Box>

        <Box
          width="100%"
          marginTop={{
            xs: 'spacing.7',
            l: 'spacing.8',
          }}
        >
          {/* Profile Details Card */}
          <SubSectionCard
            title="Profile details"
            subtitle="These are your personal, user-level details"
          >
            <Box display="flex" flexDirection="column" gap="spacing.5">
              {/* Name field */}
              <Box
                display="grid"
                gridTemplateColumns={isMobile ? '150px 1fr' : '250px 1fr'}
                alignItems="center"
              >
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Name
                </Text>
                <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                  Blade Team
                </Text>
              </Box>

              {/* User role field */}
              <Box
                display="grid"
                gridTemplateColumns={isMobile ? '150px 1fr' : '250px 1fr'}
                alignItems="center"
              >
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  User role
                </Text>
                <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                  Owner
                </Text>
              </Box>

              {/* Email ID field */}
              <Box
                display="grid"
                gridTemplateColumns={isMobile ? '150px 1fr' : '250px 1fr'}
                alignItems="center"
              >
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Email ID
                </Text>
                <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                  <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                    owner@gmail.com
                  </Text>
                  <IconButton
                    icon={EditIcon}
                    size="medium"
                    accessibilityLabel="Edit"
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onClick={() => {}}
                  />
                </Box>
              </Box>

              {/* Login password field */}
              <Box
                display="grid"
                gridTemplateColumns={isMobile ? '150px 1fr' : '250px 1fr'}
                alignItems="center"
              >
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Login password
                </Text>
                <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                  <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                    ***********
                  </Text>
                  <IconButton
                    icon={EditIcon}
                    size="medium"
                    accessibilityLabel="Edit"
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onClick={() => {}}
                  />
                </Box>
              </Box>

              {/* Phone number field */}
              <Box
                display="grid"
                gridTemplateColumns={isMobile ? '150px 1fr' : '250px 1fr'}
                alignItems="center"
              >
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Phone number
                </Text>
                <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                  <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                    +91 9632412347
                  </Text>
                  <IconButton
                    icon={EditIcon}
                    size="medium"
                    accessibilityLabel="Edit"
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onClick={() => {}}
                  />
                </Box>
              </Box>
            </Box>
          </SubSectionCard>

          {/* Two Factor Authentication Card */}
          <Box
            marginTop={{
              xs: 'spacing.9',
              l: '64px',
            }}
          >
            <SubSectionCard
              title="Two factor authentication"
              subtitle="Secure your account by using a one-time verification code each time you log in"
            >
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <Box display="grid" gridTemplateColumns="250px 1fr" alignItems="center">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">
                    Two factor authentication
                  </Text>
                  <Switch accessibilityLabel="Toggle Two Factor Authentication" size="medium" />
                </Box>
              </Box>
            </SubSectionCard>
          </Box>

          {/* Notifications Card */}
          <Box
            marginTop={{
              xs: 'spacing.9',
              l: '64px',
            }}
          >
            <SubSectionCard
              title="Notifications"
              subtitle="Receive notifications from Razorpay on your phone/email for any account related updates"
            >
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <Box display="grid" gridTemplateColumns="250px 1fr" alignItems="center">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">
                    SMS
                  </Text>
                  <Switch accessibilityLabel="Toggle SMS Notifications" size="medium" />
                </Box>
                <Box display="grid" gridTemplateColumns="250px 1fr" alignItems="center">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">
                    Email
                  </Text>
                  <Switch accessibilityLabel="Toggle Email Notifications" size="medium" />
                </Box>
                <Box display="grid" gridTemplateColumns="250px 1fr" alignItems="center">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">
                    Whatsapp
                  </Text>
                  <Switch accessibilityLabel="Toggle Whatsapp Notifications" size="medium" />
                </Box>
              </Box>
            </SubSectionCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface SettingLink {
  label: string;
  link: string;
}

interface SettingCardProps {
  title: string;
  description: string;
  links: SettingLink[];
  assetImage: string;
}

const App = (): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
  return (
    <BrowserRouter>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        overflowX="hidden"
        overflowY="hidden"
        // Need to remove the margin applied by storybook wrapper
        margin={isMobile ? '0em' : '-2em'}
      >
        <Box>
          <TopNavigation />
        </Box>
        <Box flex="1" display="flex" position="relative">
          <Box position="fixed" top="56px" left="spacing.0" bottom="spacing.0" zIndex="1">
            <SideNavigation />
          </Box>
          <Box
            marginLeft={{ base: 'spacing.0', m: '240px', xl: '264px' }}
            width="100%"
            maxWidth="100vw"
            overflowX="hidden"
          >
            <Box
              height="calc(100vh - 56px)"
              overflowY="auto"
              overflowX="hidden"
              backgroundColor="surface.background.gray.moderate"
            >
              <ReactRouterDomSwitch>
                <Route path="/user-settings" component={User} />
                <Route path="/" component={Settings} />
              </ReactRouterDomSwitch>
            </Box>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export function SimpleSettingsPage(): JSX.Element {
  return <App />;
}

export default {
  title: 'Patterns/Settings',
  component: SimpleSettingsPage,
  parameters,
  decorators: [storyRouterDecorator(undefined, { initialEntries: ['/settings'] })] as unknown,
} as Meta;
