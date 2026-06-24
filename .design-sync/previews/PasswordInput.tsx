import React from 'react';
import { PasswordInput } from '@razorpay/blade/components';

export const Default = () => (
  <PasswordInput
    label="Password"
    placeholder="Enter your password"
    name="password"
  />
);

export const WithHelpText = () => (
  <PasswordInput
    label="New Password"
    placeholder="Create a strong password"
    name="newPassword"
    helpText="We recommend having at least 8 characters in your password"
  />
);

export const ErrorState = () => (
  <PasswordInput
    label="Password"
    placeholder="Enter password"
    name="password"
    validationState="error"
    errorText="Password must be at least 8 characters long"
    defaultValue="weak"
  />
);

export const SuccessState = () => (
  <PasswordInput
    label="Password"
    placeholder="Enter password"
    name="password"
    validationState="success"
    successText="Password meets all requirements"
    defaultValue="StrongPassword123!"
  />
);

export const Disabled = () => (
  <PasswordInput
    label="Password"
    placeholder="Enter password"
    name="password"
    defaultValue="My_Strong#Password!"
    isDisabled
  />
);

export const Sizes = () => (
  <>
    <PasswordInput
      label="Medium Size"
      placeholder="Medium size password input"
      size="medium"
      name="passwordMedium"
    />
    <PasswordInput
      label="Large Size"
      placeholder="Large size password input"
      size="large"
      name="passwordLarge"
    />
  </>
);
