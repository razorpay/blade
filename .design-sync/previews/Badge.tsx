import React from 'react';
import { Badge } from '@razorpay/blade/components';
import { InfoIcon } from '@razorpay/blade/components';

export const Neutral = () => (
  <Badge color="neutral">Pending</Badge>
);

export const Positive = () => (
  <Badge color="positive">Active</Badge>
);

export const Negative = () => (
  <Badge color="negative">Failed</Badge>
);

export const Notice = () => (
  <Badge color="notice">Processing</Badge>
);

export const Information = () => (
  <Badge color="information">New</Badge>
);

export const Primary = () => (
  <Badge color="primary">Featured</Badge>
);

export const WithIcon = () => (
  <Badge color="information" icon={InfoIcon}>
    Info
  </Badge>
);

export const Sizes = () => (
  <>
    <Badge color="primary" size="xsmall">Extra Small</Badge>
    <Badge color="primary" size="small">Small</Badge>
    <Badge color="primary" size="medium">Medium</Badge>
    <Badge color="primary" size="large">Large</Badge>
  </>
);

export const Emphasis = () => (
  <>
    <Badge color="positive" emphasis="subtle">Subtle</Badge>
    <Badge color="positive" emphasis="intense">Intense</Badge>
  </>
);
