## Pattern Name
Settings

## Description
The Settings pattern provides a structured way to organize and display application configuration options, user preferences, and system settings. It uses a card-based layout with clear categorization, making it easy for users to navigate and modify different aspects of the application. The pattern supports both overview and detailed settings pages, with responsive layouts and accessibility features built-in.

## Components Used
- Box
- Card
- Text
- Heading
- Link
- IconButton
- Switch
- Avatar
- Scale
- TopNav
- SideNav
- Menu

## Example

### Settings Overview Page
This example demonstrates a comprehensive settings overview page with multiple setting categories displayed as cards. Each card includes a title, description, quick links, and an illustrative icon.

```tsx
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  Link,
  Scale,
  useTheme,
  useBreakpoint
} from '@razorpay/blade/components';

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
                    <Link key={index} href={link.link} color="primary" size="medium">
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

const Settings = (): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const settingsData = [
    {
      title: 'User profile',
      description: 'This is your personal profile, contact information and role permissions',
      links: [
        { label: 'Email & password', link: '/user-settings' },
        { label: 'Phone number', link: '/user-settings' },
        { label: 'Two factor authentication', link: '/user-settings' },
        { label: 'Notifications', link: '/user-settings' },
      ],
      assetImage: '/assets/user-profile.png',
    },
    {
      title: 'Business profile',
      description: 'These are the details of your business and brand',
      links: [
        { label: 'Business details & GST', link: '/business-settings' },
        { label: 'Branding & checkout', link: '/business-settings' },
      ],
      assetImage: '/assets/business-profile.png',
    },
    // Add more setting categories as needed
  ];

  return (
    <Box
      paddingX={isMobile ? 'spacing.5' : 'spacing.7'}
      marginTop={isMobile ? 'spacing.7' : 'spacing.9'}
      width="100%"
      overflow="hidden"
    >
      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          m: '1fr 1fr',
          l: '1fr 1fr 1fr',
        }}
        gap="spacing.7"
        width="100%"
      >
        {settingsData.map((setting, index) => (
          <SettingCard key={index} {...setting} />
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
```

### Detailed Settings Page
This example shows a detailed settings page for a specific category (User Profile) with form fields, toggles, and edit capabilities.

```tsx
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  IconButton,
  Switch,
  Link,
  EditIcon,
} from '@razorpay/blade/components';

const SubSectionCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}): React.ReactElement => {
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
        padding="spacing.7"
        backgroundColor="surface.background.gray.intense"
        elevation="none"
      >
        <CardBody>{children}</CardBody>
      </Card>
    </Box>
  );
};

const UserProfile = (): React.ReactElement => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX="spacing.10"
      width="100%"
      maxWidth="718px"
      margin="0 auto"
    >
      <Box marginBottom="spacing.9">
        <Link href="/settings" icon="chevron-left">
          Back
        </Link>
        <Heading size="large" weight="semibold" color="surface.text.gray.normal">
          User Profile
        </Heading>

        <Box marginTop="spacing.8">
          <SubSectionCard
            title="Profile details"
            subtitle="These are your personal, user-level details"
          >
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Name
                </Text>
                <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                  John Doe
                </Text>
              </Box>

              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Email ID
                </Text>
                <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                  <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                    john.doe@example.com
                  </Text>
                  <IconButton
                    icon={EditIcon}
                    size="medium"
                    accessibilityLabel="Edit email"
                    onClick={() => {}}
                  />
                </Box>
              </Box>
            </Box>
          </SubSectionCard>

          <Box marginTop="64px">
            <SubSectionCard
              title="Two factor authentication"
              subtitle="Secure your account by using a one-time verification code each time you log in"
            >
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Two factor authentication
                </Text>
                <Switch
                  isChecked={false}
                  onChange={({ isChecked }) => console.log(isChecked)}
                  ariaLabel="Toggle two factor authentication"
                />
              </Box>
            </SubSectionCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
``` 