## Pattern Name

Settings

## Description

The Settings pattern provides a comprehensive solution for building settings interfaces in applications. It combines navigation (SideNav and TopNav) with content areas to create a cohesive settings experience. The pattern supports both overview pages with categorized settings cards and detailed settings pages, making it ideal for applications that need to manage multiple configuration areas while maintaining a consistent and accessible user experience.

## Components Used

- Box
- SideNav
- TopNav
- Card
- Text
- Heading
- Link
- IconButton
- Switch
- Avatar
- Scale
- Menu
- Button
- Badge
- Tooltip
- ProgressBar
- Indicator
- SearchInput

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
import React, { useState } from 'react';
import {
  Box,
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLink,
  SideNavItem,
  Card,
  CardBody,
  Text,
  Heading,
  IconButton,
  Switch,
  Avatar,
  Scale,
  Menu,
  MenuHeader,
  MenuItem,
  MenuFooter,
  MenuOverlay,
  Button,
  Badge,
  Tooltip,
  Link,
  HomeIcon,
  SettingsIcon,
  EditIcon,
  ChevronLeftIcon,
  useTheme,
  useBreakpoint,
} from '@razorpay/blade/components';

// Types for settings data
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

// Reusable card component for settings categories
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
        backgroundColor="surface.background.gray.intense"
        padding="spacing.0"
        borderRadius="medium"
        elevation="none"
      >
        <CardBody>
          <Box position="relative" height="250px" overflow="hidden" padding="spacing.7">
            <Box position="relative" zIndex="1">
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <Box>
                  <Heading
                    size="medium"
                    weight="semibold"
                    marginBottom="spacing.2"
                    color="surface.text.gray.normal"
                  >
                    {title}
                  </Heading>
                  <Text weight="regular" color="surface.text.gray.muted">
                    {description}
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap="spacing.4">
                  {links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.link}
                      color="primary"
                      size="medium"
                      aria-label={`Go to ${link.label} settings`}
                    >
                      {link.label}
                    </Link>
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

// Settings navigation component
const SettingsNavigation = (): React.ReactElement => {
  const [isTestModeActive, setIsTestModeActive] = useState(false);

  return (
    <SideNav position="relative">
      <SideNavBody>
        <SideNavLink
          icon={HomeIcon}
          title="Dashboard"
          href="/dashboard"
          data-analytics-section="main-nav"
          data-analytics-element="dashboard"
        />
        <SideNavLink
          icon={SettingsIcon}
          title="Settings"
          href="/settings"
          data-analytics-section="settings"
          data-analytics-element="settings-home"
        />
      </SideNavBody>
      <SideNavFooter>
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
              isChecked={isTestModeActive}
              onChange={({ isChecked }) => setIsTestModeActive(isChecked)}
              ariaLabel="Toggle test mode"
            />
          }
        />
      </SideNavFooter>
    </SideNav>
  );
};

// Settings overview page
const SettingsOverview = (): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const settingsData = [
    {
      title: 'User profile',
      description: 'Manage your personal profile, contact information and role permissions',
      links: [
        { label: 'Email & password', link: '/settings/user/security' },
        { label: 'Two factor authentication', link: '/settings/user/2fa' },
        { label: 'Notifications', link: '/settings/user/notifications' },
      ],
      assetImage: '/assets/user-profile.png',
    },
    {
      title: 'Business profile',
      description: 'Configure your business details and branding settings',
      links: [
        { label: 'Business details', link: '/settings/business/details' },
        { label: 'Branding', link: '/settings/business/branding' },
      ],
      assetImage: '/assets/business-profile.png',
    },
  ];

  return (
    <Box
      paddingX={isMobile ? 'spacing.5' : 'spacing.7'}
      marginTop={isMobile ? 'spacing.7' : 'spacing.9'}
      width="100%"
    >
      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          m: '1fr 1fr',
          l: '1fr 1fr 1fr',
        }}
        gap="spacing.7"
      >
        {settingsData.map((setting, index) => (
          <SettingCard key={index} {...setting} />
        ))}
      </Box>
    </Box>
  );
};

// Detailed settings page component
const DetailedSettingsPage = (): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={isMobile ? 'spacing.5' : 'spacing.10'}
      width="100%"
      maxWidth="718px"
      margin="0 auto"
    >
      <Box marginBottom="spacing.9">
        <Link
          href="/settings"
          icon={ChevronLeftIcon}
          size={isMobile ? 'small' : 'medium'}
          aria-label="Back to settings"
        >
          Back
        </Link>

        <Box marginTop="spacing.4">
          <Heading size="large" weight="semibold" color="surface.text.gray.normal">
            User Profile
          </Heading>

          <Box marginTop="spacing.8">
            <Card
              padding={isMobile ? 'spacing.5' : 'spacing.7'}
              backgroundColor="surface.background.gray.intense"
              elevation="none"
            >
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.5">
                  <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                    <Text size="medium" weight="medium" color="surface.text.gray.muted">
                      Email
                    </Text>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                        user@example.com
                      </Text>
                      <IconButton
                        icon={EditIcon}
                        size="medium"
                        accessibilityLabel="Edit email"
                        onClick={() => {}}
                      />
                    </Box>
                  </Box>

                  <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                    <Text size="medium" weight="medium" color="surface.text.gray.muted">
                      Two factor authentication
                    </Text>
                    <Switch
                      isChecked={false}
                      onChange={({ isChecked }) => console.log('2FA:', isChecked)}
                      ariaLabel="Toggle two factor authentication"
                    />
                  </Box>

                  <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                    <Text size="medium" weight="medium" color="surface.text.gray.muted">
                      Email notifications
                    </Text>
                    <Switch
                      isChecked={true}
                      onChange={({ isChecked }) => console.log('Notifications:', isChecked)}
                      ariaLabel="Toggle email notifications"
                    />
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Main settings layout component
const SettingsLayout = (): React.ReactElement => {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flex="1" display="flex" position="relative">
        <Box position="fixed" top="0" left="0" bottom="0" width="240px">
          <SettingsNavigation />
        </Box>
        <Box marginLeft="240px" width="calc(100% - 240px)" overflowY="auto">
          <SettingsOverview />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsLayout;
```
