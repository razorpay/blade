import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Tabs, TabList, TabItem, TabPanel } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

describe('Tabs', () => {
  it('should render', () => {
    const { baseElement } = renderWithTheme(
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

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with vertical orientation', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" orientation="vertical">
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

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with filled variant', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" variant="filled">
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

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with autoWidth', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" autoWidth>
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

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with size', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" size="large">
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

    expect(baseElement).toMatchSnapshot();
  });

  it('should switch tabs with mouse', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <Tabs>
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
      </Tabs>,
    );

    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');

    // TODO: change this after isLazy implementation
    expect(queryByRole('tabpanel', { name: 'Payments' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();

    await user.click(getByRole('tab', { name: 'Refunds' }));
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');
    expect(queryByRole('tabpanel', { name: 'Payments' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();

    await user.click(getByRole('tab', { name: 'Disputes' }));
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(queryByRole('tabpanel', { name: 'Payments' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).toBeVisible();
  });

  it('should switch tabs with keyboard', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <Tabs>
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
      </Tabs>,
    );

    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');

    // TODO: change this after isLazy implementation
    expect(queryByRole('tabpanel', { name: 'Payments' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();

    fireEvent.keyDown(getByRole('tab', { name: 'Payments' }), { key: 'ArrowRight' });
    getByRole('tab', { name: 'Refunds' }).focus();
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('tabindex', '0');
    // JSDOM focus/events are such a mess
    // https://github.com/testing-library/react-testing-library/issues/269#issuecomment-1180073128
    // TODO: switch to e2e
    getByRole('tab', { name: 'Refunds' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');
    expect(queryByRole('tabpanel', { name: 'Payments' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();

    // Switch to Disputes
    fireEvent.keyDown(getByRole('tab', { name: 'Refunds' }), { key: 'ArrowRight' });
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('tabindex', '0');
    getByRole('tab', { name: 'Disputes' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(queryByRole('tabpanel', { name: 'Payments' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).toBeVisible();

    // Switch to Payments [loops back]
    fireEvent.keyDown(getByRole('tab', { name: 'Disputes' }), { key: 'ArrowRight' });
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('tabindex', '0');
    getByRole('tab', { name: 'Payments' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
    expect(queryByRole('tabpanel', { name: 'Payments' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();
  });

  it('should work with uncontrolled state', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <Tabs onChange={onChange}>
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
      </Tabs>,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');

    // TODO: change this after isLazy implementation
    expect(queryByRole('tabpanel', { name: 'Payments' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();

    await user.click(getByRole('tab', { name: 'Refunds' }));
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenCalledWith('refunds');

    await user.click(getByRole('tab', { name: 'Disputes' }));
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenCalledWith('disputes');
  });

  it('should work with controlled state', async () => {
    const user = userEvent.setup();
    const selectedTabTestId = 'selected-tab-text';
    const ControlledTabExample = (): React.ReactElement => {
      const [value, setValue] = React.useState('refunds');
      return (
        <Box>
          <Text testID={selectedTabTestId}>{value}</Text>
          <Button
            onClick={() => {
              setValue('payments');
            }}
          >
            Change to Payments
          </Button>
          <Tabs
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
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
    const { getByTestId, getByRole, queryByRole } = renderWithTheme(<ControlledTabExample />);

    expect(getByTestId(selectedTabTestId)).toHaveTextContent('refunds');
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');

    // TODO: change this after isLazy implementation
    expect(queryByRole('tabpanel', { name: 'Payments' })).not.toBeInTheDocument();
    expect(queryByRole('tabpanel', { name: 'Refunds' })).toBeVisible();
    expect(queryByRole('tabpanel', { name: 'Disputes' })).not.toBeInTheDocument();

    await user.click(getByRole('tab', { name: 'Disputes' }));
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId(selectedTabTestId)).toHaveTextContent('disputes');

    // click on button to change to payments
    await user.click(getByRole('button', { name: 'Change to Payments' }));
    expect(getByTestId(selectedTabTestId)).toHaveTextContent('payments');
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
  });

  it('should skip disabled tabs', () => {});

  it('should work with isLazy prop', () => {});

  it('should not have any a11y violations', async () => {});
});
