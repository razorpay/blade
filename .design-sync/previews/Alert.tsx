import React from 'react';
import { Alert } from '@razorpay/blade/components';

export const Information = () => (
  <Alert
    color="information"
    title="International Payments"
    description="Currently you can only accept payments in international currencies using PayPal. You cannot accept payments in INR (₹) using PayPal."
  />
);

export const Notice = () => (
  <Alert
    color="notice"
    title="Maintenance Scheduled"
    description="Our systems will be under maintenance from 2 AM to 4 AM IST. During this time, some services may be unavailable."
  />
);

export const Positive = () => (
  <Alert
    color="positive"
    title="Payment Successful"
    description="Your payment of ₹1,234.56 has been processed successfully. The funds will be credited to your account within 2-3 business days."
  />
);

export const Negative = () => (
  <Alert
    color="negative"
    title="Payment Failed"
    description="We couldn't process your payment. Please check your payment details and try again."
  />
);

export const WithActions = () => (
  <Alert
    color="information"
    title="Complete Your KYC"
    description="Your account verification is pending. Please complete your KYC to continue using all features."
    actions={{
      primary: {
        text: "Complete KYC",
        onClick: () => console.log("Primary action"),
      },
      secondary: {
        text: "Learn More",
        href: "https://razorpay.com/docs",
        target: "_blank",
      },
    }}
  />
);

export const Dismissible = () => (
  <Alert
    color="information"
    title="New Feature Available"
    description="Check out our new dashboard analytics feature to get better insights into your transactions."
    isDismissible
    onDismiss={() => console.log("Alert dismissed")}
  />
);

export const HighEmphasis = () => (
  <Alert
    color="notice"
    emphasis="intense"
    title="Action Required"
    description="Your API key is about to expire in 7 days. Please generate a new key to avoid service interruption."
  />
);

export const SubtleEmphasis = () => (
  <Alert
    color="information"
    emphasis="subtle"
    title="Tip"
    description="You can use keyboard shortcuts to navigate faster. Press '?' to see all available shortcuts."
  />
);

export const FullWidth = () => (
  <Alert
    color="positive"
    title="Welcome to Razorpay"
    description="Your account has been successfully created. You can now start accepting payments."
    isFullWidth
  />
);

export const WithoutActions = () => (
  <Alert
    color="information"
    title="System Update"
    description="A new system update has been applied. No action required from your side."
    isDismissible={false}
  />
);
