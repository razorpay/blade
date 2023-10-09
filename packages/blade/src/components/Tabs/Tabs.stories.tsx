/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TabsProps } from './types';
import { Tabs, TabsItem, TabsList, TabsPanel } from './';
import { Text } from '~components/Typography';
import { TrendingUpIcon } from '~components/Icons';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta<TabsProps>;

const TabsTemplate: ComponentStory<typeof Tabs> = () => {
  return (
    <Box>
      <Tabs defaultValue="refunds" onChange={(v) => console.log(v)}>
        <TabsList>
          <TabsItem leading={<TrendingUpIcon />} trailing={<Counter value={12} />} value="payments">
            Payments
          </TabsItem>
          <TabsItem value="refunds">Refunds</TabsItem>
          <TabsItem value="disputes">Disputes</TabsItem>
          <TabsItem value="settlements">Settlements</TabsItem>
        </TabsList>

        <TabsPanel value="payments">
          <Text>Payments</Text>
        </TabsPanel>
        <TabsPanel value="refunds">
          <Text>Refunds</Text>
        </TabsPanel>
        <TabsPanel value="disputes">
          <Text>Disputes</Text>
        </TabsPanel>
        <TabsPanel value="settlements">
          <Text>Settlements</Text>
        </TabsPanel>
      </Tabs>
      <br />
      <br />
      <br />
      <Tabs variant="filled" defaultValue="refunds" onChange={(v) => console.log(v)}>
        <TabsList>
          <TabsItem value="payments">Payments</TabsItem>
          <TabsItem value="refunds">Refunds</TabsItem>
          <TabsItem value="disputes">Disputes</TabsItem>
        </TabsList>

        <TabsPanel value="payments">
          <Text>Payments</Text>
        </TabsPanel>
        <TabsPanel value="refunds">
          <Text>Refunds</Text>
        </TabsPanel>
        <TabsPanel value="disputes">
          <Text>Disputes</Text>
        </TabsPanel>
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
        <TabsList>
          <TabsItem leading={<TrendingUpIcon />} trailing={<Counter value={12} />} value="payments">
            Payments
          </TabsItem>
          <TabsItem value="refunds">Refunds</TabsItem>
          <TabsItem value="disputes">Disputes</TabsItem>
          <TabsItem value="settlements">Settlements</TabsItem>
        </TabsList>

        <TabsPanel value="payments">
          <Box padding="spacing.0">
            <Text>Payments</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="refunds">
          <Box padding="spacing.0">
            <Text>Refunds</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="disputes">
          <Box padding="spacing.0">
            <Text>Disputes</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="settlements">
          <Box padding="spacing.0">
            <Text>Settlements</Text>
          </Box>
        </TabsPanel>
      </Tabs>
      <br />
      <br />
      <br />

      <Tabs
        variant="filled"
        orientation="vertical"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
        <TabsList>
          <TabsItem leading={<TrendingUpIcon />} trailing={<Counter value={12} />} value="payments">
            Payments
          </TabsItem>
          <TabsItem value="refunds">Refunds</TabsItem>
          <TabsItem value="disputes">Disputes</TabsItem>
          <TabsItem value="settlements">Settlements</TabsItem>
        </TabsList>

        <TabsPanel value="payments">
          <Box padding="spacing.0">
            <Text>Payments</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="refunds">
          <Box padding="spacing.0">
            <Text>Refunds</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="disputes">
          <Box padding="spacing.0">
            <Text>Disputes</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="settlements">
          <Box padding="spacing.0">
            <Text>Settlements</Text>
          </Box>
        </TabsPanel>
      </Tabs>

      <br />
      <br />
      <br />

      <Tabs
        variant="filled"
        orientation="horizontal"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
        <TabsList>
          <TabsItem leading={<TrendingUpIcon />} trailing={<Counter value={12} />} value="payments">
            Payments
          </TabsItem>
          <TabsItem value="refunds">Refunds</TabsItem>
          <TabsItem value="disputes">Disputes</TabsItem>
          <TabsItem value="settlements">Settlements</TabsItem>
        </TabsList>

        <TabsPanel value="payments">
          <Box padding="spacing.0">
            <Text>Payments</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="refunds">
          <Box padding="spacing.0">
            <Text>Refunds</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="disputes">
          <Box padding="spacing.0">
            <Text>Disputes</Text>
          </Box>
        </TabsPanel>
        <TabsPanel value="settlements">
          <Box padding="spacing.0">
            <Text>Settlements</Text>
          </Box>
        </TabsPanel>
      </Tabs>
    </Box>
  );
};

export const Vertical = TabsVerticalTemplate.bind({});
Vertical.storyName = 'Vertical';
