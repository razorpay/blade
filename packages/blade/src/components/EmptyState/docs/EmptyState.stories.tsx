import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { EmptyState } from '../EmptyState';
import { Button } from '~components/Button';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Heading } from '~components/Typography';
import type { EmptyStateProps } from '../types';
import { EmptyStateStoryCode } from './code';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { EcommerceIcon } from '~components/Icons';

const getEmptyStateArgTypes = () => ({
  size: {
    control: {
      type: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    description: 'Size variant that controls spacing and text sizes',
  },
  title: {
    control: 'text',
    description: 'Main heading text for the empty state',
  },
  description: {
    control: 'text',
    description: 'Descriptive text explaining the empty state',
  },
  asset: {
    control: false,
    description: 'React element to display as the main visual asset',
  },
  children: {
    control: false,
    description: 'Action buttons or links to display below the text content',
  },
  ...getStyledPropsArgTypes(),
});

export default {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: getEmptyStateArgTypes(),
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="EmptyState component provides a consistent way to show empty states with optional assets, titles, descriptions, and actions across the application."
          componentName="EmptyState"
          figmaURL="https://www.figma.com/design/UTlH5NpDte6c9L7o8z93vd/-Research--Empty-States?node-id=582-85262&m=dev"
        >
          <Heading size="large">Usage</Heading>
          <Sandbox editorHeight={500}>{EmptyStateStoryCode}</Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<EmptyStateProps>;

// Asset components with size-based dimensions
type AssetSize = 'small' | 'medium' | 'large' | 'xlarge';

const getAssetDimensions = (size: AssetSize) => {
  const dimensions = {
    small: { width: '60px', height: '60px' },
    medium: { width: '90px', height: '90px' },
    large: { width: '120px', height: '120px' },
    xlarge: { width: '160px', height: '160px' },
  };
  return dimensions[size];
};

const createAssetComponent = (src: string, alt: string) => ({
  size = 'medium',
}: {
  size?: AssetSize;
}) => {
  const { width, height } = getAssetDimensions(size);
  return <img src={src} alt={alt} width={width} height={height} style={{ objectFit: 'contain' }} />;
};

const ListViewAsset = createAssetComponent('https://shorturl.at/x1CRv', 'List view');
const NoDataAsset = createAssetComponent('https://shorturl.at/5z72G', 'No data');
const ErrorAsset = createAssetComponent('https://shorturl.at/qvgcJ', 'Error');
const NoNotificationAsset = createAssetComponent('https://shorturl.at/XDpWx', 'No notifications');
const AccessDeniedAsset = createAssetComponent('https://shorturl.at/64ss7', 'Access denied');

const BasicTemplate: StoryFn<typeof EmptyState> = (args) => <EmptyState {...args} />;

export const Basic = BasicTemplate.bind({});
Basic.args = {
  asset: <ErrorAsset />,
  title: 'We couldn’t find the page you’re looking for',
  description: 'The page you are looking for does not exist, or has been moved.',
  children: (
    <Box display="flex" flexDirection="column" gap="spacing.4" alignItems="center">
      <Box display="flex" flexDirection="row" gap="spacing.2">
        <Button onClick={() => {}}>Go to Home</Button>
        <Button variant="secondary" onClick={() => {}}>
          Go to Blade Docs
        </Button>
      </Box>
      <Link href="/">Need help?</Link>
    </Box>
  ),
};

export const WithTitleAndDescription = BasicTemplate.bind({});
WithTitleAndDescription.args = {
  asset: <NoDataAsset />,
  title: 'No content available',
  description: 'Please try again later',
};

export const OnlyAsset = BasicTemplate.bind({});
OnlyAsset.args = {
  asset: <AccessDeniedAsset />,
};

export const AllSizes = () => (
  <Box display="flex" flexDirection="column" gap="spacing.10">
    <Box>
      <Heading size="small" marginBottom="spacing.4">
        Small Size
      </Heading>
      <EmptyState
        size="small"
        asset={<NoNotificationAsset size="small" />}
        title="Small Empty State"
        description="This is a small empty state with reduced spacing and text sizes."
      />
    </Box>

    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        Medium Size
      </Heading>
      <EmptyState
        size="medium"
        asset={<NoNotificationAsset size="medium" />}
        title="Medium Empty State"
        description="This is a medium empty state with default spacing and text sizes."
      />
    </Box>

    <Box>
      <Heading size="large" marginBottom="spacing.4">
        Large Size
      </Heading>
      <EmptyState
        size="large"
        asset={<NoNotificationAsset size="large" />}
        title="Large Empty State"
        description="This is a large empty state with increased spacing and text sizes."
      />
    </Box>

    <Box>
      <Heading size="xlarge" marginBottom="spacing.4">
        XLarge Size
      </Heading>
      <EmptyState
        size="xlarge"
        asset={<NoNotificationAsset size="xlarge" />}
        title="XLarge Empty State"
        description="This is an xlarge empty state with maximum spacing and text sizes."
      />
    </Box>
  </Box>
);

export const WithSingleAction = BasicTemplate.bind({});
WithSingleAction.args = {
  asset: <ListViewAsset />,
  title: 'No payment links found',
  description: 'Create your first payment link to start accepting payments from customers.',
  children: <Button>Create Payment Link</Button>,
};

export const WithMultipleActions = BasicTemplate.bind({});
WithMultipleActions.args = {
  asset: <NoDataAsset />,
  title: 'No data available',
  description: 'Get started by importing your data or creating new records.',
  children: (
    <Box display="flex" flexDirection="column" gap="spacing.3" alignItems="center">
      <Button>Import Data</Button>
      <Button variant="secondary" marginTop="spacing.3">
        Create New Record
      </Button>
    </Box>
  ),
};

export const WithActionAndLink = BasicTemplate.bind({});
WithActionAndLink.args = {
  asset: <ErrorAsset />,
  title: 'Something went wrong',
  description: 'We encountered an error while loading your data. Please try again.',
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
      <Button>Try Again</Button>
      <Link href="/support">Contact Support</Link>
    </Box>
  ),
};

export const WithLinkOnly = BasicTemplate.bind({});
WithLinkOnly.args = {
  asset: <NoNotificationAsset />,
  title: 'No notifications',
  description: "You're all caught up! Check back later for new notifications.",
  children: <Link href="/settings">Manage Notification Settings</Link>,
};

export const DifferentAssets = () => (
  <Box display="flex" flexDirection="column" gap="spacing.10">
    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        With Blade Icon Component
      </Heading>
      <EmptyState
        asset={<EcommerceIcon size="2xlarge" />}
        title="Empty Cart"
        description="You haven't added any items to your cart yet."
      />
    </Box>
    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        List View Asset
      </Heading>
      <EmptyState
        asset={<ListViewAsset />}
        title="No items in list"
        description="Add items to see them appear in your list view."
      >
        <Button>Add Item</Button>
      </EmptyState>
    </Box>

    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        No Data Asset
      </Heading>
      <EmptyState
        asset={<NoDataAsset />}
        title="No data available"
        description="Import or create data to get started with your dashboard."
      >
        <Button>Import Data</Button>
      </EmptyState>
    </Box>

    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        Error Asset
      </Heading>
      <EmptyState
        asset={<ErrorAsset />}
        title="Failed to load data"
        description="We couldn't retrieve your data. Please check your connection and try again."
      >
        <Box display="flex" flexDirection="column" gap="spacing.3" alignItems="center">
          <Button>Retry</Button>
          <Link href="/support">Get Help</Link>
        </Box>
      </EmptyState>
    </Box>

    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        No Notifications Asset
      </Heading>
      <EmptyState
        asset={<NoNotificationAsset />}
        title="No notifications"
        description="You're all caught up! New notifications will appear here."
      >
        <Link href="/settings/notifications">Notification Settings</Link>
      </EmptyState>
    </Box>

    <Box>
      <Heading size="medium" marginBottom="spacing.4">
        Access Denied Asset
      </Heading>
      <EmptyState
        asset={<AccessDeniedAsset />}
        title="Access denied"
        description="You don't have permission to view this content. Contact your administrator for access."
      >
        <Link href="/contact">Request Access</Link>
      </EmptyState>
    </Box>
  </Box>
);
