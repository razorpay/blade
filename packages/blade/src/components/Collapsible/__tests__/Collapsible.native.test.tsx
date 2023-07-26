import { fireEvent, waitFor } from '@testing-library/react-native';
import { useState } from 'react';
import { Collapsible } from '../Collapsible';
import { CollapsibleBody } from '../CollapsibleBody';
import { CollapsibleButton } from '../CollapsibleButton';
import { CollapsibleLink } from '../CollapsibleLink';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';

describe('<Collapsible />', () => {
  // Collapsible uses animations and requestAnimationFrame which makes RN tests throw warnings
  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with CollapsibleButton', () => {
    const { toJSON } = renderWithTheme(
      <Collapsible>
        <CollapsibleButton>View Price Breakdown</CollapsibleButton>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} intent="positive" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with CollapsibleLink', () => {
    const { toJSON } = renderWithTheme(
      <Collapsible>
        <CollapsibleLink>View Price Breakdown</CollapsibleLink>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} intent="positive" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    expect(toJSON()).toMatchSnapshot();
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
            <Amount value={1000} intent="positive" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    const trigger = getByRole('button');
    expect(trigger).toHaveAccessibilityState({ expanded: false });
    expect(getByText(bodyText)).not.toBeVisible();

    fireEvent.press(trigger);
    // wait for animation to finish
    await waitFor(() => expect(getByText(bodyText)).toBeVisible());

    expect(trigger).toHaveAccessibilityState({ expanded: true });

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenLastCalledWith({ isExpanded: true });
  });

  it('should expand and close in controlled behavior', async () => {
    // Suppress an act warning that is likely fixed in recent versions https://github.com/callstack/react-native-testing-library/issues/379
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const bodyText = 'Actual amount';

    const ControlledCollapseExample = (): JSX.Element => {
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
                <Amount value={1000} intent="positive" />
              </Box>
            </CollapsibleBody>
          </Collapsible>
        </>
      );
    };

    const { getByText, getAllByRole } = renderWithTheme(<ControlledCollapseExample />);

    const [externalButton, collapsibleButton] = getAllByRole('button');

    expect(collapsibleButton).toHaveAccessibilityState({ expanded: false });
    expect(getByText(bodyText)).not.toBeVisible();

    // test built in collapsible button
    fireEvent.press(collapsibleButton);
    await waitFor(() => expect(getByText(bodyText)).toBeVisible());

    expect(collapsibleButton).toHaveAccessibilityState({ expanded: true });
    expect(getByText(bodyText)).toBeVisible();

    // test external button as controlled input for collapsible
    fireEvent.press(externalButton);
    // getByText seems bugged when collapsing back, even if the container has 0 height and aria-hidden="true" it still shows the text content as visible
    await waitFor(() => expect(getByText(bodyText)).not.toBeVisible());

    expect(collapsibleButton).toHaveAccessibilityState({ expanded: false });

    mockConsoleError.mockRestore();
  });

  it('should accept testID with CollapsibleLink', () => {
    const { getByTestId } = renderWithTheme(
      <Collapsible testID="collapsible">
        <CollapsibleLink testID="collapsible-link">View Price Breakdown</CollapsibleLink>
        <CollapsibleBody testID="collapsible-body">
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Text>Actual amount</Text>
            <Amount value={1000} intent="positive" />
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
            <Amount value={1000} intent="positive" />
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    getByTestId('collapsible');
    getByTestId('collapsible-button');
    getByTestId('collapsible-body');
  });
});
