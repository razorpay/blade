import React from 'react';
import { TextArea } from '@razorpay/blade/components';

export const Default = () => (
  <TextArea
    label="Description"
    placeholder="Enter description"
    name="description"
  />
);

export const WithHelpText = () => (
  <TextArea
    label="Transaction Notes"
    placeholder="Add notes about this transaction"
    helpText="These notes will be visible to your team"
    name="notes"
  />
);

export const ErrorState = () => (
  <TextArea
    label="Refund Reason"
    defaultValue="Product was defective"
    validationState="error"
    errorText="Reason must be at least 50 characters"
    name="refundReason"
  />
);

export const SuccessState = () => (
  <TextArea
    label="Business Description"
    defaultValue="We are a fintech company providing payment solutions to businesses across India. Our platform helps merchants accept payments seamlessly."
    validationState="success"
    successText="Description meets minimum requirements"
    name="businessDescription"
  />
);

export const Disabled = () => (
  <TextArea
    label="Account Summary"
    defaultValue="This account has been verified and approved for transactions"
    isDisabled
    name="accountSummary"
  />
);

export const Sizes = () => (
  <>
    <TextArea
      label="Medium Size"
      placeholder="Enter details"
      size="medium"
      name="medium"
    />
    <TextArea
      label="Large Size"
      placeholder="Enter details"
      size="large"
      name="large"
    />
  </>
);

export const MaxCharacters = () => (
  <TextArea
    label="GST Remarks"
    placeholder="Enter GST-related remarks"
    maxCharacters={200}
    helpText="Maximum 200 characters allowed"
    name="gstRemarks"
  />
);

export const Required = () => (
  <TextArea
    label="Payment Description"
    placeholder="Describe the payment purpose"
    necessityIndicator="required"
    name="paymentDescription"
  />
);
