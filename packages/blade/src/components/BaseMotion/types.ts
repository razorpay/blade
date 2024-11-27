import type { AnimationControls, Variant } from 'motion/react';

type MotionTriggerEntryExitType = 'mount' | 'inView' | 'focus' | 'on-animate-interactions';
type MotionTriggersType = MotionTriggerEntryExitType | 'hover' | 'tap';

type MotionVariantsType = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionBoxProps = {
  children: React.ReactElement;
  type?: 'in' | 'out' | 'inout';
  /**
   * @default ['mount']
   */
  motionTriggers?: MotionTriggersType[];
  motionVariants?: MotionVariantsType;
  /**
   * Option to override the animate
   *
   * Useful when you want to control animation custom
   *
   * E.g.
   * ```js
   * const controls = useAnimationControls();
   *
   * animate={controls}
   * ```
   */
  animate?: AnimationControls;

  /**
   * This is for scenarios where you want to conditionally animate a component instead of it having static defined animation.
   *
   * E.g. In scenarios where your motion component is always mounted, you can use this to switch visibility
   *
   * ```js
   * conditionalAnimate={isVisible ? 'animate' : 'exit'}
   * ```
   */
  conditionalAnimate?: keyof MotionVariantsType;
};

type BaseMotionEntryExitProps = Pick<BaseMotionBoxProps, 'children' | 'motionVariants' | 'type'> & {
  isVisible?: boolean;
  motionTriggers?: MotionTriggerEntryExitType[];
  shouldUnmountWhenHidden?: boolean;
};

type MotionMeta = {
  innerRef: React.Ref<HTMLElement>;
  isEnhanced: boolean;
};

type MotionMetaProp = {
  _motionMeta?: MotionMeta;
};

export type {
  BaseMotionEntryExitProps,
  MotionVariantsType,
  MotionTriggersType,
  BaseMotionBoxProps,
  MotionMeta,
  MotionMetaProp,
};
