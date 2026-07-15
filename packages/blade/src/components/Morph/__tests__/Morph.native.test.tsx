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
 * Morph on native is intentionally DEGRADED (see `Morph.native.tsx`): it renders the child inside a
 * persistent animated wrapper and can only tween `backgroundColor`/`borderRadius` when the same
 * instance's child props change. FLIP / shared-element morph across `AnimatePresence` swaps is not
 * achievable in reanimated 3.4.2 and is out of scope. These tests assert the degraded contract.
 */
describe('<Morph /> (native, degraded)', () => {
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

  it('accepts layoutId but ignores it on native (no crash, child still rendered)', () => {
    const { getByText } = renderWithTheme(
      <Morph layoutId="ignored-on-native">
        <Text>Same instance</Text>
      </Morph>,
    );

    expect(getByText('Same instance')).toBeTruthy();
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
