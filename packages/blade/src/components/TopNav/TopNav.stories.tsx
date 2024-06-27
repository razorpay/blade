/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import storyRouterDecorator from 'storybook-react-router';
import type { TopNavProps } from './TopNav';
import { TopNav, TopNavActions, TopNavContent, TopNavBrand } from './TopNav';
import type { TabNavItemProps } from './TabNav';
import { TabNav, TabNavItem } from './TabNav';
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
  ActivityIcon,
  AnnouncementIcon,
  BulkPayoutsIcon,
  ChevronRightIcon,
  HomeIcon,
  LayoutIcon,
  MenuIcon,
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
import { useIsMobile } from '~utils/useIsMobile';
import { Text } from '~components/Typography';
import { Menu, MenuFooter, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';
import { Link as BladeLink } from '~components/Link';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/TopNav',
  component: TopNav,
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

const TabNavItemLink = (
  props: Omit<TabNavItemProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();

  return (
    <TabNavItem
      {...props}
      as={Link}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
};

const ExploreItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: IconComponent;
  title: string;
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

const TopNavTemplate: StoryFn<typeof TopNav> = () => {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  return (
    <Box>
      <TopNav backgroundColor="surface.background.gray.subtle">
        {/* TopNavBrand gets hidden on mobile */}
        <TopNavBrand>
          <RazorpayLogo />
        </TopNavBrand>
        <TopNavContent>
          {/* Desktop */}
          <TabNav display={{ base: 'none', m: 'flex' }}>
            <TabNavItemLink icon={HomeIcon} accessibilityLabel="Home" href="/home" />
            <TabNavItemLink href="/payroll">Payroll</TabNavItemLink>
            <TabNavItemLink href="/payments">Payments</TabNavItemLink>
            <TabNavItemLink href="/magic-checkout">Magic Checkout</TabNavItemLink>
            <Menu openInteraction="hover">
              <TabNavItem href="#">
                {selectedProduct ? `Explore: ${selectedProduct}` : 'Explore'}
              </TabNavItem>
              <MenuOverlay>
                <MenuHeader
                  title="Products for you"
                  trailing={
                    <Badge emphasis="subtle" color="notice">
                      Recommended
                    </Badge>
                  }
                />
                <MenuItem onClick={() => setSelectedProduct('Payroll')}>
                  <ExploreItem
                    icon={RazorpayxPayrollIcon}
                    title="Payroll"
                    description="Supercharge your process of paying salaries to your employees"
                  />
                </MenuItem>
                <MenuItem onClick={() => setSelectedProduct('Payout')}>
                  <ExploreItem
                    icon={BulkPayoutsIcon}
                    title="Payout"
                    description="Pay your vendors at ease with RazorpayX"
                  />
                </MenuItem>
                <MenuFooter>
                  <BladeLink href="" icon={ChevronRightIcon} iconPosition="right">
                    View all products
                  </BladeLink>
                </MenuFooter>
              </MenuOverlay>
            </Menu>
          </TabNav>
          {/* Mobile */}
          <Box display={{ base: 'flex', m: 'none' }} gap="spacing.4" alignItems="center">
            <Button
              size="medium"
              variant="tertiary"
              icon={MenuIcon}
              onClick={() => {
                setIsSideBarOpen(!isSideBarOpen);
              }}
            />
            <Text>Home</Text>
          </Box>
        </TopNavContent>
        <TopNavActions>
          {/* Remove searchbar on mobile */}
          <Box width={{ base: '220px', xl: '264px' }} display={{ base: 'none', m: 'block' }}>
            <SearchInput
              placeholder="Search in payments"
              accessibilityLabel="Search Across Razorpay"
            />
          </Box>
          <Tooltip content="View Ecosystem Health">
            <Button size={isMobile ? 'small' : 'medium'} variant="tertiary" icon={ActivityIcon} />
          </Tooltip>
          <Tooltip content="View Announcements">
            <Button
              size={isMobile ? 'small' : 'medium'}
              variant="tertiary"
              icon={AnnouncementIcon}
            />
          </Tooltip>
          <Avatar size="medium" name="Anurag Hazra" />
        </TopNavActions>
      </TopNav>
      <Box
        overflow="hidden"
        position="relative"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        borderRadius="large"
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
        <Box marginLeft={{ base: '100%', m: '240px', xl: '264px' }} height="calc(100vh - 58px)">
          <Box
            overflowY="scroll"
            backgroundColor="surface.background.gray.intense"
            height="100vh"
            padding="spacing.5"
          >
            <Box width={{ base: 'max-content', m: '100%' }} height="200vh">
              content
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const TopNavExample = TopNavTemplate.bind({});
TopNavExample.storyName = 'TopNavExample';
