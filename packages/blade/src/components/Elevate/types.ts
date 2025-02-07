import type { BaseMotionBoxProps } from '~components/BaseMotion';

type ElevateProps = Pick<BaseMotionBoxProps, 'type' | 'motionTriggers' | 'children'> & {
  /**
   * Controlled state of elevation. If you want to elevate on hover / focus, etc, checkout `motionTriggers` prop instead.
   *
   * This is when you want to elevate conditionally
   *
   * With `isHighlighted={true}`, your component will be in elevated state
   * With `isHighlighted={false}`, your component will be in normal state
   */
  isHighlighted?: boolean;
};

export type { ElevateProps };
