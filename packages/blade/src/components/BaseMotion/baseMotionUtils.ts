import type { AnimationType } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import type { BaseMotionBoxProps, MotionTriggersType, MotionVariantsType } from './types';

const motionTriggersArrayToGesturePropsMap: Record<
  Exclude<MotionTriggersType, 'on-animate-interactions'>,
  AnimationType
> = {
  mount: 'animate',
  hover: 'whileHover',
  inView: 'whileInView',
  tap: 'whileTap',
  focus: 'whileFocus',
};

type AnimationVariablesType = Partial<
  Record<Exclude<AnimationType, 'animate'>, keyof MotionVariantsType>
> & {
  animate?: BaseMotionBoxProps['conditionalAnimate'] | BaseMotionBoxProps['animate'];
};

const makeAnimationVariables = (
  motionTriggers: MotionTriggersType[],
  {
    animate: animateOverride,
  }: { animate: BaseMotionBoxProps['conditionalAnimate'] | BaseMotionBoxProps['animate'] },
) => {
  const interactionVariables = motionTriggers.reduce<AnimationVariablesType>(
    (prevProps, currentTrigger) => {
      if (currentTrigger === 'on-animate-interactions') {
        return prevProps;
      }

      if (currentTrigger === 'mount' && animateOverride) {
        prevProps.animate = animateOverride;
        return prevProps;
      }

      prevProps[motionTriggersArrayToGesturePropsMap[currentTrigger]] = 'animate';
      return prevProps;
    },
    {},
  );

  return { initial: 'initial', exit: 'exit', ...interactionVariables };
};

const useMotionVariants = (
  motionVariants: BaseMotionBoxProps['motionVariants'],
  type: BaseMotionBoxProps['type'],
): BaseMotionBoxProps['motionVariants'] => {
  const shouldReduceMotion = useReducedMotion();

  if (!motionVariants) {
    return undefined;
  }

  const shouldSkipEntryAnimation = shouldReduceMotion || type === 'out';
  const shouldSkipExitAnimation = shouldReduceMotion || type === 'in';

  // We override durations to stop animations but still continue with the expected position changes
  const newMotionVariants: BaseMotionBoxProps['motionVariants'] = {
    initial: {
      ...motionVariants.initial,
    },
    animate: {
      ...motionVariants.animate,
      transition: {
        ...motionVariants.animate?.transition,
        duration: shouldSkipEntryAnimation ? 0.0001 : motionVariants.animate?.transition?.duration,
      },
    },
    exit: {
      ...motionVariants.exit,
      transition: {
        ...motionVariants.exit.transition,
        duration: shouldSkipExitAnimation ? 0.0001 : motionVariants.exit.transition?.duration,
      },
    },
  };

  return newMotionVariants;
};

export { makeAnimationVariables, useMotionVariants };
