import type { AnimationControls, TargetAndTransition, Tween } from 'motion/react';
import React from 'react';

type MotionTriggerEntryExitType = 'mount' | 'inView' | 'focus' | 'on-animate-interactions';
type MotionTriggersType = MotionTriggerEntryExitType | 'hover' | 'tap';

type MotionVariantsType = {
  initial: TargetAndTransition & {
    transition?: Tween;
  };
  animate: TargetAndTransition & {
    transition?: Tween;
  };
  exit: TargetAndTransition & {
    transition?: Tween;
  };
};

type BaseMotionBoxProps = {
  as?: React.ReactElement;
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
   * animateVisibility={isVisible ? 'animate' : 'exit'}
   * ```
   */
  animateVisibility?: keyof MotionVariantsType;
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
