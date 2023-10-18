/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TabsProps } from './types';
import { Tabs, TabItem, TabList, TabPanel } from './';
import { Text } from '~components/Typography';
import { TrendingUpIcon } from '~components/Icons';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Card, CardBody } from '~components/Card';
import { Divider } from '~components/Divider';
import { Alert } from '~components/Alert';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta<TabsProps>;

const TabsTemplate: ComponentStory<typeof Tabs> = () => {
  return (
    <Box>
      <Card elevation="none" padding="spacing.0">
        <CardBody>
          <Box paddingY="spacing.0">
            <Tabs variant="borderless" defaultValue="payments" onChange={(v) => console.log(v)}>
              <Box
                paddingX="spacing.6"
                alignItems="center"
                display="flex"
                justifyContent="space-between"
              >
                <TabList>
                  <TabItem
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
                <Box>
                  <Button size="small">Subscribe</Button>
                </Box>
              </Box>
              <Divider />

              <Box paddingX="spacing.6">
                <TabPanel value="payments">
                  <Text marginY="spacing.5">
                    This is an overview of your active subscriptions. You can click on each
                    subscription to view more details.
                  </Text>
                  <Box
                    flexDirection={{ base: 'column', m: 'row' }}
                    display="flex"
                    width="100%"
                    gap="spacing.4"
                    marginY="spacing.6"
                  >
                    <Alert
                      title="1 - Active Subscriptions"
                      description="You have 1 active subscription. Active subscriptions are subscriptions that are currently being charged."
                      intent="positive"
                      isDismissible={false}
                    />
                    <Alert
                      title="1 - Failed Subscriptions"
                      description="You have 1 failed subscription. Failed subscriptions are subscriptions that have failed to charge the customer."
                      intent="negative"
                      isDismissible={false}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value="refunds">
                  <Text>Refunds</Text>
                </TabPanel>
                <TabPanel value="disputes">
                  <Text>Disputes</Text>
                </TabPanel>
                <TabPanel value="settlements">
                  <Text>Settlements</Text>
                </TabPanel>
              </Box>
            </Tabs>
          </Box>
        </CardBody>
      </Card>
      <br />
      <br />
      <br />
      <Tabs variant="bordered" orientation="horizontal">
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
      <br />
      <br />
      <br />
      <Tabs
        variant="bordered"
        orientation="vertical"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
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
      <br />
      <br />
      <br />
      <Tabs
        variant="filled"
        orientation="vertical"
        defaultValue="refunds"
        onChange={(v) => console.log(v)}
      >
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
      <br />
      <br />
      <br />

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

      <br />
      <br />
      <br />

      <Tabs
        variant="filled"
        orientation="horizontal"
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
    </Box>
  );
};

export const Vertical = TabsVerticalTemplate.bind({});
Vertical.storyName = 'Vertical';
