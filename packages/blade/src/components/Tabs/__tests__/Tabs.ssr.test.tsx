import React from 'react';
import { Tabs, TabList, TabItem, TabPanel } from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Text } from '~components/Typography';

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

describe('<Tabs />', () => {
  it.skip('should render tabs ssr', () => {
    const { container, queryAllByRole } = renderWithSSR(
      <Tabs defaultValue="refunds">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );
    expect(queryAllByRole('tab').length).toBe(2);
    expect(container).toMatchSnapshot();
  });
});
