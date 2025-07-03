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


## Settings Page Component

The Settings page component provides a comprehensive overview of all configurable aspects of the application. It presents settings categories in a grid layout using cards, each with its own visual identity and quick access links.

### Features

1. **Grid Layout**
   - Responsive grid that adapts to different screen sizes
   - Cards for different setting categories
   - Visual hierarchy with icons and illustrations

2. **Category Cards**
   - Consistent card design with title and description
   - Quick access links to specific settings
   - Visual illustrations for each category
   - Background gradient effects for visual appeal

3. **Categories Covered** (these are examples, they may change based on the application)
   - User Profile
   - Business Profile
   - Integrations
   - Payments
   - Bank Account & Settlements
   - Team Management


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
### Key Features

1. **Responsive Grid Layout**
   - Single column on mobile
   - Two columns on medium screens
   - Three columns on large screens
   - Consistent spacing between cards
   - Proper padding for container

2. **Card Design**
   - Fixed height for consistency
   - Clear visual hierarchy
   - Background gradient for visual interest
   - Proper spacing for content
   - Accessible link structure

3. **Visual Elements**
   - Category illustrations
   - Gradient background effects
   - Consistent typography scale
   - Clear color contrast
   - Proper spacing hierarchy

4. **Navigation**
   - Quick access links for each category
   - Clear link labeling
   - Proper routing integration
   - Consistent link styling

5. **Accessibility**
   - Semantic HTML structure
   - Proper heading hierarchy
   - Alt text for images
   - Color contrast compliance
   - Keyboard navigation support

The Settings page component demonstrates best practices for:
- Grid-based layouts
- Card-based UI design
- Visual hierarchy
- Navigation patterns
- Responsive design
- Accessibility
- Component composition

This implementation provides a user-friendly overview of all available settings categories while maintaining consistency with Blade's design system principles.

## Settings Detail Page

The Settings Detail page pattern demonstrates how to structure individual settings pages that users navigate to from the main Settings overview. Using the User Profile settings as an example, this pattern shows how to organize detailed configuration options in a clear, accessible, and user-friendly manner.

### Features

1. **Page Structure**
   - Back navigation to main settings
   - Clear page title and context
   - Organized sections with descriptions
   - Consistent spacing and layout

2. **Form Layout**
   - Labeled form fields with proper alignment
   - Interactive elements (edit buttons, toggles)
   - Clear grouping of related settings
   - Responsive field layouts

3. **Section Organization**
   - Distinct sections for different setting types
   - Clear section headers with descriptions
   - Proper vertical spacing between sections
   - Consistent card styling

### Example

```tsx
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Switch,
  IconButton,
  Link,
  EditIcon,
  ChevronLeftIcon,
} from '@razorpay/blade/components';
import { useTheme, useBreakpoint } from '@razorpay/blade/utils';
import { Link as RouterLink } from 'react-router-dom';

// Helper component for displaying row values with optional edit button
const CardRowValueContainer = ({
  showEditItem,
  value,
}: {
  showEditItem: boolean;
  value: string;
}): React.ReactElement | null => {
  if (showEditItem) {
    return (
      <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
        <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
          {value}
        </Text>
        <IconButton
          icon={EditIcon}
          size="medium"
          accessibilityLabel="Edit"
          onClick={() => {}}
        />
      </Box>
    );
  }

  return (
    <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
      {value}
    </Text>
  );
};

// Component for consistent row layout
const CardRow = ({
  label,
  value,
  trailingElement,
  showEditIcon = false,
}: {
  label: string;
  value?: string;
  trailingElement?: React.ReactNode;
  showEditIcon?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
  
  return (
    <Box
      display="grid"
      gridTemplateColumns={isMobile ? '150px 1fr' : '250px 1fr'}
      alignItems="center"
    >
      <Text size="medium" weight="medium" color="surface.text.gray.muted">
        {label}
      </Text>
      {trailingElement ? (
        trailingElement
      ) : (
        <CardRowValueContainer showEditItem={showEditIcon} value={value ?? ''} />
      )}
    </Box>
  );
};

// Section card component for grouping related settings
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

// Example Settings Detail Page (User Profile)
export const SettingsDetailPage = (): React.ReactElement => {
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
        {/* Back Navigation */}
        <Box width="100%" height="40px" display="flex" justifyContent="flex-end" flexDirection="column">
          <Box marginBottom={{ xs: 'spacing.3', l: 'spacing.2' }}>
            <RouterLink to="/settings">
              <Link icon={ChevronLeftIcon} size="small">
                Back
              </Link>
            </RouterLink>
          </Box>
        </Box>

        {/* Page Title */}
        <Box display="flex" justifyContent="flex-start" width="100%">
          <Heading size="large" weight="semibold" color="surface.text.gray.normal">
            User Profile
          </Heading>
        </Box>

        {/* Settings Sections */}
        <Box
          width="100%"
          marginTop={{
            xs: 'spacing.7',
            l: 'spacing.8',
          }}
        >
          {/* Profile Details */}
          <SubSectionCard
            title="Profile details"
            subtitle="These are your personal, user-level details"
          >
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <CardRow label="Name" value="John Doe" />
              <CardRow label="User role" value="Owner" />
              <CardRow label="Email ID" value="john@example.com" showEditIcon />
              <CardRow label="Login password" value="**********" showEditIcon />
              <CardRow label="Phone number" value="+1 234 567 8900" showEditIcon />
            </Box>
          </SubSectionCard>

          {/* Two Factor Authentication */}
          <Box marginTop={{ xs: 'spacing.9', l: '64px' }}>
            <SubSectionCard
              title="Two factor authentication"
              subtitle="Secure your account by using a one-time verification code each time you log in"
            >
              <CardRow
                label="Two factor authentication"
                trailingElement={
                  <Switch accessibilityLabel="Toggle Two Factor Authentication" size="medium" />
                }
              />
            </SubSectionCard>
          </Box>

          {/* Notifications */}
          <Box marginTop={{ xs: 'spacing.9', l: '64px' }}>
            <SubSectionCard
              title="Notifications"
              subtitle="Receive notifications on your phone/email for any account related updates"
            >
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <CardRow
                  label="Email"
                  trailingElement={
                    <Switch accessibilityLabel="Toggle Email Notifications" size="medium" />
                  }
                />
                <CardRow
                  label="Whatsapp"
                  trailingElement={
                    <Switch accessibilityLabel="Toggle Whatsapp Notifications" size="medium" />
                  }
                />
                <CardRow
                  label="SMS"
                  trailingElement={
                    <Switch accessibilityLabel="Toggle SMS Notifications" size="medium" />
                  }
                />
              </Box>
            </SubSectionCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

```


### Key Features

1. **Page Layout**
   - Centered content with responsive width
   - Clear back navigation
   - Prominent page title
   - Consistent section spacing

2. **Form Components**
   - Reusable `CardRow` for consistent field layout
   - `SubSectionCard` for section grouping
   - Interactive elements with proper accessibility
   - Responsive grid layouts

3. **Visual Hierarchy**
   - Clear section headings
   - Descriptive subtitles
   - Consistent typography
   - Proper spacing between elements

4. **Interactive Elements**
   - Edit buttons for modifiable fields
   - Toggle switches for features
   - Back navigation link
   - Proper hover states

5. **Accessibility**
   - Semantic HTML structure
   - Proper heading hierarchy
   - Descriptive labels
   - Keyboard navigation support
   - ARIA labels for interactive elements

The Settings Detail page pattern demonstrates best practices for:
- Detailed settings organization
- Form layout and structure
- Interactive element placement
- Responsive design
- Accessibility
- Component composition
- Visual hierarchy
- Navigation patterns
This implementation can be used as a template for creating other settings detail pages, ensuring consistency across the application while maintaining a user-friendly and accessible interface.


