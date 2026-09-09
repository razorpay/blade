import type { Meta, StoryFn } from '@storybook/react-vite';
import React from 'react';
import type { TicketCardProps } from './TicketCard';
import { TicketCard, TicketCardBody, TicketCardFooter } from './TicketCard';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const disableControl = { table: { disable: true } };

const meta: Meta<TicketCardProps> = {
  title: 'Components/Card/TicketCard',
  component: TicketCard,
  tags: ['autodocs'],
  args: {
    isSelected: false,
    isDisabled: false,
    width: '280px',
    size: 'large',
  },
  argTypes: {
    children: disableControl,
    onClick: disableControl,
    onHover: disableControl,
    testID: disableControl,
    isSelected: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    width: {
      control: { type: 'text' },
    },
    size: {
      control: { type: 'radio' },
      options: ['large', 'medium'],
    },
    href: {
      control: { type: 'text' },
    },
    accessibilityLabel: {
      control: { type: 'text' },
    },
    ...getStyledPropsArgTypes(),
  },
};

export default meta;

const getTicketCardChildren = (label: string): React.ReactElement[] => [
  <TicketCardBody key="body">
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="semibold">Razorpay Summit 2026</Text>
      <Text size="small" color="surface.text.gray.subtle">
        {label}
      </Text>
    </Box>
  </TicketCardBody>,
  <TicketCardFooter key="footer">
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
      <Box display="flex" flexDirection="column">
        <Text size="small" color="surface.text.gray.subtle">
          Seat
        </Text>
        <Text weight="semibold">A-24</Text>
      </Box>
      <Amount value={4999} type="body" weight="semibold" />
    </Box>
  </TicketCardFooter>,
];

const PlaygroundTemplate: StoryFn<TicketCardProps> = (args) => (
  <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle">
    <TicketCard {...args}>{getTicketCardChildren('General Admission')}</TicketCard>
  </Box>
);

export const Playground = PlaygroundTemplate.bind({});

const StatesTemplate = (): React.ReactElement => (
  <Box
    display="flex"
    flexDirection="row"
    gap="spacing.7"
    flexWrap="wrap"
    padding="spacing.8"
    backgroundColor="surface.background.gray.subtle"
  >
    <TicketCard width="280px">{getTicketCardChildren('Default')}</TicketCard>
    <TicketCard width="280px" isSelected>
      {getTicketCardChildren('Selected')}
    </TicketCard>
    <TicketCard width="280px" isDisabled>
      {getTicketCardChildren('Disabled')}
    </TicketCard>
  </Box>
);

export const States = StatesTemplate.bind({});
States.parameters = {
  controls: {
    disable: true,
  },
};
