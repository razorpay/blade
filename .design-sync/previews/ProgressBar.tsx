import React from 'react';
import { ProgressBar } from '@razorpay/blade/components';

export const Default = () => (
  <ProgressBar label="Uploading document" value={30} />
);

export const QuarterProgress = () => (
  <ProgressBar label="Processing payment" value={25} />
);

export const HalfProgress = () => (
  <ProgressBar label="Verifying KYC details" value={50} />
);

export const ThreeQuarterProgress = () => (
  <ProgressBar label="Setting up account" value={75} />
);

export const Complete = () => (
  <ProgressBar label="Transfer complete" value={100} />
);

export const Circular = () => (
  <ProgressBar label="Analyzing transactions" value={60} variant="circular" size="large" />
);

export const SmallSize = () => (
  <ProgressBar label="Loading" value={40} size="small" />
);

export const MediumSize = () => (
  <ProgressBar label="Processing" value={65} size="medium" />
);

export const PositiveColor = () => (
  <ProgressBar label="Account activation" value={80} color="positive" />
);

export const NoticeColor = () => (
  <ProgressBar label="Balance: ₹5,000" value={50} color="notice" type="meter" />
);

export const Indeterminate = () => (
  <ProgressBar label="Checking status" isIndeterminate />
);
