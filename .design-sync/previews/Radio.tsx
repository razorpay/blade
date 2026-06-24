import React from 'react';
import { RadioGroup, Radio } from '@razorpay/blade/components';

export const Default = () => (
  <RadioGroup label="Payment Method" name="paymentMethod">
    <Radio value="card">Credit/Debit Card</Radio>
    <Radio value="upi">UPI</Radio>
    <Radio value="netbanking">Net Banking</Radio>
  </RadioGroup>
);

export const WithHelpText = () => (
  <RadioGroup
    label="Settlement Frequency"
    helpText="Choose how often you want to receive settlements"
    name="settlementFrequency"
  >
    <Radio value="daily">Daily</Radio>
    <Radio value="weekly">Weekly</Radio>
    <Radio value="monthly">Monthly</Radio>
  </RadioGroup>
);

export const ErrorState = () => (
  <RadioGroup
    label="Account Type"
    validationState="error"
    errorText="Please select an account type"
    name="accountType"
  >
    <Radio value="current">Current Account</Radio>
    <Radio value="savings">Savings Account</Radio>
  </RadioGroup>
);

export const Disabled = () => (
  <RadioGroup label="KYC Status" isDisabled name="kycStatus">
    <Radio value="pending">Pending Verification</Radio>
    <Radio value="verified">Verified</Radio>
    <Radio value="rejected">Rejected</Radio>
  </RadioGroup>
);

export const Required = () => (
  <RadioGroup
    label="Business Category"
    necessityIndicator="required"
    name="businessCategory"
  >
    <Radio value="ecommerce">E-commerce</Radio>
    <Radio value="saas">SaaS</Radio>
    <Radio value="retail">Retail</Radio>
  </RadioGroup>
);

export const Sizes = () => (
  <>
    <RadioGroup label="Small Size" size="small" name="paymentMethodSmall">
      <Radio value="card">Card</Radio>
      <Radio value="upi">UPI</Radio>
    </RadioGroup>
    <RadioGroup label="Medium Size" size="medium" name="paymentMethodMedium">
      <Radio value="card">Card</Radio>
      <Radio value="upi">UPI</Radio>
    </RadioGroup>
    <RadioGroup label="Large Size" size="large" name="paymentMethodLarge">
      <Radio value="card">Card</Radio>
      <Radio value="upi">UPI</Radio>
    </RadioGroup>
  </>
);
