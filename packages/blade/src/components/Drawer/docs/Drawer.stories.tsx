import React from 'react';
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { DrawerProps } from '../';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '../';
import { DrawerStackingStory } from './stories';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import {
  AnnouncementIcon,
  CheckIcon,
  ClockIcon,
  DownloadIcon,
  MoreHorizontalIcon,
} from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import {
  Card,
  CardBody,
  CardFooter,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
} from '~components/Card';
import { Amount } from '~components/Amount';
import { IconButton } from '~components/Button/IconButton';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Drawer"
      componentDescription="A drawer is a panel that slides in mostly from right side of the screen over the existing content in the viewport."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=78667-66659&t=YFTWKtgOioAyOKwG-1&scaling=min-zoom&page-id=77229%3A6461&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>{DrawerStackingStory}</Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Drawer',
  component: Drawer,
  subcomponents: { Drawer, DrawerHeader, DrawerBody, DrawerFooter },
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const DrawerTemplate: StoryFn<typeof Drawer> = (args) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer
        {...args}
        isOpen={args.isOpen ?? isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
      >
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Starters{"'"} CFP Private Limited </Heading>
            <Badge size="small" color="primary" marginLeft="spacing.3">
              Vendor
            </Badge>
          </Box>
          <Box marginTop="spacing.6" marginBottom="spacing.8">
            <TextInput label="Email" type="email" placeholder="Enter your email" />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
            />
          </Box>
          <Box>
            <Button>Payout</Button>{' '}
            <Button marginLeft="spacing.2" variant="tertiary">
              Invite Vendor
            </Button>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const SimpleDrawer = DrawerTemplate.bind({});

export const NoOverlay = DrawerTemplate.bind({});
NoOverlay.args = {
  showOverlay: false,
};

export const DrawerStacking = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSecondDrawerOpen, setIsSecondDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer {...args} isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Starters{"'"} CFP Private Limited </Heading>
            <Badge size="small" color="primary" marginLeft="spacing.3">
              Vendor
            </Badge>
          </Box>
          <Box marginTop="spacing.6" marginBottom="spacing.8">
            <TextInput label="Email" type="email" placeholder="Enter your email" />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
            />
          </Box>
          <Box>
            <Button
              onClick={() => {
                setIsSecondDrawerOpen(true);
              }}
            >
              Next Drawer
            </Button>
          </Box>
        </DrawerBody>
      </Drawer>

      <Drawer isOpen={isSecondDrawerOpen} onDismiss={() => setIsSecondDrawerOpen(false)}>
        <DrawerHeader
          leading={<AnnouncementIcon size="large" />}
          title="Announcements"
          subtitle="This is second drawer"
        />
        <DrawerBody>
          <Card
            backgroundColor="surface.background.gray.intense"
            elevation="none"
            padding="spacing.3"
          >
            <CardHeader>
              <CardHeaderLeading title="Razorpay FTX" subtitle="Check out our yearly event" />
            </CardHeader>
            <CardBody>
              <Box padding="spacing.4">
                <Text>Book Your Tickets for Razorpay FTX</Text>
              </Box>
            </CardBody>
            <CardFooter>
              <CardFooterTrailing
                actions={{
                  primary: { text: 'Book Now' },
                  secondary: { text: 'Visit Website' },
                }}
              />
            </CardFooter>
          </Card>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const InitialFocus = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const drawerInitialFocusRef = React.useRef(null);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer
        initialFocusRef={drawerInitialFocusRef}
        {...args}
        isOpen={isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
      >
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Starters{"'"} CFP Private Limited </Heading>
            <Badge size="small" color="primary" marginLeft="spacing.3">
              Vendor
            </Badge>
          </Box>
          <Box marginTop="spacing.6" marginBottom="spacing.8">
            <TextInput label="Email" type="email" placeholder="Enter your email" />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
            />
          </Box>
          <Box>
            <Button ref={drawerInitialFocusRef}>Payout</Button>{' '}
            <Button marginLeft="spacing.2" variant="tertiary">
              Invite Vendor
            </Button>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const WithCustomHeader = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer
        {...args}
        isOpen={args.isOpen ?? isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
      >
        <DrawerHeader
          color="positive"
          title="Settlements"
          trailing={
            <IconButton
              icon={MoreHorizontalIcon}
              accessibilityLabel="Options"
              onClick={() => console.log('Options Clicked')}
              size="large"
            />
          }
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={26000}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>
          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
            <Badge icon={CheckIcon} size="medium" color="positive" emphasis="intense">
              Captured
            </Badge>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="spacing.2"
            marginTop="spacing.6"
            paddingX="spacing.4"
          >
            <Text size="large" textAlign="center">
              Payment was successfully captured. To be settled in your bank account by{' '}
              <Text as="span" size="large" weight="semibold" color="feedback.text.positive.intense">
                Jan 20, 2025
              </Text>
            </Text>
          </Box>
          <Box marginTop="spacing.4" textAlign="center">
            <Text size="small" weight="medium" color="surface.text.gray.muted">
              Created on Jan 11, 2025
            </Text>
          </Box>
        </DrawerHeader>
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Starters{"'"} CFP Private Limited </Heading>
            <Badge size="small" color="primary" marginLeft="spacing.3">
              Vendor
            </Badge>
          </Box>
          <Box marginTop="spacing.6" marginBottom="spacing.8">
            <TextInput label="Email" type="email" placeholder="Enter your email" />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
            />
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Box display="flex" gap="spacing.5">
            <Button variant="tertiary" isFullWidth>
              Payout
            </Button>
            <Button variant="primary" isFullWidth>
              Invite Vendor
            </Button>
          </Box>
        </DrawerFooter>
      </Drawer>
    </Box>
  );
};

export const WithFooter = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [showFooter, setShowFooter] = React.useState(true);

  return (
    <Box>
      <Box display="flex" gap="spacing.4" marginBottom="spacing.4">
        <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
        <Button variant="secondary" onClick={() => setShowFooter(!showFooter)}>
          {showFooter ? 'Hide Footer' : 'Show Footer'}
        </Button>
      </Box>

      <Drawer
        {...args}
        isOpen={args.isOpen ?? isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
      >
        <DrawerHeader
          color="notice"
          title="Complete Payment Setup"
          subtitle="Fill out all required information"
          trailing={
            <IconButton
              icon={MoreHorizontalIcon}
              accessibilityLabel="Options"
              onClick={() => console.log('Options Clicked')}
              size="large"
            />
          }
          showDivider={false}
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={26000}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>
          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
            <Badge icon={ClockIcon} size="medium" color="notice" emphasis="intense">
              Pending Setup
            </Badge>
          </Box>
        </DrawerHeader>
        <DrawerBody>
          {/* Personal Information Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Personal Information
            </Heading>
            <Box display="flex" alignItems="center" marginBottom="spacing.6">
              <Heading>John Doe</Heading>
              <Badge size="small" color="primary" marginLeft="spacing.3">
                Individual
              </Badge>
            </Box>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              marginBottom="spacing.4"
            />
            <TextInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              marginBottom="spacing.4"
            />
            <TextInput
              label="Phone Number"
              type="telephone"
              placeholder="+1 (555) 123-4567"
              marginBottom="spacing.4"
            />
            <TextInput label="Date of Birth" placeholder="MM/DD/YYYY" marginBottom="spacing.4" />
          </Box>

          {/* Address Information Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Address Information
            </Heading>
            <TextInput
              label="Street Address"
              placeholder="123 Main Street"
              marginBottom="spacing.4"
            />
            <Box display="flex" gap="spacing.4" marginBottom="spacing.4">
              <TextInput label="City" placeholder="New York" />
              <TextInput label="State" placeholder="NY" />
              <TextInput label="ZIP Code" placeholder="10001" />
            </Box>
            <TextInput label="Country" placeholder="United States" marginBottom="spacing.4" />
          </Box>

          {/* Payment Information Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Payment Information
            </Heading>
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              marginBottom="spacing.4"
            />
            <Box display="flex" gap="spacing.4" marginBottom="spacing.4">
              <TextInput label="Expiry Date" placeholder="MM/YY" />
              <TextInput label="CVV" placeholder="123" />
            </Box>
            <TextInput label="Cardholder Name" placeholder="John Doe" marginBottom="spacing.4" />
            <TextInput
              label="Billing Address (if different)"
              placeholder="Same as above"
              marginBottom="spacing.4"
            />
          </Box>

          {/* Business Information Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Business Information
            </Heading>
            <TextInput
              label="Company Name"
              placeholder="Acme Corporation"
              marginBottom="spacing.4"
            />
            <TextInput
              label="Business Registration Number"
              placeholder="REG123456789"
              marginBottom="spacing.4"
            />
            <TextInput label="Tax ID / EIN" placeholder="12-3456789" marginBottom="spacing.4" />
            <TextInput label="Industry" placeholder="Technology" marginBottom="spacing.4" />
            <TextInput
              label="Website URL"
              placeholder="https://example.com"
              marginBottom="spacing.4"
            />
          </Box>

          {/* Banking Information Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Banking Information
            </Heading>
            <TextInput
              label="Bank Name"
              placeholder="First National Bank"
              marginBottom="spacing.4"
            />
            <TextInput label="Account Number" placeholder="1234567890" marginBottom="spacing.4" />
            <TextInput label="Routing Number" placeholder="123456789" marginBottom="spacing.4" />
            <TextInput label="Account Type" placeholder="Checking" marginBottom="spacing.4" />
            <TextInput
              label="Account Holder Name"
              placeholder="John Doe"
              marginBottom="spacing.4"
            />
          </Box>

          {/* Additional Information Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Additional Information
            </Heading>
            <TextInput
              label="Preferred Contact Method"
              placeholder="Email"
              marginBottom="spacing.4"
            />
            <TextInput
              label="Time Zone"
              placeholder="Eastern Standard Time"
              marginBottom="spacing.4"
            />
            <TextInput
              label="Monthly Transaction Volume"
              placeholder="$50,000"
              marginBottom="spacing.4"
            />
            <TextInput
              label="Expected Usage"
              placeholder="High volume payments"
              marginBottom="spacing.4"
            />
          </Box>

          {/* Terms and Conditions Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Terms & Conditions
            </Heading>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              By proceeding with this setup, you agree to our comprehensive terms of service,
              privacy policy, and payment processing agreement. Your information will be securely
              stored and processed in accordance with industry standards and regulations.
            </Text>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              Please review all information carefully before submitting. Once submitted, some
              information may require additional verification steps before changes can be made.
            </Text>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              For questions about this setup process, please contact our support team at
              support@example.com or call 1-800-123-4567 during business hours (9 AM - 6 PM EST,
              Monday through Friday).
            </Text>
          </Box>

          {/* Security Notice Section */}
          <Box marginBottom="spacing.8">
            <Heading size="medium" marginBottom="spacing.4">
              Security & Privacy
            </Heading>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              We use industry-standard 256-bit SSL encryption to protect all data transmission. Your
              payment information is tokenized and never stored in plain text on our servers.
            </Text>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              All personal and financial information is processed in compliance with PCI DSS Level 1
              standards and relevant data protection regulations including GDPR and CCPA.
            </Text>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              Regular security audits are conducted by third-party security firms to ensure the
              highest level of protection for your sensitive information.
            </Text>
          </Box>

          {/* Final Notes Section */}
          <Box marginBottom="spacing.6">
            <Heading size="medium" marginBottom="spacing.4">
              Important Notes
            </Heading>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
              • Setup typically takes 2-3 business days to complete after submission • You will
              receive email notifications at each step of the verification process • Additional
              documentation may be requested for compliance purposes • Contact support if you need
              assistance with any part of this process
            </Text>
          </Box>
        </DrawerBody>

        <DrawerFooter showFooter={showFooter}>
          <Box display="flex" gap="spacing.5">
            <Button variant="tertiary" isFullWidth onClick={() => setIsDrawerOpen(false)}>
              Cancel Setup
            </Button>
            <Button variant="primary" isFullWidth>
              Complete Setup
            </Button>
          </Box>
        </DrawerFooter>
      </Drawer>
    </Box>
  );
};
