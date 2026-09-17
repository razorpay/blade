import React from 'react';
import { waitFor } from '@testing-library/react-native';
import { BaseMotionBox, BaseMotionEnhancerBox, BaseMotionEntryExit } from '../index';
import { useMotionVariants } from '../baseMotionUtils';
import type { MotionVariantsType } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import themeWrapper from '~utils/testing/themeWrapper';
import { Text } from '~components/Typography';

const fadeVariants: MotionVariantsType = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0, 0, 0.1, 0] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.4, 0] },
  },
};

/** `renderWithTheme` wraps once; `rerender` must re-wrap or BladeProvider context is lost. */
const rerenderWithTheme = (
  rerender: (ui: React.ReactElement) => void,
  ui: React.ReactElement,
): void => {
  rerender(themeWrapper({ children: ui }));
};

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseMotion /> (native)', () => {
  it('should render children inside BaseMotionBox', () => {
    const { toJSON, getByText } = renderWithTheme(
      <BaseMotionBox motionVariants={fadeVariants} motionTriggers={['mount']}>
        <Text>motion child</Text>
      </BaseMotionBox>,
    );

    expect(getByText('motion child')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should wrap the child when using BaseMotionEnhancerBox', () => {
    const { toJSON, getByText } = renderWithTheme(
      <BaseMotionEnhancerBox motionVariants={fadeVariants} motionTriggers={['mount']}>
        <Text>enhanced child</Text>
      </BaseMotionEnhancerBox>,
    );

    expect(getByText('enhanced child')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should zero the exit duration when type is "in"', () => {
    const variants = useMotionVariants(fadeVariants, 'in');

    expect(variants?.animate.transition?.duration).toBe(0.8);
    expect(variants?.exit.transition?.duration).toBe(0.0001);
  });

  it('should zero the entry duration when type is "out"', () => {
    const variants = useMotionVariants(fadeVariants, 'out');

    expect(variants?.exit.transition?.duration).toBe(0.3);
    expect(variants?.animate.transition?.duration).toBe(0.0001);
  });

  it('should render children through BaseMotionEntryExit', () => {
    const { getByText } = renderWithTheme(
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible>
        <Text>entry exit child</Text>
      </BaseMotionEntryExit>,
    );

    expect(getByText('entry exit child')).toBeTruthy();
  });

  it('should mount / unmount child when isVisible toggles with shouldUnmountWhenHidden', async () => {
    const { toJSON, getByText, rerender } = renderWithTheme(
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible shouldUnmountWhenHidden>
        <Text>toggle child</Text>
      </BaseMotionEntryExit>,
    );

    expect(getByText('toggle child')).toBeTruthy();

    rerenderWithTheme(
      rerender,
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible={false} shouldUnmountWhenHidden>
        <Text>toggle child</Text>
      </BaseMotionEntryExit>,
    );

    // The exit animation completes synchronously (mocked reanimated), then the child is unmounted
    // after interactions complete. Use waitFor to poll for the unmount instead of a fixed delay.
    await waitFor(() => {
      expect(JSON.stringify(toJSON())).not.toContain('toggle child');
    });
  });

  it('should render children when using tap trigger', () => {
    const { getByText } = renderWithTheme(
      <BaseMotionBox motionVariants={fadeVariants} motionTriggers={['tap']}>
        <Text>tap child</Text>
      </BaseMotionBox>,
    );

    expect(getByText('tap child')).toBeTruthy();
  });

  it('should render BaseMotionEntryExit children without shouldUnmountWhenHidden', () => {
    const { getByText, rerender } = renderWithTheme(
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible>
        <Text>persist child</Text>
      </BaseMotionEntryExit>,
    );

    expect(getByText('persist child')).toBeTruthy();

    // Without shouldUnmountWhenHidden, the child should remain mounted when hidden.
    rerenderWithTheme(
      rerender,
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible={false}>
        <Text>persist child</Text>
      </BaseMotionEntryExit>,
    );

    expect(getByText('persist child')).toBeTruthy();
  });

  it('should drive animation via animateVisibility prop', () => {
    const { getByText, rerender } = renderWithTheme(
      <BaseMotionBox
        motionVariants={fadeVariants}
        motionTriggers={['mount']}
        animateVisibility="animate"
      >
        <Text>visibility child</Text>
      </BaseMotionBox>,
    );

    expect(getByText('visibility child')).toBeTruthy();

    rerenderWithTheme(
      rerender,
      <BaseMotionBox
        motionVariants={fadeVariants}
        motionTriggers={['mount']}
        animateVisibility="exit"
      >
        <Text>visibility child</Text>
      </BaseMotionBox>,
    );

    expect(getByText('visibility child')).toBeTruthy();
  });
});
