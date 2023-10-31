import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Tabs, TabList, TabItem, TabPanel } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Text } from '~components/Typography';

describe('Tabs', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(
      <Tabs>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments Panel</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds Panel</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with filled variant', () => {
    const { toJSON } = renderWithTheme(
      <Tabs variant="filled">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments Panel</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds Panel</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with isFullWidthTabItem', () => {
    const { toJSON } = renderWithTheme(
      <Tabs isFullWidthTabItem>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments Panel</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds Panel</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with large size', () => {
    const { toJSON } = renderWithTheme(
      <Tabs size="large">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments Panel</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds Panel</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  // Skipping because there is some testability issues with react-native-tabview
  // https://github.com/react-navigation/react-navigation/issues/11493#issuecomment-1777846110
  it.skip('should switch tabs', () => {
    const onChangeFn = jest.fn();
    const { toJSON, getByText, getByRole } = renderWithTheme(
      <Tabs onChange={(value) => onChangeFn(value)}>
        <TabList>
          <TabItem value="payments">Payments Tab</TabItem>
          <TabItem
            onClick={() => {
              console.log('pressed');
            }}
            value="refunds"
          >
            Refunds Tab
          </TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments Panel</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds Panel</Text>
        </TabPanel>
      </Tabs>,
    );

    // Assert initial state
    expect(getByRole('tab', { name: 'Payments Tab' })).toHaveAccessibilityState({
      selected: true,
    });
    expect(getByText('Payments Panel')).toBeVisible();

    // Click on the second tab
    fireEvent.press(getByRole('tab', { name: 'Refunds Tab' }));

    expect(toJSON()).toMatchSnapshot();

    expect(onChangeFn).toHaveBeenCalledWith('refunds');
  });

  // TODO: Add more test once testability issues are resolved
});
