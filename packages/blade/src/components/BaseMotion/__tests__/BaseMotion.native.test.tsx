import React from 'react';
import { act } from '@testing-library/react-native';
import { BaseMotionBox, BaseMotionEnhancerBox, BaseMotionEntryExit } from '../index';
import { useMotionVariants } from '../baseMotionUtils';
import type { MotionVariantsType } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
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

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const renderVariantHook = (
  variants: MotionVariantsType,
  type: 'in' | 'out' | 'inout',
): MotionVariantsType | undefined => {
  let result: MotionVariantsType | undefined;
  const Harness = (): null => {
    result = useMotionVariants(variants, type);
    return null;
  };
  renderWithTheme(<Harness />);
  return result;
};

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
    const variants = renderVariantHook(fadeVariants, 'in');

    expect(variants?.animate.transition?.duration).toBe(0.8);
    expect(variants?.exit.transition?.duration).toBe(0.0001);
  });

  it('should zero the entry duration when type is "out"', () => {
    const variants = renderVariantHook(fadeVariants, 'out');

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
    jest.useFakeTimers();

    const { toJSON, getByText, rerender } = renderWithTheme(
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible shouldUnmountWhenHidden>
        <Text>toggle child</Text>
      </BaseMotionEntryExit>,
    );

    expect(getByText('toggle child')).toBeTruthy();

    rerender(
      <BaseMotionEntryExit motionVariants={fadeVariants} isVisible={false} shouldUnmountWhenHidden>
        <Text>toggle child</Text>
      </BaseMotionEntryExit>,
    );

    // The exit animation completes synchronously (mocked reanimated), then the child is unmounted on
    // the next frame via requestAnimationFrame. Use fake timers to flush that frame deterministically.
    await act(() => {
      jest.runAllTimers();
    });

    expect(JSON.stringify(toJSON())).not.toContain('toggle child');

    jest.useRealTimers();
  });
});
