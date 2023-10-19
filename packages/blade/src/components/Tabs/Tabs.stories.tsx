/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TabsProps } from './types';
import { Tabs, TabItem, TabList, TabPanel } from './';
import { Text } from '~components/Typography';
import { RupeeIcon, TrendingUpIcon } from '~components/Icons';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Card, CardBody } from '~components/Card';
import { Divider } from '~components/Divider';
import { Alert } from '~components/Alert';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [(Story) => <Story />],
} as Meta<TabsProps>;

const TabsTemplate: ComponentStory<typeof Tabs> = () => {
  return (
    <Box height="100%">
      <Tabs variant="bordered" isFullWidthTabItem={false}>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
        <TabPanel value="disputes">
          <Text>Disputes</Text>
        </TabPanel>
      </Tabs>
    </Box>
  );
};

export const Default = TabsTemplate.bind({});
Default.storyName = 'Default';

const TabsVerticalTemplate: ComponentStory<typeof Tabs> = () => {
  return (
    <Box>
      <Tabs
        variant="bordered"
        orientation="vertical"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
        <TabList>
          <TabItem leading={<TrendingUpIcon />} trailing={<Counter value={12} />} value="payments">
            Payments
          </TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
          <TabItem value="settlements">Settlements</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Box padding="spacing.0">
            <Text>Payments</Text>
          </Box>
        </TabPanel>
        <TabPanel value="refunds">
          <Box padding="spacing.0">
            <Text>Refunds</Text>
          </Box>
        </TabPanel>
        <TabPanel value="disputes">
          <Box padding="spacing.0">
            <Text>Disputes</Text>
          </Box>
        </TabPanel>
        <TabPanel value="settlements">
          <Box padding="spacing.0">
            <Text>Settlements</Text>
          </Box>
        </TabPanel>
      </Tabs>
      <Box marginTop="spacing.4" />

      <Tabs
        variant="filled"
        orientation="vertical"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
        <TabList>
          <TabItem leading={<TrendingUpIcon />} trailing={<Counter value={12} />} value="payments">
            Payments
          </TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
          <TabItem value="settlements">Settlements</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Box padding="spacing.0">
            <Text>Payments</Text>
          </Box>
        </TabPanel>
        <TabPanel value="refunds">
          <Box padding="spacing.0">
            <Text>Refunds</Text>
          </Box>
        </TabPanel>
        <TabPanel value="disputes">
          <Box padding="spacing.0">
            <Text>Disputes</Text>
          </Box>
        </TabPanel>
        <TabPanel value="settlements">
          <Box padding="spacing.0">
            <Text>Settlements</Text>
          </Box>
        </TabPanel>
      </Tabs>

      <Box marginTop="spacing.4" />

      <Tabs
        variant="filled"
        orientation="horizontal"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
        <TabList>
          <TabItem
            onClick={() => {
              alert(1);
            }}
            href="/hello"
            leading={<TrendingUpIcon />}
            trailing={<Counter value={12} />}
            value="payments"
          >
            Payments
          </TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
          <TabItem value="settlements">Settlements</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Box padding="spacing.0">
            <Text>Payments</Text>
          </Box>
        </TabPanel>
        <TabPanel value="refunds">
          <Box padding="spacing.0">
            <Text>Refunds</Text>
          </Box>
        </TabPanel>
        <TabPanel value="disputes">
          <Box padding="spacing.0">
            <Text>Disputes</Text>
          </Box>
        </TabPanel>
        <TabPanel value="settlements">
          <Box padding="spacing.0">
            <Text>Settlements</Text>
          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
};

export const Vertical = TabsVerticalTemplate.bind({});
Vertical.storyName = 'Vertical';
