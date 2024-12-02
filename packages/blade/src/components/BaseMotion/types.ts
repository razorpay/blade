import type { AnimationControls, TargetAndTransition, Tween } from 'motion/react';
import type React from 'react';
import type { Delay } from '~tokens/global/motion';

type MotionTriggerEntryExitType = 'mount' | 'in-view' | 'focus' | 'on-animate-interactions';
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

type MotionDelay = keyof Delay | { enter: keyof Delay; exit: keyof Delay };

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
  delay?: MotionDelay;
};

type MotionMeta = {
  innerRef: React.Ref<HTMLElement>;
  isEnhanced: boolean;
};

type MotionMetaProp = {
  /**
   * @private
   *
   * This prop is internally injected when Motion Preset enhances some component.
   *
   * You only need to add this prop to component that requires you to pass ref to some internal component. E.g. in checkbox, we need ref on internal input component but we also need one ref on outer component.
   * Use this in combination with `getOuterMotionRef` and `getInnerMotionRef` utilities
   */
  _motionMeta?: MotionMeta;
};

export type {
  BaseMotionEntryExitProps,
  MotionVariantsType,
  MotionTriggersType,
  BaseMotionBoxProps,
  MotionMeta,
  MotionMetaProp,
  MotionDelay,
};
