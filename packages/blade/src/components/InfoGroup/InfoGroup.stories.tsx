import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { InfoGroupProps } from './types';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from './InfoGroup';
import {
  UserIcon,
  BankIcon,
  CheckIcon,
  CopyIcon,
  InfoIcon,
  EditIcon,
  CloseIcon,
} from '~components/Icons';
import { Code } from '~components/Typography';
import { Avatar } from '~components/Avatar';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Link } from '~components/Link';
import { Badge } from '~components/Badge';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { Amount } from '~components/Amount';
import { Button } from '~components/Button';
import { TextInput } from '~components/Input/TextInput';
import { Box } from '~components/Box';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~components/Modal';
import { Collapsible, CollapsibleBody, CollapsibleLink } from '~components/Collapsible';
import { Card, CardHeader, CardBody, CardHeaderLeading } from '~components/Card';
import { Divider } from '~components/Divider';

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
  args: {},
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<InfoGroupProps>;

const InfoGroupTemplate: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey>Account Holder</InfoItemKey>
        <InfoItemValue>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Payment Method</InfoItemKey>
        <InfoItemValue>Credit Card</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Transaction Amount</InfoItemKey>
        <InfoItemValue>
          <Amount
            weight="semibold"
            color="surface.text.gray.subtle"
            value={123456}
            size={args.size}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Transaction Date</InfoItemKey>
        <InfoItemValue>Dec 15, 2023</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Status</InfoItemKey>
        <InfoItemValue>Completed</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};

export const InfoGroupDefault = InfoGroupTemplate.bind({});
InfoGroupDefault.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  keyAlign: 'left',
  valueAlign: 'left',
};
InfoGroupDefault.storyName = 'Default';

const codeSizeMap = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
} as const;

const badgeSizeMap = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

const inputSizeMap = {
  xsmall: 'medium',
  small: 'medium',
  medium: 'medium',
  large: 'large',
} as const;

export const WithIcons: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey leading={UserIcon} helpText="Customer information">
          Account Holder
        </InfoItemKey>
        <InfoItemValue helpText="Name of the account holder" trailing={CheckIcon}>
          Saurabh Daware
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
        <InfoItemValue trailing={<Link icon={CopyIcon} variant="button" size={args.size} />}>
          <Code size={codeSizeMap[args.size!]}>pay_MK7DGqwYXEwx9Q</Code>
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Transaction Amount</InfoItemKey>
        <InfoItemValue>
          <Amount
            weight="semibold"
            color="surface.text.gray.subtle"
            value={250000}
            size={args.size}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey
          leading={UserIcon}
          trailing={
            <Tooltip content="Name of the Approved Merchant" placement="top">
              <TooltipInteractiveWrapper display="flex" alignItems="center">
                <InfoIcon size={args.size} color="surface.icon.gray.muted" />
              </TooltipInteractiveWrapper>
            </Tooltip>
          }
        >
          Merchant Name
        </InfoItemKey>
        <InfoItemValue
          trailing={
            <Badge color="positive" size={badgeSizeMap[args.size!]}>
              Approved
            </Badge>
          }
        >
          Razorpay Software Pvt Ltd
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Reference Number</InfoItemKey>
        <InfoItemValue trailing={<Link icon={CopyIcon} variant="button" size={args.size} />}>
          <Code size={codeSizeMap[args.size!]}>ref_ABC123XYZ789</Code>
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={CheckIcon}>Transaction Status</InfoItemKey>
        <InfoItemValue>Success</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithIcons.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  maxWidth: { base: '100%', m: '700px' },
};
WithIcons.storyName = 'With Icons';

export const WithAvatars: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey
          leading={<Avatar size={args.size} name="Saurabh Daware" />}
          helpText="Customer information"
        >
          Account Holder
        </InfoItemKey>
        <InfoItemValue trailing={CheckIcon}>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={<Avatar size={args.size} name="Bank Account" />}>
          Payment ID
        </InfoItemKey>
        <InfoItemValue trailing={<Link icon={CopyIcon} variant="button" size={args.size} />}>
          <Code size={codeSizeMap[args.size!]}>pay_MK7DGqwYXEwx9Q</Code>
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={<Avatar size={args.size} name="Customer Support" />}>
          Support Agent
        </InfoItemKey>
        <InfoItemValue>John Doe</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={<Avatar size={args.size} name="Transaction Manager" />}>
          Processed By
        </InfoItemKey>
        <InfoItemValue trailing={CheckIcon}>Jane Smith</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={<Avatar size={args.size} name="Business Account" />}>
          Business Name
        </InfoItemKey>
        <InfoItemValue>Tech Solutions Inc.</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={<Avatar size={args.size} name="Payment Gateway" />}>
          Gateway Response
        </InfoItemKey>
        <InfoItemValue trailing={<Link icon={CopyIcon} variant="button" size={args.size} />}>
          <Code size={codeSizeMap[args.size!]}>gw_resp_SUCCESS_001</Code>
        </InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithAvatars.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
};
WithAvatars.storyName = 'With Avatars';

export const WithVerticalItemOrientation: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey leading={UserIcon}>Account Holder</InfoItemKey>
        <InfoItemValue trailing={CheckIcon}>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
        <InfoItemValue trailing={<Link icon={CopyIcon} variant="button" size={args.size} />}>
          <Code size={codeSizeMap[args.size!]}>pay_MK7DGqwYXEwx9Q</Code>
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Transaction Amount</InfoItemKey>
        <InfoItemValue>
          <Amount
            weight="semibold"
            color="surface.text.gray.subtle"
            value={575025}
            size={args.size}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={UserIcon}>Customer Email</InfoItemKey>
        <InfoItemValue>saurabh.daware@example.com</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={CheckIcon}>Payment Status</InfoItemKey>
        <InfoItemValue trailing={CheckIcon}>Authorized</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={BankIcon}>Settlement Date</InfoItemKey>
        <InfoItemValue>Dec 16, 2023</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey leading={UserIcon}>Currency</InfoItemKey>
        <InfoItemValue>INR</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};
WithVerticalItemOrientation.args = {
  itemOrientation: 'vertical',
  size: 'medium',
  isHighlighted: true,
  gridTemplateColumns: 'repeat(3, 1fr)',
};
WithVerticalItemOrientation.storyName = 'With Vertical Item Orientation';

export const WithInteractiveItems: StoryFn<typeof InfoGroup> = (args) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [accountHolder, setAccountHolder] = React.useState('Saurabh Daware');
  const [tempValue, setTempValue] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  const handleEdit = (): void => {
    setTempValue(accountHolder);
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setAccountHolder(tempValue);
    setTempValue('');
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setTempValue('');
    setIsEditing(false);
  };

  const handleEmailEdit = (): void => {
    setNewEmail('saurabh.daware@example.com');
    setIsEmailModalOpen(true);
  };

  const handleEmailModalClose = (): void => {
    setIsEmailModalOpen(false);
    setNewEmail('');
  };

  const handleSendForApproval = (): void => {
    // Here you would typically send the email change request to your backend
    console.log('Sending email change request for:', newEmail);
    setIsEmailModalOpen(false);
    setNewEmail('');
  };

  return (
    <>
      <InfoGroup {...args}>
        <InfoItem>
          <InfoItemKey leading={UserIcon} helpText="Click to edit customer information">
            Account Holder
          </InfoItemKey>
          <InfoItemValue
            trailing={
              isEditing ? undefined : (
                <Link icon={EditIcon} variant="button" size={args.size} onClick={handleEdit} />
              )
            }
          >
            {isEditing ? (
              <Box display="flex" alignItems="center" gap="spacing.3">
                <TextInput
                  label=""
                  value={tempValue}
                  onChange={({ name: _name, value }) => setTempValue(value || '')}
                  size={inputSizeMap[args.size!]}
                  placeholder="Enter account holder name"
                />
                <Button
                  icon={CheckIcon}
                  variant="primary"
                  size={inputSizeMap[args.size!]}
                  onClick={handleSave}
                />
                <Button
                  icon={CloseIcon}
                  variant="tertiary"
                  size={inputSizeMap[args.size!]}
                  onClick={handleCancel}
                />
              </Box>
            ) : (
              accountHolder
            )}
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
          <InfoItemValue
            trailing={
              <Tooltip content={copied ? 'Copied' : 'Copy Payment ID'} placement="top">
                <TooltipInteractiveWrapper display="flex" alignItems="center">
                  <Link
                    icon={copied ? CheckIcon : CopyIcon}
                    color={copied ? 'positive' : 'primary'}
                    onClick={() => {
                      void navigator.clipboard.writeText('pay_MK7DGqwYXEwx9Q');
                      setCopied(true);
                    }}
                    variant="button"
                    size={args.size}
                  />
                </TooltipInteractiveWrapper>
              </Tooltip>
            }
          >
            <Code size={codeSizeMap[args.size!]}>pay_MK7DGqwYXEwx9Q</Code>
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Transaction Amount</InfoItemKey>
          <InfoItemValue>
            <Amount
              weight="semibold"
              color="surface.text.gray.subtle"
              value={250000}
              size={args.size}
            />
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={UserIcon}>Email Address</InfoItemKey>
          <InfoItemValue
            trailing={
              <Link icon={EditIcon} variant="button" size={args.size} onClick={handleEmailEdit} />
            }
          >
            saurabh.daware@example.com
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={CheckIcon}>Payment Status</InfoItemKey>
          <InfoItemValue
            trailing={
              <Badge color="positive" size={badgeSizeMap[args.size!]}>
                Success
              </Badge>
            }
          >
            Completed
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Transaction Date</InfoItemKey>
          <InfoItemValue>Dec 15, 2023</InfoItemValue>
        </InfoItem>
      </InfoGroup>

      <Modal
        isOpen={isEmailModalOpen}
        onDismiss={handleEmailModalClose}
        size="small"
        accessibilityLabel="Edit Email Address"
      >
        <ModalHeader title="Edit Email Address" />
        <ModalBody>
          <TextInput
            label="New Email Address"
            value={newEmail}
            onChange={({ name: _name, value }) => setNewEmail(value || '')}
            placeholder="Enter new email address"
            type="email"
          />
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end">
            <Button variant="tertiary" onClick={handleEmailModalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendForApproval} isDisabled={!newEmail.trim()}>
              Send for Approval
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};
WithInteractiveItems.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  maxWidth: { base: '100%', m: '700px' },
};
WithInteractiveItems.storyName = 'With Interactive Items';

const InfoGroupTemplateWithTruncate: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey truncateAfterLines={1}>Key that truncates</InfoItemKey>
        <InfoItemValue truncateAfterLines={1}>Value that truncates</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Key that wraps to next line</InfoItemKey>
        <InfoItemValue>Value that wraps to next line</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};

// Story from InfoGroupTemplate with different width. use InfoGroupTemplate.bind()
export const InfoGroupWithTruncation = InfoGroupTemplateWithTruncate.bind({});
InfoGroupWithTruncation.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  maxWidth: '100px',
  gridTemplateColumns: '1fr 1fr',
};
InfoGroupWithTruncation.storyName = 'With Truncation';

export const InfoGroupWithCollapsible: StoryFn<typeof InfoGroup> = (args) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <InfoGroup {...args}>
        <InfoItem>
          <InfoItemKey leading={UserIcon}>Account Holder</InfoItemKey>
          <InfoItemValue trailing={CheckIcon}>Saurabh Daware</InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemKey leading={BankIcon}>Payment ID</InfoItemKey>
          <InfoItemValue trailing={<Link icon={CopyIcon} variant="button" size={args.size} />}>
            <Code size={codeSizeMap[args.size!]}>pay_MK7DGqwYXEwx9Q</Code>
          </InfoItemValue>
        </InfoItem>
      </InfoGroup>

      <Collapsible
        direction="top"
        marginTop="spacing.4"
        onExpandChange={({ isExpanded: _isExpanded }) => setIsExpanded(_isExpanded)}
      >
        <CollapsibleLink>{isExpanded ? 'Hide Details' : 'Show More'}</CollapsibleLink>
        <CollapsibleBody>
          <InfoGroup {...args}>
            <InfoItem>
              <InfoItemKey leading={UserIcon}>Customer Email</InfoItemKey>
              <InfoItemValue>saurabh.daware@example.com</InfoItemValue>
            </InfoItem>
            <InfoItem>
              <InfoItemKey leading={CheckIcon}>Payment Status</InfoItemKey>
              <InfoItemValue
                trailing={
                  <Badge color="positive" size={badgeSizeMap[args.size!]}>
                    Success
                  </Badge>
                }
              >
                Completed
              </InfoItemValue>
            </InfoItem>
            <InfoItem>
              <InfoItemKey leading={BankIcon}>Settlement Date</InfoItemKey>
              <InfoItemValue>Dec 16, 2023</InfoItemValue>
            </InfoItem>
            <InfoItem>
              <InfoItemKey leading={UserIcon}>Currency</InfoItemKey>
              <InfoItemValue>INR</InfoItemValue>
            </InfoItem>
          </InfoGroup>
        </CollapsibleBody>
      </Collapsible>
    </>
  );
};
InfoGroupWithCollapsible.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  gridTemplateColumns: '1fr 1fr',
  width: '500px',
};
InfoGroupWithCollapsible.storyName = 'With Collapsible';

const WithDividerTemplate: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <InfoGroup {...args}>
      <InfoItem>
        <InfoItemKey>Account Holder</InfoItemKey>
        <InfoItemValue>Saurabh Daware</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Payment Method</InfoItemKey>
        <InfoItemValue>Credit Card</InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Transaction Amount</InfoItemKey>
        <InfoItemValue>
          <Amount
            weight="semibold"
            color="surface.text.gray.subtle"
            value={123456}
            size={args.size}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemKey>Transaction Date</InfoItemKey>
        <InfoItemValue>Dec 15, 2023</InfoItemValue>
      </InfoItem>
      <Divider gridColumn="span 2" />
      <InfoItem>
        <InfoItemKey>Status</InfoItemKey>
        <InfoItemValue>Completed</InfoItemValue>
      </InfoItem>
    </InfoGroup>
  );
};

export const WithDivider = WithDividerTemplate.bind({});
WithDivider.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  valueAlign: 'right',
  maxWidth: { base: '100%', m: '400px' },
};
// with different alignments
export const WithHorizontalItemAlignments: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Card elevation="none" maxWidth={args.maxWidth}>
        <CardHeader>
          <CardHeaderLeading title="With keyAlign: left and valueAlign: left" />
        </CardHeader>
        <CardBody>
          <WithDivider {...args} keyAlign="left" valueAlign="left" />
        </CardBody>
      </Card>

      <Card elevation="none" maxWidth={args.maxWidth}>
        <CardHeader>
          <CardHeaderLeading title="With keyAlign: left and valueAlign: right" />
        </CardHeader>
        <CardBody>
          <WithDivider {...args} keyAlign="left" valueAlign="right" />
        </CardBody>
      </Card>

      <Card elevation="none" maxWidth={args.maxWidth}>
        <CardHeader>
          <CardHeaderLeading title="With keyAlign: right and valueAlign: right" />
        </CardHeader>
        <CardBody>
          <WithDivider {...args} keyAlign="right" valueAlign="right" />
        </CardBody>
      </Card>
    </Box>
  );
};
WithHorizontalItemAlignments.args = {
  itemOrientation: 'horizontal',
  size: 'medium',
  maxWidth: '500px',
};
WithHorizontalItemAlignments.storyName = 'With Horizontal Item Alignments';

// With Vertical Item Alignments
export const WithVerticalItemAlignments: StoryFn<typeof InfoGroup> = (args) => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Card elevation="none" maxWidth={args.maxWidth}>
        <CardHeader>
          <CardHeaderLeading title="With gridTemplateColumns: repeat(3, 1fr)" />
        </CardHeader>
        <CardBody>
          <InfoGroupDefault {...args} gridTemplateColumns="repeat(3, 1fr)" />
        </CardBody>
      </Card>

      <Card elevation="none" maxWidth={args.maxWidth}>
        <CardHeader>
          <CardHeaderLeading title="With gridTemplateColumns: repeat(4, 1fr)" />
        </CardHeader>
        <CardBody>
          <InfoGroupDefault {...args} gridTemplateColumns="repeat(4, 1fr)" />
        </CardBody>
      </Card>

      <Card elevation="none" maxWidth={args.maxWidth}>
        <CardHeader>
          <CardHeaderLeading title="With gridTemplateColumns: 1fr" />
        </CardHeader>
        <CardBody>
          <InfoGroupDefault {...args} gridTemplateColumns="1fr" />
        </CardBody>
      </Card>
    </Box>
  );
};
WithVerticalItemAlignments.args = {
  itemOrientation: 'vertical',
  size: 'medium',
  isHighlighted: true,
};
WithVerticalItemAlignments.storyName = 'With Vertical Item Alignments';
