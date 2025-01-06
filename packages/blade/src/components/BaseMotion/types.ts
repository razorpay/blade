import type { AnimationControls, TargetAndTransition, Tween } from 'framer-motion';
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

  /**
   * Whether component should animate in, animate out, or animate both in and out
   *
   * With type="in", component will only animate in but immediately be removed on exit without animation
   * With type="out", component will only animate out but immediately mount on enter without animation
   * With type="inout", component animates in and out both
   *
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';

  /**
   * @default ['mount']
   */
  motionTriggers?: MotionTriggersType[];

  /**
   * This internally maps to `variants` of motion/react
   */
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
  /**
   * Handle visibility of motion component.
   *
   * By default components animate on mount but if you want to mount/unmount them, use this prop instead
   *
   * ### ❌ Incorrect way to handle visibility of components
   *
   * ```jsx
   * isVisible ? <Fade><MyComponent /></Fade> : null
   * ```
   *
   * ### ✅ Correct way
   *
   * ```jsx
   * <Fade isVisible={isVisible}><MyComponent />
   * ```
   *
   * This prop allows us to handle exit animations before the component unmounts
   */
  isVisible?: boolean;

  /**
   * ### Usage
   *
   * ```jsx
   * <Fade motionTriggers={['in-view']}>
   *   <Text>I appear when the component is in view of the scroll</Text>
   * </Fade>
   * ```
   *
   * Values:
   * - mount: Component animates when it mounts
   * - in-view: Component animates when its in view of the scroll
   * - focus: Component animates in when its in focus
   * - on-animate-interactions: Component animates based on motionTriggers of <AnimateInteractions /> component
   *
   * @default ['mount']
   */
  motionTriggers?: MotionTriggerEntryExitType[];

  /**
   * By default components are only made opacity: 0. When this prop is set to true, components will unmount and be removed from the page.
   *
   * **Warn:** Setting this true might cause layout shifts in your page since component will be removed so do check it once and add minHeight to its container
   *
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;

  /**
   * Handles delay of animations
   *
   * ## Usage
   *
   * ```jsx
   * <Fade delay="quick"></Fade>
   * ```
   *
   * ### Different delays for enter and exit
   *
   * ```jsx
   * <Fade delay={{ enter: 'quick', exit: 'gentle' }}></Fade>
   * ```
   *
   * @default undefined
   */
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
