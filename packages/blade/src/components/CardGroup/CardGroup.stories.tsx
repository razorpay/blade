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
import { Text } from '~components/Typography';
import { CreditCardIcon, SmartphoneIcon, BankIcon } from '~components/Icons';
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

const PlaygroundTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args}>
        <CardGroupItem
          href="/cards"
          leading={<CreditCardIcon size="medium" color="surface.icon.gray.subtle" />}
        >
          <Text>Cards</Text>
        </CardGroupItem>

        <CardGroupCollapsibleItem defaultIsExpanded>
          <CardGroupItem
            leading={<SmartphoneIcon size="medium" color="surface.icon.gray.subtle" />}
          >
            <Text>UPI</Text>
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Text>Google Pay</Text>
              <Text>PhonePe</Text>
              <Text>PayTM</Text>
              <Text>CRED UPI</Text>
            </Box>
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupCollapsibleItem>
          <CardGroupItem>
            <Text>Pay Later</Text>
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <Text>Simpl, LazyPay, ICICI PayLater</Text>
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupItem
          href="/wallet"
          leading={<BankIcon size="medium" color="surface.icon.gray.subtle" />}
        >
          <Text>Wallet</Text>
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const Playground = PlaygroundTemplate.bind({});

const SelectionTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  const [selected, setSelected] = React.useState('cards');
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args} accessibilityLabel="Choose a plan">
        <CardGroupItem isSelected={selected === 'cards'} onClick={() => setSelected('cards')}>
          <Text>Cards</Text>
        </CardGroupItem>
        <CardGroupItem isSelected={selected === 'upi'} onClick={() => setSelected('upi')}>
          <Text>UPI</Text>
        </CardGroupItem>
        <CardGroupItem isSelected={selected === 'wallet'} onClick={() => setSelected('wallet')}>
          <Text>Wallet</Text>
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const Selection = SelectionTemplate.bind({});

const NavigationTemplate: StoryFn<typeof CardGroupComponent> = (args) => {
  return (
    <Box maxWidth="400px">
      <CardGroupComponent {...args} accessibilityLabel="Settings">
        <CardGroupItem href="/profile">
          <Text>Profile</Text>
        </CardGroupItem>
        <CardGroupItem href="/security">
          <Text>Security</Text>
        </CardGroupItem>
        <CardGroupItem isDisabled onClick={() => {}}>
          <Text>Notifications (unavailable)</Text>
        </CardGroupItem>
      </CardGroupComponent>
    </Box>
  );
};

export const Navigation = NavigationTemplate.bind({});
