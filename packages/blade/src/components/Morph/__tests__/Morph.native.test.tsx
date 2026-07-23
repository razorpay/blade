import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Morph } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

/**
 * Morph on native approximates web's layoutId FLIP via a measureInWindow handoff registry, and
 * tweens same-instance backgroundColor/borderRadius. Full framer shared-element parity is not
 * claimed — these tests assert the native contract stays healthy.
 */
describe('<Morph /> (native)', () => {
  it('renders its child without throwing and matches snapshot', () => {
    const { toJSON, getByText } = renderWithTheme(
      <Morph layoutId="morph-text">
        <Text>Hello Morph</Text>
      </Morph>,
    );

    expect(getByText('Hello Morph')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders a Box child with backgroundColor + borderRadius on the degraded wrapper', () => {
    const { toJSON } = renderWithTheme(
      <Morph layoutId="box-shape">
        <Box
          height="200px"
          width="200px"
          borderRadius="round"
          backgroundColor="surface.background.primary.intense"
        />
      </Morph>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('accepts layoutId and renders without crashing (handoff is measure-driven on device)', () => {
    const { getByText } = renderWithTheme(
      <Morph layoutId="handoff-key">
        <Text>Same instance</Text>
      </Morph>,
    );

    expect(getByText('Same instance')).toBeTruthy();
  });

  it('keeps rendering when two Morphs with the same layoutId swap (AnimatePresence-style)', () => {
    const Harness = (): React.ReactElement => {
      const [showAlt, setShowAlt] = React.useState(false);
      return (
        <Box>
          <Button onClick={() => setShowAlt(true)}>Swap</Button>
          {showAlt ? (
            <Morph layoutId="shared-title">
              <Text>Payment Pages</Text>
            </Morph>
          ) : (
            <Morph layoutId="shared-title">
              <Text>Payment Pages (card)</Text>
            </Morph>
          )}
        </Box>
      );
    };

    const { getByText, queryByText } = renderWithTheme(<Harness />);
    expect(getByText('Payment Pages (card)')).toBeTruthy();
    fireEvent.press(getByText('Swap'));
    expect(getByText('Payment Pages')).toBeTruthy();
    expect(queryByText('Payment Pages (card)')).toBeNull();
  });

  it('tweens on a same-instance child prop change without throwing', () => {
    const Harness = (): React.ReactElement => {
      const [toggled, setToggled] = React.useState(false);

      return (
        <Box>
          <Button onClick={() => setToggled(true)}>Toggle</Button>
          <Morph layoutId="persistent">
            <Box
              height="100px"
              width="100px"
              borderRadius={toggled ? 'medium' : 'none'}
              backgroundColor={
                toggled ? 'surface.background.primary.intense' : 'surface.background.gray.subtle'
              }
            />
          </Morph>
        </Box>
      );
    };

    const { getByText, toJSON } = renderWithTheme(<Harness />);

    // Changing the child's bg/radius re-runs the wrapper tween (timing-driven values are not
    // asserted deterministically — we only assert the re-render stays healthy).
    fireEvent.press(getByText('Toggle'));
    expect(toJSON()).toBeTruthy();
  });

  it('passes child event handlers through untouched', () => {
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(
      <Morph layoutId="btn">
        <Button onClick={onClick}>Press me</Button>
      </Morph>,
    );

    fireEvent.press(getByText('Press me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
