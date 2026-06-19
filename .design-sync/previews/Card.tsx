import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
  Text,
  Heading,
} from '@razorpay/blade/components';
import { CheckCircleIcon, UsersIcon } from '@razorpay/blade/components';

export const Default = () => (
  <Card>
    <CardHeader>
      <CardHeaderLeading title="Payment Links" subtitle="Share payment links with customers" />
    </CardHeader>
    <CardBody>
      <Text>
        Create Razorpay Payment Links and share them via email, SMS, or messenger to start
        accepting payments instantly.
      </Text>
    </CardBody>
    <CardFooter>
      <CardFooterLeading title="Quick Setup" subtitle="Ready in 5 minutes" />
      <CardFooterTrailing
        actions={{
          primary: {
            text: 'Get Started',
            onClick: () => console.log('Primary clicked'),
          },
          secondary: {
            text: 'Learn More',
            onClick: () => console.log('Secondary clicked'),
          },
        }}
      />
    </CardFooter>
  </Card>
);

export const WithIcon = () => (
  <Card>
    <CardHeader>
      <CardHeaderLeading
        title="Account Verified"
        subtitle="Your KYC is complete"
        prefix={<CardHeaderIcon icon={CheckCircleIcon} />}
      />
      <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
    </CardHeader>
    <CardBody>
      <Text>
        Your account has been successfully verified. You can now accept payments up to ₹10,00,000
        per transaction.
      </Text>
    </CardBody>
  </Card>
);

export const WithCounter = () => (
  <Card>
    <CardHeader>
      <CardHeaderLeading
        title="Team Members"
        subtitle="Active users in your organization"
        prefix={<CardHeaderIcon icon={UsersIcon} />}
        suffix={<CardHeaderCounter value={12} />}
      />
    </CardHeader>
    <CardBody>
      <Text>
        Manage team permissions and roles. Add or remove members to control access to your
        Razorpay dashboard.
      </Text>
    </CardBody>
  </Card>
);

export const Elevated = () => (
  <Card elevation="highRaised">
    <CardBody>
      <Heading size="large">Settlement Reports</Heading>
      <Text marginTop="spacing.3">
        View detailed breakdowns of your settlements, transactions, and fees. Download reports for
        accounting and reconciliation.
      </Text>
    </CardBody>
  </Card>
);

export const WithFooterActions = () => (
  <Card>
    <CardHeader>
      <CardHeaderLeading
        title="Complete Profile"
        subtitle="Add business details to unlock features"
      />
    </CardHeader>
    <CardBody>
      <Text>
        Complete your business profile to access payment gateway, subscriptions, and international
        payments.
      </Text>
    </CardBody>
    <CardFooter>
      <CardFooterLeading subtitle="3 of 5 steps completed" />
      <CardFooterTrailing
        actions={{
          primary: {
            text: 'Continue Setup',
            onClick: () => console.log('Continue'),
          },
        }}
      />
    </CardFooter>
  </Card>
);
