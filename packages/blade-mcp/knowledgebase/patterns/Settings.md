# Settings Pattern

## Description

The Settings pattern provides a comprehensive interface for managing application configurations and user preferences. It combines a responsive navigation system (TopNav + SideNav) with a grid-based overview page displaying categorized settings cards and detailed settings pages. This pattern is ideal for applications that need to manage multiple configuration areas while maintaining a consistent and accessible user experience across different screen sizes.

## Components Used

- Box
- Card
- SideNav
- TopNav
- TabNav
- Menu
- Button
- IconButton
- Link
- Text
- Heading
- Badge
- Avatar
- Switch
- SearchInput
- Indicator
- ProgressBar

## Example

```tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLink,
  SideNavSection,
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItems,
  TabNavItem,
  Menu,
  MenuHeader,
  MenuItem,
  MenuFooter,
  MenuOverlay,
  Button,
  IconButton,
  Link,
  Text,
  Heading,
  Badge,
  Avatar,
  Switch,
  SearchInput,
  Indicator,
  ProgressBar,
  HomeIcon,
  WalletIcon,
  CreditCardIcon,
  BankIcon,
  BillIcon,
  ArrowUpRightIcon,
  PlusIcon,
  SettingsIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@razorpay/blade/components';
import { useTheme, useBreakpoint } from '@razorpay/blade/utils';
import { BrowserRouter, Route, Link as RouterLink } from 'react-router-dom';

// Settings Card Component for Overview Page
const SettingCard = ({
  title,
  description,
  links,
  assetImage,
}: {
  title: string;
  description: string;
  links: Array<{ label: string; link: string }>;
  assetImage: string;
}): React.ReactElement => {
  return (
    <Card
      height="285px"
      backgroundColor="surface.background.gray.intense"
      padding="spacing.0"
      borderRadius="medium"
      elevation="none"
    >
      <CardBody>
        <Box position="relative" height="285px" overflow="hidden" padding="spacing.7">
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
                <Box minHeight="40px">
                  <Text weight="regular" color="surface.text.gray.muted">
                    {description}
                  </Text>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="spacing.3">
                {links.map((link, index) => (
                  <RouterLink key={index} to={link.link}>
                    <Link color="primary" size="medium">
                      {link.label}
                    </Link>
                  </RouterLink>
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
              }}
            />
          </div>
        </Box>
      </CardBody>
    </Card>
  );
};

// Settings Navigation Component
const SettingsNavigation = (): React.ReactElement => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  return (
    <SideNav
      isOpen={isMobileOpen}
      onDismiss={() => setIsMobileOpen(false)}
      banner={
        <Card href="/" padding="spacing.4" elevation="none">
          <CardBody>
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text size="medium" weight="semibold">
                Activation Pending
              </Text>
              <ChevronRightIcon />
            </Box>
            <ProgressBar
              label="Progress"
              showPercentage={true}
              value={50}
              accessibilityLabel="Activation progress: 50% complete"
            />
          </CardBody>
        </Card>
      }
    >
      <SideNavBody>
        <SideNavSection title="Main">
          <SideNavLink
            icon={HomeIcon}
            title="Dashboard"
            href="/dashboard"
            as={RouterLink}
            to="/dashboard"
          />
          <SideNavLink
            icon={WalletIcon}
            title="Payments"
            href="/payments"
            as={RouterLink}
            to="/payments"
            trailing={
              <Button
                icon={PlusIcon}
                size="xsmall"
                variant="tertiary"
                accessibilityLabel="Create new payment"
              />
            }
          />
        </SideNavSection>

        <SideNavSection title="Banking" maxVisibleItems={3}>
          <SideNavLink
            icon={CreditCardIcon}
            title="Credit Cards"
            href="/banking/cards"
            as={RouterLink}
            to="/banking/cards"
          />
          <SideNavLink
            icon={BankIcon}
            title="Bank Accounts"
            href="/banking/accounts"
            as={RouterLink}
            to="/banking/accounts"
          />
          <SideNavLink
            icon={BillIcon}
            title="Statements"
            href="/banking/statements"
            as={RouterLink}
            to="/banking/statements"
          />
          <SideNavLink
            icon={ArrowUpRightIcon}
            title="Transfers"
            href="/banking/transfers"
            as={RouterLink}
            to="/banking/transfers"
          />
        </SideNavSection>
      </SideNavBody>

      <SideNavFooter>
        <Box
          as="label"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="spacing.4"
        >
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Indicator
              color={isTestMode ? 'notice' : 'positive'}
              emphasis="intense"
              accessibilityLabel={isTestMode ? 'Test mode enabled' : 'Test mode disabled'}
            />
            <Text>Test Mode</Text>
          </Box>
          <Switch
            size="small"
            isChecked={isTestMode}
            onChange={({ isChecked }) => setIsTestMode(isChecked)}
            accessibilityLabel="Toggle test mode"
          />
        </Box>
        <SideNavLink
          icon={SettingsIcon}
          title="Settings"
          href="/settings"
          as={RouterLink}
          to="/settings"
          isActive
        />
      </SideNavFooter>
    </SideNav>
  );
};

// Main Settings Component
export const SettingsPage = (): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const settingsData = [
    {
      title: 'User profile',
      description: 'Manage your personal profile and security settings',
      links: [
        { label: 'Email & password', link: '/settings/profile' },
        { label: 'Two factor authentication', link: '/settings/security' },
        { label: 'Notifications', link: '/settings/notifications' },
      ],
      assetImage: '/assets/user-profile.png',
    },
    {
      title: 'Business profile',
      description: 'Configure your business details and preferences',
      links: [
        { label: 'Business details', link: '/settings/business' },
        { label: 'Branding', link: '/settings/branding' },
      ],
      assetImage: '/assets/business-profile.png',
    },
    {
      title: 'Team management',
      description: 'Manage team members and their permissions',
      links: [
        { label: 'Team members', link: '/settings/team' },
        { label: 'Roles & permissions', link: '/settings/roles' },
      ],
      assetImage: '/assets/team-management.png',
    },
  ];

  return (
    <BrowserRouter>
      <Box height="100vh" display="flex" flexDirection="column">
        <TopNav>
          <TopNavBrand>
            <img src="/logo.svg" alt="Company Logo" height={32} />
          </TopNavBrand>
          <TopNavContent>
            <TabNav>
              <TabNavItems>
                <TabNavItem title="Dashboard" icon={HomeIcon} />
                <TabNavItem title="Payments" icon={WalletIcon} isActive />
                <TabNavItem title="Settings" icon={SettingsIcon} />
              </TabNavItems>
            </TabNav>
          </TopNavContent>
          <TopNavActions>
            <SearchInput
              placeholder="Search settings"
              accessibilityLabel="Search settings"
              width="200px"
            />
            <Menu>
              <Avatar size="medium" name="John Doe" />
              <MenuOverlay>
                <MenuHeader title="Profile" />
                <MenuItem>Account settings</MenuItem>
                <MenuItem color="negative">Logout</MenuItem>
              </MenuOverlay>
            </Menu>
          </TopNavActions>
        </TopNav>

        <Box flex="1" display="flex">
          {!isMobile && (
            <Box width="240px">
              <SettingsNavigation />
            </Box>
          )}

          <Box
            flex="1"
            padding="spacing.6"
            backgroundColor="surface.background.gray.subtle"
            overflowY="auto"
          >
            <Box
              display="grid"
              gridTemplateColumns={{
                base: '1fr',
                m: 'repeat(2, 1fr)',
                l: 'repeat(3, 1fr)',
              }}
              gap="spacing.6"
            >
              {settingsData.map((setting, index) => (
                <SettingCard key={index} {...setting} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
};
```
