import { Box } from '../../../../components/Box';
import UserProfileIcon from '../../assets/png/user.png';
import BusinessProfileIcon from '../../assets/png/business.png';
import IntegrationsIcon from '../../assets/png/integrations.png';
import PaymentsIcon from '../../assets/png/payments.png';
import BankAccountIcon from '../../assets/png/bank.png';
import TeamManagementIcon from '../../assets/png/team.png';
import { SettingCard } from './components/SettingsCard/SettingCard.web';

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
