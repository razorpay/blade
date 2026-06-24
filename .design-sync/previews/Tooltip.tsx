import React from 'react';
import { Tooltip, TooltipInteractiveWrapper, Button, Link, IconButton } from '@razorpay/blade/components';
import { InfoIcon, BankIcon } from '@razorpay/blade/components';

export const Default = () => (
  <Tooltip content="Amount reversed to customer bank account" placement="bottom">
    <Button>View Refund</Button>
  </Tooltip>
);

export const WithTitle = () => (
  <Tooltip
    title="Refund successful"
    content="Amount reversed to customer bank account"
    placement="bottom"
  >
    <Button>View Details</Button>
  </Tooltip>
);

export const WithButton = () => (
  <Tooltip content="Click to view transaction details" placement="top">
    <Button>Transaction #12345</Button>
  </Tooltip>
);

export const WithLink = () => (
  <Tooltip content="Learn more about settlements" placement="top">
    <Link href="#">Settlement Schedule</Link>
  </Tooltip>
);

export const WithIconButton = () => (
  <Tooltip content="View bank account details" placement="top">
    <IconButton
      icon={BankIcon}
      accessibilityLabel="Bank details"
      onClick={() => console.log('clicked')}
    />
  </Tooltip>
);

export const WithNonInteractiveIcon = () => (
  <Tooltip content="Additional information about refunds" placement="bottom">
    <TooltipInteractiveWrapper>
      <InfoIcon size="medium" />
    </TooltipInteractiveWrapper>
  </Tooltip>
);
