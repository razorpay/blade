import React from 'react';
import { Divider, Box, Text, Heading } from '@razorpay/blade/components';

export const Horizontal = () => (
  <Box>
    <Heading size="medium">Payment Gateway</Heading>
    <Divider />
    <Text marginTop="spacing.3">
      Accept payments online with our easy-to-integrate payment gateway solution.
    </Text>
  </Box>
);

export const Vertical = () => (
  <Box display="flex" flexDirection="row" alignItems="center" height="80px">
    <Box flex="1" display="flex" justifyContent="center">
      <Text>Domestic Payments</Text>
    </Box>
    <Divider orientation="vertical" />
    <Box flex="1" display="flex" justifyContent="center">
      <Text>International Payments</Text>
    </Box>
  </Box>
);

export const SectionSeparator = () => (
  <Box>
    <Box marginBottom="spacing.4">
      <Text weight="semibold">Account Details</Text>
      <Text marginTop="spacing.2">Business Name: Acme Corporation</Text>
      <Text>Account ID: ACC_12345</Text>
    </Box>
    <Divider />
    <Box marginTop="spacing.4">
      <Text weight="semibold">Settlement Information</Text>
      <Text marginTop="spacing.2">Bank: HDFC Bank</Text>
      <Text>Account: XXXX1234</Text>
    </Box>
  </Box>
);

export const ThreeColumnLayout = () => (
  <Box display="flex" flexDirection="row" gap="spacing.4">
    <Box flex="1">
      <Text weight="semibold">Payment Links</Text>
      <Text marginTop="spacing.2">Share links via email, SMS, or messenger</Text>
    </Box>
    <Divider orientation="vertical" />
    <Box flex="1">
      <Text weight="semibold">Payment Pages</Text>
      <Text marginTop="spacing.2">Create custom-branded online stores</Text>
    </Box>
    <Divider orientation="vertical" />
    <Box flex="1">
      <Text weight="semibold">Payment Button</Text>
      <Text marginTop="spacing.2">Add payment buttons to your website</Text>
    </Box>
  </Box>
);

export const ListSeparator = () => (
  <Box>
    <Text>Transaction #1234 - ₹500.00</Text>
    <Divider />
    <Text>Transaction #1235 - ₹1,250.00</Text>
    <Divider />
    <Text>Transaction #1236 - ₹750.00</Text>
  </Box>
);
