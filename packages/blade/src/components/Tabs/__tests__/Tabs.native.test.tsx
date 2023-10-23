import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Tabs, TabList, TabItem, TabPanel } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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

  it('should render with size', () => {
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

  it.only('should switch tabs', async () => {
    const onChangeFn = jest.fn();
    const { debug, getByText, getByTestId } = renderWithTheme(
      <Box height="100%">
        <Tabs onChange={(value) => onChangeFn(value)}>
          <TabList>
            <TabItem testID="payments" value="payments">
              Payments Tab
            </TabItem>
            <TabItem testID="refunds" value="refunds">
              Refunds Tab
            </TabItem>
          </TabList>

          <TabPanel value="payments">
            <Text>Payments Panel</Text>
          </TabPanel>
          <TabPanel value="refunds">
            <Text>Refunds Panel</Text>
          </TabPanel>
        </Tabs>
      </Box>,
    );

    // Assert initial state
    expect(getByTestId('payments')).toHaveAccessibilityState({
      selected: true,
    });
    expect(getByText('Payments Panel')).toBeVisible();

    // Click on the second tab
    fireEvent.press(getByTestId('refunds'));

    expect(onChangeFn).toHaveBeenCalledWith('refunds');
  });
});
