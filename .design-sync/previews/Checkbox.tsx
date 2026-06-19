import React from 'react';
import { Checkbox } from '@razorpay/blade/components';

export const Default = () => (
  <Checkbox>I agree to Terms and Conditions</Checkbox>
);

export const Checked = () => (
  <Checkbox isChecked>Enable automatic settlements</Checkbox>
);

export const WithHelpText = () => (
  <Checkbox helpText="You can change this later in settings">
    Send email notifications for transactions
  </Checkbox>
);

export const ErrorState = () => (
  <Checkbox
    validationState="error"
    errorText="You must accept terms to continue"
  >
    I accept the merchant agreement
  </Checkbox>
);

export const Disabled = () => (
  <Checkbox isDisabled>Enable test mode</Checkbox>
);

export const Indeterminate = () => (
  <Checkbox isIndeterminate>Select payment methods</Checkbox>
);

export const Sizes = () => (
  <>
    <Checkbox size="small">Small: Enable two-factor authentication</Checkbox>
    <Checkbox size="medium">Medium: Enable two-factor authentication</Checkbox>
    <Checkbox size="large">Large: Enable two-factor authentication</Checkbox>
  </>
);
