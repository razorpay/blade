import React from 'react';
import { Button } from '@razorpay/blade/components';
import { CreditCardIcon, ArrowRightIcon, UserIcon } from '@razorpay/blade/components';

export const Primary = () => (
  <Button variant="primary">Pay Now</Button>
);

export const Secondary = () => (
  <Button variant="secondary">Cancel</Button>
);

export const Tertiary = () => (
  <Button variant="tertiary">Learn More</Button>
);

export const WithIcon = () => (
  <Button variant="primary" icon={CreditCardIcon}>
    Add Payment Method
  </Button>
);

export const IconRight = () => (
  <Button variant="primary" icon={ArrowRightIcon} iconPosition="right">
    Continue
  </Button>
);

export const Sizes = () => (
  <>
    <Button variant="primary" size="xsmall">Extra Small</Button>
    <Button variant="primary" size="small">Small</Button>
    <Button variant="primary" size="medium">Medium</Button>
    <Button variant="primary" size="large">Large</Button>
  </>
);

export const Disabled = () => (
  <Button variant="primary" isDisabled>
    Disabled Button
  </Button>
);

export const FullWidth = () => (
  <Button variant="primary" isFullWidth>
    Full Width Button
  </Button>
);

export const Colors = () => (
  <>
    <Button variant="primary" color="primary">Primary Color</Button>
    <Button variant="primary" color="positive">Positive Color</Button>
    <Button variant="primary" color="negative">Negative Color</Button>
  </>
);

export const Loading = () => (
  <Button variant="primary" isLoading>
    Processing...
  </Button>
);
