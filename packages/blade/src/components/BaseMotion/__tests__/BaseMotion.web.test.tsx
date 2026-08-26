/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import '@testing-library/jest-dom';
import { BaseMotionBox, BaseMotionEnhancerBox } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

let mockMotionProps: Record<string, any> = {};
jest.mock('framer-motion', () => ({
  m: jest.fn().mockImplementation(() => (props: any) => {
    mockMotionProps = props;
    const propsLowerCased = Object.fromEntries(
      Object.entries(props).map(([propName, propValue]) => [propName.toLowerCase(), propValue]),
    );
    return <div {...propsLowerCased} />;
  }),
}));

describe('<BaseMotionBox />', () => {
  it('should render with correct motion react props on motion element', () => {
    const { container } = renderWithTheme(
      <BaseMotionBox
        motionVariants={{
          initial: { color: 'red' },
          animate: {
            color: ['blue', 'green'],
            transition: { duration: 0.8, ease: [0, 0, 0.1, 0] },
          },
          exit: { color: 'yellow', transition: { duration: 0.3, ease: [0, 0, 0.4, 0] } },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );
    expect(mockMotionProps).toMatchSnapshot();
    expect(container).toMatchSnapshot();
  });

  it('should render enhance the child component', () => {
    const { container } = renderWithTheme(
      <BaseMotionEnhancerBox
        motionVariants={{
          initial: { color: 'red' },
          animate: {
            color: ['blue', 'green'],
            transition: { duration: 0.8, ease: [0, 0, 0.1, 0] },
          },
          exit: { color: 'yellow', transition: { duration: 0.3, ease: [0, 0, 0.4, 0] } },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionEnhancerBox>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should disable exit animation when type is "in" transition', () => {
    renderWithTheme(
      <BaseMotionBox
        type="in"
        motionVariants={{
          initial: { color: 'red' },
          animate: {
            color: ['blue', 'green'],
            transition: { duration: 0.8, ease: [0, 0, 0.1, 0] },
          },
          exit: { color: 'yellow', transition: { duration: 0.3, ease: [0, 0, 0.4, 0] } },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );

    expect(mockMotionProps.variants.animate.transition.duration).toBe(0.8);
    expect(mockMotionProps.variants.exit.transition.duration).toBe(0.0001);
  });

  it('should add transitionEnd with transform when exit is skipped and variant has transform', () => {
    renderWithTheme(
      <BaseMotionBox
        type="in"
        motionVariants={{
          initial: { opacity: 0, transform: 'translateY(16px)' },
          animate: {
            opacity: 1,
            transform: 'translateY(0px)',
            transition: { duration: 0.36, ease: [0, 0, 0.2, 1] },
          },
          exit: {
            opacity: 0,
            transform: 'translateY(16px)',
            transition: { duration: 0.2, ease: [0.17, 0, 1, 1] },
          },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );

    expect(mockMotionProps.variants.exit.transition.duration).toBe(0.0001);
    expect(mockMotionProps.variants.exit.transitionEnd).toEqual({ transform: 'translateY(16px)' });
  });

  it('should not override existing transitionEnd.transform when exit is skipped', () => {
    renderWithTheme(
      <BaseMotionBox
        type="in"
        motionVariants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transform: ['translateY(100vh)', 'translateY(0%)'],
            transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
          },
          exit: {
            opacity: 0,
            transform: 'translateY(100vh)',
            transitionEnd: { transform: 'translateY(100vh)' },
            transition: { duration: 0.3, ease: [0.17, 0, 1, 1] },
          },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );

    expect(mockMotionProps.variants.exit.transition.duration).toBe(0.0001);
    expect(mockMotionProps.variants.exit.transitionEnd).toEqual({ transform: 'translateY(100vh)' });
  });

  it('should add transitionEnd with final transform from keyframe array when entry is skipped', () => {
    renderWithTheme(
      <BaseMotionBox
        type="out"
        motionVariants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transform: ['translateY(100vh)', 'translateY(0%)'],
            transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
          },
          exit: {
            opacity: 0,
            transform: 'translateY(100vh)',
            transition: { duration: 0.3, ease: [0.17, 0, 1, 1] },
          },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );

    expect(mockMotionProps.variants.animate.transition.duration).toBe(0.0001);
    expect(mockMotionProps.variants.animate.transitionEnd).toEqual({ transform: 'translateY(0%)' });
  });

  it('should disable entry animation when type is "out" transition', () => {
    renderWithTheme(
      <BaseMotionBox
        type="out"
        motionVariants={{
          initial: { color: 'red' },
          animate: {
            color: ['blue', 'green'],
            transition: { duration: 0.8, ease: [0, 0, 0.1, 0] },
          },
          exit: { color: 'yellow', transition: { duration: 0.3, ease: [0, 0, 0.4, 0] } },
        }}
        motionTriggers={['mount']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );

    expect(mockMotionProps.variants.exit.transition.duration).toBe(0.3);
    expect(mockMotionProps.variants.animate.transition.duration).toBe(0.0001);
  });

  it('should render correct animation variables on hover / focus', () => {
    renderWithTheme(
      <BaseMotionBox
        motionVariants={{
          initial: { color: 'red' },
          animate: {
            color: ['blue', 'green'],
            transition: { duration: 0.8, ease: [0, 0, 0.1, 0] },
          },
          exit: { color: 'yellow', transition: { duration: 0.3, ease: [0, 0, 0.4, 0] } },
        }}
        motionTriggers={['hover', 'focus', 'in-view']}
      >
        <div>hi</div>
      </BaseMotionBox>,
    );

    expect(mockMotionProps.whileHover).toBe('animate');
    expect(mockMotionProps.whileFocus).toBe('animate');
    expect(mockMotionProps.whileInView).toBe('animate');
    expect(mockMotionProps.animate).toBe(undefined);
  });
});
