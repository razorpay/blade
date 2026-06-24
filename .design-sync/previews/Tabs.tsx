import React from 'react';
import { Tabs, TabList, TabItem, TabPanel } from '@razorpay/blade/components';
import { SettingsIcon, ClipboardIcon, SubscriptionsIcon } from '@razorpay/blade/components';
import { Text, Box } from '@razorpay/blade/components';

export const Default = () => (
  <Tabs variant="bordered">
    <TabList>
      <TabItem value="subscriptions">Subscriptions</TabItem>
      <TabItem value="plans">Plans</TabItem>
      <TabItem value="settings">Settings</TabItem>
    </TabList>
    <TabPanel value="subscriptions">
      <Box paddingTop="spacing.4">
        <Text>Manage your active and expired subscriptions</Text>
      </Box>
    </TabPanel>
    <TabPanel value="plans">
      <Box paddingTop="spacing.4">
        <Text>View and create billing plans</Text>
      </Box>
    </TabPanel>
    <TabPanel value="settings">
      <Box paddingTop="spacing.4">
        <Text>Configure payment method preferences</Text>
      </Box>
    </TabPanel>
  </Tabs>
);

export const WithIcons = () => (
  <Tabs variant="borderless">
    <TabList>
      <TabItem value="subscriptions" leading={SubscriptionsIcon}>
        Subscriptions
      </TabItem>
      <TabItem value="plans" leading={ClipboardIcon}>
        Plans
      </TabItem>
      <TabItem value="settings" leading={SettingsIcon}>
        Settings
      </TabItem>
    </TabList>
    <TabPanel value="subscriptions">
      <Box paddingTop="spacing.4">
        <Text>Manage your active and expired subscriptions</Text>
      </Box>
    </TabPanel>
    <TabPanel value="plans">
      <Box paddingTop="spacing.4">
        <Text>View and create billing plans</Text>
      </Box>
    </TabPanel>
    <TabPanel value="settings">
      <Box paddingTop="spacing.4">
        <Text>Configure payment method preferences</Text>
      </Box>
    </TabPanel>
  </Tabs>
);

export const Filled = () => (
  <Tabs variant="filled">
    <TabList>
      <TabItem value="payments">Payments</TabItem>
      <TabItem value="refunds">Refunds</TabItem>
      <TabItem value="settlements">Settlements</TabItem>
    </TabList>
    <TabPanel value="payments">
      <Box paddingTop="spacing.4">
        <Text>View all payment transactions</Text>
      </Box>
    </TabPanel>
    <TabPanel value="refunds">
      <Box paddingTop="spacing.4">
        <Text>Track refund requests and status</Text>
      </Box>
    </TabPanel>
    <TabPanel value="settlements">
      <Box paddingTop="spacing.4">
        <Text>Monitor settlement reports</Text>
      </Box>
    </TabPanel>
  </Tabs>
);

export const Small = () => (
  <Tabs variant="bordered" size="small">
    <TabList>
      <TabItem value="overview">Overview</TabItem>
      <TabItem value="analytics">Analytics</TabItem>
      <TabItem value="reports">Reports</TabItem>
    </TabList>
    <TabPanel value="overview">
      <Box paddingTop="spacing.4">
        <Text size="small">Dashboard overview and key metrics</Text>
      </Box>
    </TabPanel>
    <TabPanel value="analytics">
      <Box paddingTop="spacing.4">
        <Text size="small">Detailed analytics and insights</Text>
      </Box>
    </TabPanel>
    <TabPanel value="reports">
      <Box paddingTop="spacing.4">
        <Text size="small">Generate and download reports</Text>
      </Box>
    </TabPanel>
  </Tabs>
);

export const Vertical = () => (
  <Tabs variant="filled" orientation="vertical">
    <TabList>
      <TabItem value="profile">Profile</TabItem>
      <TabItem value="security">Security</TabItem>
      <TabItem value="notifications">Notifications</TabItem>
    </TabList>
    <TabPanel value="profile">
      <Box marginLeft="spacing.4">
        <Text>Manage your profile information</Text>
      </Box>
    </TabPanel>
    <TabPanel value="security">
      <Box marginLeft="spacing.4">
        <Text>Update password and security settings</Text>
      </Box>
    </TabPanel>
    <TabPanel value="notifications">
      <Box marginLeft="spacing.4">
        <Text>Configure notification preferences</Text>
      </Box>
    </TabPanel>
  </Tabs>
);
