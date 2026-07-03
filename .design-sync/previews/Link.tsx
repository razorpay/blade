import React from 'react';
import { Link } from '@razorpay/blade/components';
import { ExternalLinkIcon, DownloadIcon } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

export const Default = () => (
  <Link href="https://razorpay.com/docs" target="_blank" rel="noopener noreferrer">
    View Documentation
  </Link>
);

export const WithIcon = () => (
  <Link
    href="https://razorpay.com/support"
    target="_blank"
    rel="noopener noreferrer"
    icon={ExternalLinkIcon}
  >
    Contact Support
  </Link>
);

export const Button = () => (
  <Link variant="button" onClick={() => console.log('clicked')}>
    Reset Password
  </Link>
);

export const Sizes = () => (
  <Box display="flex" flexDirection="column" gap="spacing.2">
    <Link href="#" size="small">
      Privacy Policy
    </Link>
    <Link href="#" size="medium">
      Terms of Service
    </Link>
    <Link href="#" size="large">
      Developer API
    </Link>
  </Box>
);

export const Colors = () => (
  <Box display="flex" flexDirection="column" gap="spacing.2">
    <Link href="#" color="primary">
      Primary Link
    </Link>
    <Link href="#" color="neutral">
      Neutral Link
    </Link>
    <Link href="#" color="positive">
      Success Guide
    </Link>
  </Box>
);

export const Download = () => (
  <Link
    href="/reports/monthly-report.pdf"
    icon={DownloadIcon}
    iconPosition="left"
  >
    Download Report
  </Link>
);
