import React from 'react';
import { Popover, PopoverInteractiveWrapper, Button, Box, Text, Amount, Divider, Checkbox } from '@razorpay/blade/components';
import { SettlementsIcon, InfoIcon } from '@razorpay/blade/components';

const SettlementBreakup = () => (
  <Box>
    <Box
      display="flex"
      gap="spacing.3"
      padding="spacing.3"
      flexDirection="column"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
      borderWidth="thin"
      borderColor="surface.border.gray.subtle"
    >
      <Box display="flex" justifyContent="space-between" gap="spacing.5">
        <Text size="medium">Gross Settlements</Text>
        <Amount size="medium" value={5000} />
      </Box>
      <Box display="flex" justifyContent="space-between" gap="spacing.5">
        <Text size="medium">Deductions</Text>
        <Amount color="feedback.text.negative.intense" size="medium" value={250} />
      </Box>
      <Divider variant="subtle" />
      <Box display="flex" justifyContent="space-between" gap="spacing.5">
        <Text weight="semibold" size="medium">
          Net Settlements
        </Text>
        <Amount size="medium" weight="semibold" value={4750} />
      </Box>
    </Box>
  </Box>
);

const FooterContent = () => (
  <Box
    display="flex"
    flexDirection="row"
    gap="spacing.5"
    alignItems="center"
    justifyContent="space-between"
  >
    <Checkbox size="medium">Settle with refunds</Checkbox>
    <Button size="small" variant="tertiary">
      Settle amount
    </Button>
  </Box>
);

export const Default = () => (
  <Popover
    title="Settlement breakup"
    content={<SettlementBreakup />}
    footer={<FooterContent />}
    titleLeading={<SettlementsIcon color="interactive.icon.gray.normal" size="medium" />}
  >
    <Button>View Settlement</Button>
  </Popover>
);

export const WithTitle = () => (
  <Popover
    title="Transaction Details"
    content={
      <Box padding="spacing.3">
        <Text>Transaction ID: TXN12345678</Text>
        <Text>Status: Completed</Text>
        <Text>Date: 15 Jan 2025</Text>
      </Box>
    }
  >
    <Button>Transaction Info</Button>
  </Popover>
);

export const WithIcon = () => (
  <Popover
    title="Help"
    content={
      <Text>Click here to learn more about settlements and how they work.</Text>
    }
    titleLeading={<InfoIcon color="interactive.icon.gray.normal" size="medium" />}
  >
    <Button>Need Help?</Button>
  </Popover>
);

export const WithNonInteractiveIcon = () => (
  <Popover
    content={
      <Box padding="spacing.2">
        <Text>This feature is available for premium merchants only.</Text>
      </Box>
    }
  >
    <PopoverInteractiveWrapper>
      <InfoIcon size="medium" />
    </PopoverInteractiveWrapper>
  </Popover>
);
