import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { waitFor } from '@testing-library/react';
import { Collapsible } from '../Collapsible';
import { CollapsibleBody } from '../CollapsibleBody';
import { CollapsibleButton } from '../CollapsibleButton';
import { CollapsibleLink } from '../CollapsibleLink';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';

describe('<Collapsible />', () => {
  it('should render with CollapsibleButton', () => {
    const { container } = renderWithTheme(
      <Collapsible>
        <CollapsibleButton>View Price Breakdown</CollapsibleButton>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with CollapsibleLink', () => {
    const { container } = renderWithTheme(
      <Collapsible>
        <CollapsibleLink>View Price Breakdown</CollapsibleLink>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should expand and close in uncontrolled behavior', async () => {
    const bodyText = 'Actual amount';
    const onExpandChange = jest.fn();

    const { getByRole, getByText } = renderWithTheme(
      <Collapsible onExpandChange={onExpandChange}>
        <CollapsibleButton>View Price Breakdown</CollapsibleButton>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>{bodyText}</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    const user = userEvent.setup();
    const trigger = getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(bodyText)).not.toBeVisible();
    expect(getByRole('region', { hidden: true })).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger);
    // wait for animation to finish
    await waitFor(() => expect(getByText(bodyText)).toBeVisible());

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('region')).toHaveAttribute('aria-hidden', 'false');

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenLastCalledWith({ isExpanded: true });
  });

  it('should expand and close in controlled behavior', async () => {
    const bodyText = 'Actual amount';

    const ControlledCollapseExample = (): React.ReactElement => {
      const [isCollapsibleExpanded, setIsCollapsibleExpanded] = useState(false);

      return (
        <>
          <Button onClick={() => setIsCollapsibleExpanded((prev) => !prev)}>Toggle Collapse</Button>
          <Collapsible
            isExpanded={isCollapsibleExpanded}
            onExpandChange={({ isExpanded }) => setIsCollapsibleExpanded(isExpanded)}
          >
            <CollapsibleButton>View Price Breakdown</CollapsibleButton>
            <CollapsibleBody>
              <Box display="flex" flexDirection="column" minWidth="200px">
                <Text>{bodyText}</Text>
                <Amount value={1000} color="feedback.text.positive.intense" />
              </Box>
            </CollapsibleBody>
          </Collapsible>
        </>
      );
    };

    const { getByRole, getByText } = renderWithTheme(<ControlledCollapseExample />);

    const user = userEvent.setup();
    const externalButton = getByRole('button', { name: 'Toggle Collapse' });
    const collapsibleButton = getByRole('button', { name: 'View Price Breakdown' });

    expect(collapsibleButton).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(bodyText)).not.toBeVisible();
    expect(getByRole('region', { hidden: true })).toHaveAttribute('aria-hidden', 'true');

    // test built in collapsible button
    await user.click(collapsibleButton);
    await waitFor(() => expect(getByText(bodyText)).toBeVisible());

    expect(collapsibleButton).toHaveAttribute('aria-expanded', 'true');
    expect(getByText(bodyText)).toBeVisible();
    expect(getByRole('region')).toHaveAttribute('aria-hidden', 'false');

    // test external button as controlled input for collapsible
    await user.click(externalButton);
    // getByText seems bugged when collapsing back, even if the container has 0 height and aria-hidden="true" it still shows the text content as visible
    await waitFor(() => expect(collapsibleButton).toHaveAttribute('aria-expanded', 'false'));

    expect(getByRole('region', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('should accept testID with CollapsibleLink', () => {
    const { getByTestId } = renderWithTheme(
      <Collapsible testID="collapsible">
        <CollapsibleLink testID="collapsible-link">View Price Breakdown</CollapsibleLink>
        <CollapsibleBody testID="collapsible-body">
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    getByTestId('collapsible');
    getByTestId('collapsible-link');
    getByTestId('collapsible-body');
  });

  it('should accept testID with CollapsibleButton', () => {
    const { getByTestId } = renderWithTheme(
      <Collapsible testID="collapsible">
        <CollapsibleButton testID="collapsible-button">View Price Breakdown</CollapsibleButton>
        <CollapsibleBody testID="collapsible-body">
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    getByTestId('collapsible');
    getByTestId('collapsible-button');
    getByTestId('collapsible-body');
  });

  it('should pass general a11y with CollapsibleLink', async () => {
    const { getByRole } = renderWithTheme(
      <Collapsible defaultIsExpanded>
        <CollapsibleLink>View Price Breakdown</CollapsibleLink>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    const collapsibleTrigger = getByRole('button');
    const collapsiblePanel = getByRole('region');

    await assertAccessible(collapsibleTrigger);
    await assertAccessible(collapsiblePanel);
  });

  it('should pass general a11y with CollapsibleButton', async () => {
    const { container } = renderWithTheme(
      <Collapsible defaultIsExpanded>
        <CollapsibleButton>View Price Breakdown</CollapsibleButton>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} color="feedback.text.positive.intense" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    await assertAccessible(container);
  });
  it('should support adding data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <Collapsible data-analytics-collapsible="View Breakdown">
        <CollapsibleLink data-analytics-collapsible-link="view price breakdown">
          View Price Breakdown
        </CollapsibleLink>
      </Collapsible>,
    );
    const collapsibleDataAnalyticsAttribute = container.querySelector(
      '[data-analytics-collapsible="View Breakdown"]',
    );
    const collapsibleLinkDataAnalyticsAttribute = container.querySelector(
      '[data-analytics-collapsible-link="view price breakdown"]',
    );
    expect(collapsibleDataAnalyticsAttribute).toBeInTheDocument();
    expect(collapsibleLinkDataAnalyticsAttribute).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
