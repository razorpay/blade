import React from 'react';
import { Box, Text } from '@razorpay/blade/components';

export const Default = () => (
  <Box padding="spacing.5" backgroundColor="surface.background.gray.intense">
    <Text>A basic container box with padding and background</Text>
  </Box>
);

export const FlexRow = () => (
  <Box display="flex" flexDirection="row" gap="spacing.4">
    <Box flex="1" backgroundColor="surface.background.primary.intense" padding="spacing.5">
      <Text color="surface.text.staticWhite.normal">Payment Methods</Text>
    </Box>
    <Box flex="1" backgroundColor="surface.background.cloud.intense" padding="spacing.5">
      <Text color="surface.text.onCloud.onIntense">Settlement Info</Text>
    </Box>
  </Box>
);

export const FlexColumn = () => (
  <Box display="flex" flexDirection="column" gap="spacing.3">
    <Box backgroundColor="surface.background.gray.moderate" padding="spacing.4">
      <Text>Transaction ID: #TXN123456</Text>
    </Box>
    <Box backgroundColor="surface.background.gray.moderate" padding="spacing.4">
      <Text>Amount: ₹1,250.00</Text>
    </Box>
    <Box backgroundColor="surface.background.gray.moderate" padding="spacing.4">
      <Text>Status: Captured</Text>
    </Box>
  </Box>
);

export const WithElevation = () => (
  <Box
    padding="spacing.6"
    backgroundColor="surface.background.gray.intense"
    elevation="midRaised"
    borderRadius="medium"
  >
    <Text>Elevated card container with rounded corners</Text>
  </Box>
);

export const CenteredContent = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="200px"
    backgroundColor="surface.background.gray.moderate"
  >
    <Text>Centered content</Text>
  </Box>
);

export const SpacingPattern = () => (
  <Box padding="spacing.7">
    <Box marginBottom="spacing.5">
      <Text weight="semibold">Order Summary</Text>
    </Box>
    <Box marginBottom="spacing.3">
      <Text>Items: ₹2,500</Text>
    </Box>
    <Box marginBottom="spacing.3">
      <Text>Taxes: ₹450</Text>
    </Box>
    <Box marginTop="spacing.5">
      <Text weight="semibold">Total: ₹2,950</Text>
    </Box>
  </Box>
);
