import { Box } from '../../../../components/Box';
import UserProfileIcon from '../../assets/png/user.png';
import BusinessProfileIcon from '../../assets/png/business.png';
import IntegrationsIcon from '../../assets/png/integrations.png';
import PaymentsIcon from '../../assets/png/payments.png';
import BankAccountIcon from '../../assets/png/bank.png';
import TeamManagementIcon from '../../assets/png/team.png';
import { SettingCard } from './components';

const SettingsData = [
  {
    title: 'User profile',
    description: 'This is your personal profile, contact information and role permissions',
    links: [
      {
        label: 'Email & password',
        link: '/settings/user',
      },
      {
        label: 'Phone number',
        link: '/settings/user',
      },
      {
        label: 'Two factor authentication',
        link: '/settings/user',
      },
      {
        label: 'Notifications',
        link: '/settings/user',
      },
    ],
    assetImage: UserProfileIcon,
    path: '/settings/user',
  },
  {
    title: 'Business profile',
    description: 'These are the details of your business and brand',
    links: [
      {
        label: 'Business details & GST',
        link: '/settings/user',
      },
      {
        label: 'Branding & checkout',
        link: '/settings/user',
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
        link: '/settings/user',
      },
      {
        label: 'Webhooks',
        link: '/settings/user',
      },
      {
        label: 'Plugins',
        link: '/settings/user',
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
        link: '/settings/user',
      },
      {
        label: 'Payment preferences',
        link: '/settings/user',
      },
      {
        label: 'Payment routing',
        link: '/settings/user',
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
        link: '/settings/user',
      },
      {
        label: 'Settlement cycle',
        link: '/settings/user',
      },
      {
        label: 'Balance & credit',
        link: '/settings/user',
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
        link: '/settings/user',
      },
      {
        label: 'Roles & permissions',
        link: '/settings/user',
      },
      {
        label: 'Activity logs',
        link: '/settings/user',
      },
    ],
    assetImage: TeamManagementIcon,
  },
];

const Settings = () => {
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
