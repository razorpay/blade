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
