import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { InfoGroupProps } from './types';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from './InfoGroup';
import { UserIcon, BankIcon, CheckIcon, CopyIcon, ExternalLinkIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { Badge } from '~components/Badge';
import { Code } from '~components/Typography';
import { Avatar } from '~components/Avatar';
import { Amount } from '~components/Amount';
import { IconButton } from '~components/Button/IconButton';
import { Divider } from '~components/Divider';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="InfoGroup"
      componentDescription="InfoGroup is a structured component for displaying key-value pairs in a consistent, organized format. It provides a standardized way to present information such as transaction details, user data, or any related data pairs with proper visual hierarchy and alignment."
      figmaURL=""
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue, UserIcon } from '@razorpay/blade/components';
        
        function App() {
          return (
            <InfoGroup itemOrientation="horizontal" size="medium">
              <InfoItem>
                <InfoItemKey leading={UserIcon} helpText="Customer information">
                  Account Holder
                </InfoItemKey>
                <InfoItemValue>Saurabh Daware</InfoItemValue>
              </InfoItem>
            </InfoGroup>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/InfoGroup',
  component: InfoGroup,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  args: {
    maxWidth: '600px',
    width: '500px',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<InfoGroupProps>;

const InfoGroupTemplate: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <Box display="inline-block" flexShrink={0} backgroundColor="surface.background.gray.intense">
      <InfoGroup {...args}>
        <InfoItem>
          <InfoItemKey>Account Holder</InfoItemKey>
          <InfoItemValue>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey>Payment Method</InfoItemKey>
          <InfoItemValue>Credit Card</InfoItemValue>
        </InfoItem>
      </InfoGroup>
    </Box>
  );
};

export const InfoGroupDefault = InfoGroupTemplate.bind({});
InfoGroupDefault.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  textAlign: 'left',
};
InfoGroupDefault.storyName = 'Default';

export const WithIcons: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey leading={UserIcon} helpText="Customer information">
          Account Holder
        </InfoItemKey>
        <InfoItemValue trailing={CheckIcon}>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
        <InfoItemValue trailing={CopyIcon}>
          <Code size="small">pay_MK7DGqwYXEwx9Q</Code>
        </InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithIcons.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
};
WithIcons.storyName = 'With Icons';

export const VerticalOrientation: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey leading={UserIcon} helpText="Primary account holder name">
          Account Holder
        </InfoItemKey>
        <InfoItemValue leading={CheckIcon}>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Payment Method</InfoItemKey>
        <InfoItemValue>Credit Card</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
VerticalOrientation.args = {
  itemOrientation: 'vertical',
  size: 'large',
};
VerticalOrientation.storyName = 'Vertical Orientation';

export const WithComplexValues: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey leading={BankIcon} helpText="Bank account details">
          Bank Account
        </InfoItemKey>
        <InfoItemValue>
          <BaseBox display="flex" alignItems="center" gap="spacing.2">
            <Amount size="small" currency="INR" value={7890} />
            <Badge size="small" color="positive">
              Verified
            </Badge>
            <IconButton
              icon={ExternalLinkIcon}
              size="small"
              accessibilityLabel="View details"
              onClick={() => console.log('View details clicked')}
            />
          </BaseBox>
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>IFSC Code</InfoItemKey>
        <InfoItemValue trailing={CopyIcon}>
          <Code size="small">HDFC0001234</Code>
        </InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithComplexValues.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  textAlign: 'right',
};
WithComplexValues.storyName = 'With Complex Values';

export const WithAvatars: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey
          leading={<Avatar size="medium" name="Saurabh Daware" />}
          helpText="Account holder profile"
        >
          Account Holder
        </InfoItemKey>
        <InfoItemValue trailing={ExternalLinkIcon}>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Bank Account</InfoItemKey>
        <InfoItemValue
          leading={
            <Badge size="small" color="positive">
              Verified
            </Badge>
          }
        >
          HDFC Bank
        </InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithAvatars.args = {
  itemOrientation: 'horizontal',
  size: 'large',
};
WithAvatars.storyName = 'With Avatars';

export const WithDividers: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey>Account Holder</InfoItemKey>
        <InfoItemValue>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <Divider />
      <InfoItem>
        <InfoItemKey>Payment Method</InfoItemKey>
        <InfoItemValue>Credit Card</InfoItemValue>
      </InfoItem>
      <Divider />
      <InfoItem>
        <InfoItemKey>Payment ID</InfoItemKey>
        <InfoItemValue>
          <Code size="small">pay_MK7DGqwYXEwx9Q</Code>
        </InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithDividers.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
};
WithDividers.storyName = 'With Dividers';
