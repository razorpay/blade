import React from 'react';
import { TextInput } from '@razorpay/blade/components';
import { InfoIcon, BankIcon, GlobeIcon } from '@razorpay/blade/components';

export const Default = () => (
  <TextInput
    label="Full Name"
    placeholder="Enter your first and last name"
    name="fullName"
  />
);

export const WithHelpText = () => (
  <TextInput
    label="Email Address"
    placeholder="Enter your email"
    name="email"
    helpText="We'll never share your email with anyone else"
  />
);

export const WithIcon = () => (
  <TextInput
    label="Bank Account"
    placeholder="Enter account number"
    name="accountNumber"
    icon={BankIcon}
  />
);

export const WithPrefix = () => (
  <TextInput
    label="Website"
    placeholder="example.com"
    name="website"
    prefix="https://"
  />
);

export const WithSuffix = () => (
  <TextInput
    label="Amount"
    placeholder="0.00"
    name="amount"
    suffix="INR"
    textAlign="right"
  />
);

export const Required = () => (
  <TextInput
    label="Account Holder Name"
    placeholder="Enter name"
    name="accountHolder"
    isRequired
    necessityIndicator="required"
  />
);

export const ErrorState = () => (
  <TextInput
    label="Email"
    placeholder="Enter email"
    name="email"
    validationState="error"
    errorText="Please enter a valid email address"
    defaultValue="invalid-email"
  />
);

export const SuccessState = () => (
  <TextInput
    label="Username"
    placeholder="Enter username"
    name="username"
    validationState="success"
    successText="This username is available"
    defaultValue="john_doe_123"
  />
);

export const Disabled = () => (
  <TextInput
    label="Account ID"
    placeholder="Read only"
    name="accountId"
    defaultValue="ACC-123456789"
    isDisabled
  />
);

export const Sizes = () => (
  <>
    <TextInput
      label="Small Size"
      placeholder="Small input"
      name="small"
      size="small"
    />
    <TextInput
      label="Medium Size"
      placeholder="Medium input"
      name="medium"
      size="medium"
    />
    <TextInput
      label="Large Size"
      placeholder="Large input"
      name="large"
      size="large"
    />
  </>
);
