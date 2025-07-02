## Pattern Name

Settings

## Description

The Settings pattern provides a structured way to organize application configuration options and user preferences. It combines a grid-based overview page displaying categorized settings cards with detailed settings pages for specific configurations. This pattern is ideal for applications that need to manage multiple configuration areas while maintaining a consistent and accessible user experience.

## Components Used

- Box
- Card
- Text
- Heading
- Link
- IconButton
- Switch
- Button
- TopNav
- SideNav

## Example

### Complete Settings Interface

This example demonstrates a full settings interface with navigation, overview page, and a detailed settings page. It includes responsive layouts, navigation patterns, and proper accessibility implementation.

#### Things while building this pattern
- We need to use the `Scale` component to animate the card when hovered.
- We need to use the `Card` component to create the card.
- We need to use the `Text` component to create the text.
- We need to use the `Heading` component to create the heading.
- We need to use the `IconButton` component to create the icon button.
- We need to use the `Switch` component to create the switch. (use switch from `@razorpay/blade/components` , not from React router dom)
- Take following code as reference and build the settings interface. also make sure to use the `useTheme` and `useBreakpoint` hooks to make the interface responsive. 
- Try to keep spacing consistent across the interface.
- We don't have any title on Settings page, just display the settings data using cards.
- Make sure the styling of the cards are consistent across the interface.

```tsx
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  Link,
  IconButton,
  Switch,
  Button,
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLink,
  useTheme,
  useBreakpoint,
  ChevronLeftIcon,
  EditIcon,
  HomeIcon,
  SettingsIcon,
} from '@razorpay/blade/components';

// Settings Overview Page
const SettingsOverview = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const settingsData = [
    {
      title: 'User Profile',
      description: 'Manage your personal profile and security settings',
      links: [
        { label: 'Personal Information', link: '/settings/profile' },
        { label: 'Security Settings', link: '/settings/security' },
        { label: 'Notification Preferences', link: '/settings/notifications' },
      ],
    },
    {
      title: 'Business Settings',
      description: 'Configure your business profile and preferences',
      links: [
        { label: 'Company Details', link: '/settings/company' },
        { label: 'Billing Information', link: '/settings/billing' },
      ],
    },
    {
      title: 'Team Management',
      description: 'Manage team members and their permissions',
      links: [
        { label: 'Team Members', link: '/settings/team' },
        { label: 'Roles & Permissions', link: '/settings/roles' },
      ],
    },
  ];

  return (
    <Box
      padding={{
        base: 'spacing.5',
        m: 'spacing.8',
      }}
      backgroundColor="surface.background.gray.subtle"
    >
      <Box marginBottom="spacing.6">
        <Heading size="xlarge" weight="semibold">
          Settings
        </Heading>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          m: 'repeat(2, 1fr)',
          l: 'repeat(3, 1fr)',
        }}
        gap="spacing.6"
      >
        {settingsData.map((section, index) => (
          <Card
            key={index}
            backgroundColor="surface.background.gray.intense"
            padding="spacing.6"
            elevation="none"
          >
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Heading size="medium" weight="semibold">
                  {section.title}
                </Heading>
                <Text color="surface.text.gray.muted">{section.description}</Text>
                <Box display="flex" flexDirection="column" gap="spacing.3">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.link}
                      color="primary"
                      size="medium"
                      accessibilityLabel={`Go to ${link.label}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// Settings Detail Page
const SettingsDetail = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box
      padding={{
        base: 'spacing.5',
        m: 'spacing.8',
      }}
      maxWidth="800px"
      margin="0 auto"
    >
      <Box display="flex" alignItems="center" marginBottom="spacing.6">
        <Link
          href="/settings"
          icon={ChevronLeftIcon}
          accessibilityLabel="Back to settings"
          size={isMobile ? 'small' : 'medium'}
        >
          Back to Settings
        </Link>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="xlarge" weight="semibold">
          Profile Settings
        </Heading>
      </Box>

      <Card
        backgroundColor="surface.background.gray.intense"
        padding={{
          base: 'spacing.5',
          m: 'spacing.7',
        }}
        elevation="none"
      >
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.6">
            {/* Personal Information Section */}
            <Box>
              <Heading size="medium" weight="semibold" marginBottom="spacing.4">
                Personal Information
              </Heading>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: '1fr',
                    m: '200px 1fr',
                  }}
                  gap="spacing.2"
                  alignItems="center"
                >
                  <Text color="surface.text.gray.muted">Name</Text>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Text>John Doe</Text>
                    <IconButton
                      icon={EditIcon}
                      size="small"
                      variant="tertiary"
                      accessibilityLabel="Edit name"
                      onClick={() => {}}
                    />
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: '1fr',
                    m: '200px 1fr',
                  }}
                  gap="spacing.2"
                  alignItems="center"
                >
                  <Text color="surface.text.gray.muted">Email</Text>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Text>john.doe@example.com</Text>
                    <IconButton
                      icon={EditIcon}
                      size="small"
                      variant="tertiary"
                      accessibilityLabel="Edit email"
                      onClick={() => {}}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Security Settings Section */}
            <Box>
              <Heading size="medium" weight="semibold" marginBottom="spacing.4">
                Security Settings
              </Heading>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: '1fr',
                    m: '200px 1fr',
                  }}
                  gap="spacing.2"
                  alignItems="center"
                >
                  <Text color="surface.text.gray.muted">Two-Factor Authentication</Text>
                  <Switch
                    size="medium"
                    accessibilityLabel="Toggle two-factor authentication"
                    onChange={({ isChecked }) => console.log('2FA:', isChecked)}
                  />
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: '1fr',
                    m: '200px 1fr',
                  }}
                  gap="spacing.2"
                  alignItems="center"
                >
                  <Text color="surface.text.gray.muted">Email Notifications</Text>
                  <Switch
                    size="medium"
                    accessibilityLabel="Toggle email notifications"
                    onChange={({ isChecked }) => console.log('Notifications:', isChecked)}
                  />
                </Box>
              </Box>
            </Box>

            <Box marginTop="spacing.4">
              <Button
                variant="primary"
                size={isMobile ? 'medium' : 'large'}
                accessibilityLabel="Save changes"
                onClick={() => {}}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

// Main Settings Layout
const SettingsLayout = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <TopNav>
        <TopNavBrand>
          <img src="/logo.svg" alt="Company Logo" />
        </TopNavBrand>
        <TopNavContent />
        <TopNavActions>
          <Button
            variant="tertiary"
            icon={HomeIcon}
            accessibilityLabel="Go to dashboard"
            onClick={() => {}}
          />
        </TopNavActions>
      </TopNav>

      <Box flex="1" display="flex">
        {!isMobile && (
          <Box width="240px" borderRight="thin" borderColor="border.neutral.subtle">
            <SideNav>
              <SideNavBody>
                <SideNavLink
                  icon={HomeIcon}
                  title="Dashboard"
                  href="/dashboard"
                  accessibilityLabel="Go to dashboard"
                />
                <SideNavLink
                  icon={SettingsIcon}
                  title="Settings"
                  href="/settings"
                  isActive
                  accessibilityLabel="Settings page"
                />
              </SideNavBody>
              <SideNavFooter />
            </SideNav>
          </Box>
        )}

        <Box flex="1" overflowY="auto">
          <SettingsOverview />
        </Box>
      </Box>
    </Box>
  );
};

export { SettingsLayout, SettingsOverview, SettingsDetail };
```

The example above demonstrates a complete settings pattern implementation with three main components:

1. `SettingsLayout`: The main layout component that provides:
   - Responsive navigation with TopNav and SideNav
   - Mobile-friendly layout adjustments
   - Proper accessibility labeling for navigation items

2. `SettingsOverview`: A grid-based overview page showing:
   - Categorized settings cards
   - Responsive grid layout
   - Accessible navigation links
   - Clear visual hierarchy with headings and descriptions

3. `SettingsDetail`: A detailed settings page demonstrating:
   - Form layout best practices
   - Responsive input arrangements
   - Proper accessibility labeling
   - Interactive elements (IconButton, Switch)
   - Clear section organization
   - Save action handling

The pattern uses Blade's design tokens for consistent spacing, colors, and typography while maintaining accessibility through proper ARIA labels and semantic HTML structure. It adapts to different screen sizes and provides a cohesive settings management experience.
