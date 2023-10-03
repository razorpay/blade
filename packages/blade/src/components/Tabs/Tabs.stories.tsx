/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TabsProps } from './types';
import { Tabs, TabsItem, TabsList, TabsPanel } from './';
import { Text } from '~components/Typography';
import { TrendingUpIcon } from '~components/Icons';
import { Counter } from '~components/Counter';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta<TabsProps>;

const TabsTemplate: ComponentStory<typeof Tabs> = () => {
  return (
    <Tabs onChange={(v) => console.log(v)}>
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
  );
};

export const Default = TabsTemplate.bind({});
Default.storyName = 'Default';
