import type { BaseMotionBoxProps, MotionTriggersType, MotionVariantsType } from './types';

// This type is exported in new framer-motion versions but does not exist in earlier versions so adding it manually here
type AnimationType = 'animate' | 'whileHover' | 'whileInView' | 'whileTap' | 'whileFocus';

const motionTriggersArrayToGesturePropsMap: Record<
  Exclude<MotionTriggersType, 'on-animate-interactions'>,
  AnimationType
> = {
  mount: 'animate',
  hover: 'whileHover',
  'in-view': 'whileInView',
  tap: 'whileTap',
  focus: 'whileFocus',
};

type AnimationVariablesType = Partial<
  Record<Exclude<AnimationType, 'animate'>, keyof MotionVariantsType>
> & {
  animate?: BaseMotionBoxProps['animateVisibility'] | BaseMotionBoxProps['animate'];
};

const makeAnimationVariables = (
  motionTriggers: MotionTriggersType[],
  { animateVisibility }: { animateVisibility: BaseMotionBoxProps['animateVisibility'] },
): AnimationVariablesType & {
  initial: string;
  exit: string;
} => {
  const interactionVariables = motionTriggers.reduce<AnimationVariablesType>(
    (prevProps, currentTrigger) => {
      if (currentTrigger === 'on-animate-interactions') {
        return prevProps;
      }

      // Sometimes animations are conditional. In those cases we use those conditional values in animate
      if (currentTrigger === 'mount' && animateVisibility) {
        prevProps.animate = animateVisibility;
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
  if (!motionVariants) {
    return undefined;
  }

  const shouldSkipEntryAnimation = type === 'out';
  const shouldSkipExitAnimation = type === 'in';

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
