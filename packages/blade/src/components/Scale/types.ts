import type { BaseMotionBoxProps } from '~components/BaseMotion';

type ScaleProps = Pick<BaseMotionBoxProps, 'type' | 'motionTriggers' | 'children'> & {
  /**
   * Controlled state of scaling. If you want to scale up on hover / focus, etc, checkout `motionTriggers` prop instead.
   *
   * This is when you want to scale up / scale down conditionally
   *
   * With `isHighlighted={true}`, your component will be in scaled state
   * With `isHighlighted={false}`, your component will be in normal state
   */
  isHighlighted?: boolean;

  /**
   * Whether to scale up or scale down the component
   */
  variant?: 'scale-up' | 'scale-down';
};

export type { ScaleProps };
