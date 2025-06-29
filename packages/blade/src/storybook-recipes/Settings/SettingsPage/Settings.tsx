import { Link as LinkComponent } from 'react-router-dom';
import { Box } from '../../../components/Box';
import type { Platform } from '../../../utils/platform/index.all';
import UserProfileIcon from '../assets/png/user.png';
import BusinessProfileIcon from '../assets/png/business.png';
import IntegrationsIcon from '../assets/png/integrations.png';
import PaymentsIcon from '../assets/png/payments.png';
import BankAccountIcon from '../assets/png/bank.png';
import TeamManagementIcon from '../assets/png/team.png';
import { Scale } from '../../../components/Scale';
import { Card, CardBody } from '../../../components/Card';
import { Heading, Text } from '../../../components/Typography';
import { Link } from '../../../components/Link';

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
}: SettingCardProps): Platform.Select<{ web: React.ReactElement; native: never }> => {
  return (
    <Scale motionTriggers={['hover']}>
      <Card
        height="250px"
        isSelected={false}
        backgroundColor="surface.background.gray.intense"
        padding="spacing.0"
        borderRadius="medium"
        elevation="none"
        // onClick={handleClick}
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
                    <LinkComponent key={index} to={link.link}>
                      <Link key={index} color="primary" size="medium">
                        {link.label}
                      </Link>
                    </LinkComponent>
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

const Settings = (): Platform.Select<{ web: React.ReactElement; native: never }> => {
  return (
    <Box
      paddingX="spacing.7"
      marginTop={{
        xs: 'spacing.7',
        l: 'spacing.9',
      }}
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
        {SettingsData.map((setting, index) => (
          <SettingCard key={index} {...setting} />
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
