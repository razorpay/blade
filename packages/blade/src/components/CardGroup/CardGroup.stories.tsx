import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import {
  CardGroup as CardGroupComponent,
  CardGroupItem,
  CardGroupCollapsibleItem,
  CardGroupCollapsibleItemBody,
} from './index';
import type { CardGroupProps } from './types';
import { Box } from '~components/Box';
import { Card, CardBody } from '~components/Card';
import { Text } from '~components/Typography';
import { TextInput } from '~components/Input/TextInput';
import {
  CreditCardIcon,
  UpiIcon,
  ClockIcon,
  WalletIcon,
  MoreHorizontalIcon,
  LockIcon,
  CircleIcon,
  CheckCircle2Icon,
} from '~components/Icons';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/CardGroup',
  component: CardGroupComponent,
  args: {
    accessibilityLabel: 'Payment methods',
  },
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'CardGroup stacks navigating, selecting and disclosing rows into a single surface.',
      },
    },
  },
} as Meta<CardGroupProps>;

type PaymentApp = { name: string; logo?: string };

// Brand logos from the checkout CDN (same source as the BladeProvider checkout demo).
const upiApps: PaymentApp[] = [
  { name: 'Google Pay', logo: 'https://cdn.razorpay.com/app/googlepay.svg' },
  { name: 'PhonePe', logo: 'https://cdn.razorpay.com/app/phonepe.svg' },
  { name: 'Paytm', logo: 'https://cdn.razorpay.com/app/paytm.svg' },
  { name: 'Apps & UPI ID' },
];

const payLaterApps: PaymentApp[] = [
  { name: 'LazyPay', logo: 'https://cdn.razorpay.com/paylater/lazypay.svg' },
  { name: 'ICICI PayLater', logo: 'https://cdn.razorpay.com/paylater/icic.svg' },
  { name: 'Amazon Pay', logo: 'https://cdn.razorpay.com/app/amazonpay.svg' },
];

const AppGrid = ({ apps }: { apps: PaymentApp[] }): React.ReactElement => (
  <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.3">
    {apps.map((app) => (
      <Card
        key={app.name}
        variant="primary"
        padding="spacing.0"
        size="medium"
        height="100%"
        accessibilityLabel={app.name}
        onClick={() => undefined}
      >
        <CardBody>
          <Box display="flex" alignItems="center" gap="spacing.3" padding="spacing.4">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="24px"
              height="24px"
              flexShrink={0}
            >
              {app.logo ? (
                <img
                  src={app.logo}
                  alt=""
                  width={24}
                  height={24}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <MoreHorizontalIcon size="medium" color="surface.icon.gray.normal" />
              )}
            </Box>
            <Text size="medium" weight="medium" truncateAfterLines={1}>
              {app.name}
            </Text>
          </Box>
        </CardBody>
      </Card>
    ))}
  </Box>
);

// Mirrors the Figma anatomy: navigating rows, a selecting row, and a disclosing
// row with a body of nested options.
const PlaygroundTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args}>
        <CardGroupItem
          href="https://razorpay.com/payments/"
          target="_blank"
          rel="noopener noreferrer"
          leading={<CreditCardIcon size="medium" color="surface.icon.gray.subtle" />}
        >
          Cards
        </CardGroupItem>

        <CardGroupCollapsibleItem defaultIsExpanded>
          <CardGroupItem leading={<UpiIcon size="medium" color="surface.icon.gray.subtle" />}>
            UPI
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <AppGrid apps={upiApps} />
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupCollapsibleItem>
          <CardGroupItem leading={<ClockIcon size="medium" color="surface.icon.gray.subtle" />}>
            Pay Later
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <AppGrid apps={payLaterApps} />
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupItem
          href="https://razorpay.com/payment-gateway/"
          target="_blank"
          rel="noopener noreferrer"
          leading={<WalletIcon size="medium" color="surface.icon.gray.subtle" />}
        >
          Wallet
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const Playground = PlaygroundTemplate.bind({});

// Navigating rows only.
const NavigationTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args} accessibilityLabel="Settings">
        <CardGroupItem href="https://razorpay.com/about/" target="_blank" rel="noopener noreferrer">
          Profile
        </CardGroupItem>
        <CardGroupItem
          href="https://razorpay.com/security/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Security
        </CardGroupItem>
        <CardGroupItem href="https://razorpay.com/docs/" target="_blank" rel="noopener noreferrer">
          Notifications
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const Navigation = NavigationTemplate.bind({});

// Selecting rows — selection is consumer-driven.
const SelectionTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  const [selected, setSelected] = React.useState('cards');
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args} accessibilityLabel="Choose a plan">
        <CardGroupItem isSelected={selected === 'cards'} onClick={() => setSelected('cards')}>
          Cards
        </CardGroupItem>
        <CardGroupItem isSelected={selected === 'upi'} onClick={() => setSelected('upi')}>
          UPI
        </CardGroupItem>
        <CardGroupItem isSelected={selected === 'wallet'} onClick={() => setSelected('wallet')}>
          Wallet
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const Selection = SelectionTemplate.bind({});

const DisabledRowTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args} accessibilityLabel="Payment methods">
        <CardGroupItem
          href="https://razorpay.com/payments/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cards
        </CardGroupItem>
        <CardGroupItem
          isDisabled
          onClick={() => undefined}
          trailing={<LockIcon size="medium" color="surface.icon.gray.disabled" />}
        >
          Net Banking (unavailable)
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const DisabledRow = DisabledRowTemplate.bind({});

const SelectionIndicator = ({ isSelected }: { isSelected: boolean }): React.ReactElement =>
  isSelected ? (
    <CheckCircle2Icon size="medium" color="surface.icon.gray.normal" />
  ) : (
    <CircleIcon size="medium" color="surface.icon.gray.muted" />
  );

// Selecting row that reveals a nested amount input when chosen.
const SelectionWithNestedInputTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  const [paymentOption, setPaymentOption] = React.useState<'full' | 'part'>('full');
  const [partAmount, setPartAmount] = React.useState('');
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args} accessibilityLabel="Payment options">
        <CardGroupItem
          isSelected={paymentOption === 'full'}
          onClick={() => setPaymentOption('full')}
          trailing={<SelectionIndicator isSelected={paymentOption === 'full'} />}
        >
          <Text size="medium" weight="semibold">
            Pay in full
          </Text>
          <Text size="small" color="surface.text.gray.muted">
            Pay ₹2,000 now
          </Text>
        </CardGroupItem>

        <CardGroupItem
          isSelected={paymentOption === 'part'}
          onClick={() => setPaymentOption('part')}
          trailing={<SelectionIndicator isSelected={paymentOption === 'part'} />}
        >
          <Text size="medium" weight="semibold">
            Part Payment
          </Text>
          <Text size="small" color="surface.text.gray.muted">
            Pay a part of the total amount
          </Text>
        </CardGroupItem>

        <CardGroupCollapsibleItem isExpanded={paymentOption === 'part'}>
          <CardGroupCollapsibleItemBody>
            <TextInput
              accessibilityLabel="Amount to pay"
              placeholder="Enter amount upto ₹2,000"
              value={partAmount}
              onChange={({ value }) => setPartAmount(value ?? '')}
            />
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>
      </CardGroupComponent>
    </Box>
  );
};

export const SelectionWithNestedInput = SelectionWithNestedInputTemplate.bind({});
