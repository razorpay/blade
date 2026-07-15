import React from 'react';
import { Pressable } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { AnimateInteractions } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Box } from '~components/Box';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<AnimateInteractions /> (native)', () => {
  it('should render its children as expected', () => {
    const { toJSON } = renderWithTheme(
      <AnimateInteractions>
        <Box>
          <Text>Test</Text>
          <Fade motionTriggers={['on-animate-interactions']}>
            <Text>Reveal me</Text>
          </Fade>
        </Box>
      </AnimateInteractions>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should wrap children in a Pressable interaction surface', () => {
    const { UNSAFE_getByType, getByText } = renderWithTheme(
      <AnimateInteractions>
        <Box>
          <Text>Press me for magic</Text>
          <Fade motionTriggers={['on-animate-interactions']}>
            <Text>Reveal me</Text>
          </Fade>
        </Box>
      </AnimateInteractions>,
    );

    expect(UNSAFE_getByType(Pressable)).toBeTruthy();
    expect(getByText('Press me for magic')).toBeTruthy();
  });

  it('should drive descendants on press-and-hold without throwing', () => {
    const { UNSAFE_getByType, getByText } = renderWithTheme(
      <AnimateInteractions>
        <Box>
          <Text>Press me</Text>
          <Move motionTriggers={['on-animate-interactions']}>
            <Text>I move in on interaction</Text>
          </Move>
        </Box>
      </AnimateInteractions>,
    );

    const pressable = UNSAFE_getByType(Pressable);

    // Press-and-hold → children animate to `'animate'`; release → back to `'exit'`.
    expect(() => {
      fireEvent(pressable, 'pressIn');
      fireEvent(pressable, 'pressOut');
    }).not.toThrow();

    // Node stays mounted throughout the interaction (deep reanimated style assertions are brittle,
    // so we assert render stability instead).
    expect(getByText('I move in on interaction')).toBeTruthy();
  });

  it('should ignore motionTriggers on native (API parity only)', () => {
    const { toJSON } = renderWithTheme(
      <AnimateInteractions motionTriggers={['hover', 'focus']}>
        <Box>
          <Fade motionTriggers={['on-animate-interactions']}>
            <Text>Reveal me</Text>
          </Fade>
        </Box>
      </AnimateInteractions>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
