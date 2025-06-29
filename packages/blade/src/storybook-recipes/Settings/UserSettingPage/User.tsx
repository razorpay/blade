import { Link } from 'react-router-dom';
import { Box } from '../../../components/Box';
import { Heading, Text } from '../../../components/Typography';
import { Switch } from '../../../components/Switch';
import { ChevronLeftIcon, EditIcon } from '../../../components/Icons';
import { Link as LinkComponent } from '../../../components/Link';
import { IconButton } from '../../../components/Button/IconButton';
import { Card, CardBody } from '../../../components/Card';
import { useTheme, useBreakpoint } from '../../../utils';

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
            <Link to="/settings">
              <LinkComponent icon={ChevronLeftIcon} size={isMobile ? 'small' : 'medium'}>
                Back
              </LinkComponent>
            </Link>
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
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Name
                </Text>
                <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                  Blade Team
                </Text>
              </Box>

              {/* User role field */}
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  User role
                </Text>
                <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                  Owner
                </Text>
              </Box>

              {/* Email ID field */}
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
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
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                <Text size="medium" weight="medium" color="surface.text.gray.muted">
                  Login password
                </Text>
                <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                  <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
                    ****************
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
              <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
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
                <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
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
                <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">
                    SMS
                  </Text>
                  <Switch accessibilityLabel="Toggle SMS Notifications" size="medium" />
                </Box>
                <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">
                    Email
                  </Text>
                  <Switch accessibilityLabel="Toggle Email Notifications" size="medium" />
                </Box>
                <Box display="grid" gridTemplateColumns="200px 1fr" alignItems="center">
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

export default User;
