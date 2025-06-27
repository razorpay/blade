import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLink,
  SideNavLevel,
  SideNavSection,
  SideNavItem,
} from '../../../components/SideNav';
import { Box } from '../../../components/Box';
import { Card, CardBody } from '../../../components/Card';
import { Text } from '../../../components/Typography';
import { ProgressBar } from '../../../components/ProgressBar';
import { Indicator } from '../../../components/Indicator';
import { Switch } from '../../../components/Switch';
import { Button } from '../../../components/Button';
import { Tooltip } from '../../../components/Tooltip';
import {
  HomeIcon,
  WalletIcon,
  CreditCardIcon,
  BankIcon,
  BillIcon,
  ArrowUpRightIcon,
  PlusIcon,
  SettingsIcon,
  MenuIcon,
  ChevronRightIcon,
} from '../../../components/Icons';

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
      as={Link}
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
                accessibilityLabel="Toggle test mode"
                size="small"
                isChecked={isTestModeActive}
                onChange={({ isChecked }) => setIsTestModeActive(isChecked)}
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

export default SideNavigation;
