import React from 'react';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '@razorpay/blade/components';
import { UserIcon, BankIcon, CheckIcon } from '@razorpay/blade/components';

export const Default = () => (
  <InfoGroup>
    <InfoItem>
      <InfoItemKey>Account Holder</InfoItemKey>
      <InfoItemValue>Saurabh Daware</InfoItemValue>
    </InfoItem>
  </InfoGroup>
);

export const WithIcon = () => (
  <InfoGroup>
    <InfoItem>
      <InfoItemKey leading={UserIcon}>Customer Name</InfoItemKey>
      <InfoItemValue>John Doe</InfoItemValue>
    </InfoItem>
    <InfoItem>
      <InfoItemKey leading={BankIcon}>Bank Account</InfoItemKey>
      <InfoItemValue>**** **** 1234</InfoItemValue>
    </InfoItem>
  </InfoGroup>
);

export const WithHelpText = () => (
  <InfoGroup>
    <InfoItem>
      <InfoItemKey leading={UserIcon} helpText="Primary account holder information">
        Account Holder
      </InfoItemKey>
      <InfoItemValue helpText="Verified customer" trailing={CheckIcon}>
        Saurabh Daware
      </InfoItemValue>
    </InfoItem>
  </InfoGroup>
);

export const HorizontalOrientation = () => (
  <InfoGroup itemOrientation="horizontal" size="medium">
    <InfoItem>
      <InfoItemKey>Payment Method</InfoItemKey>
      <InfoItemValue>Credit Card</InfoItemValue>
    </InfoItem>
    <InfoItem>
      <InfoItemKey>Transaction Amount</InfoItemKey>
      <InfoItemValue>₹1,234.56</InfoItemValue>
    </InfoItem>
  </InfoGroup>
);
