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

const getFinalTransformValue = (transform: unknown): string | undefined => {
  if (typeof transform === 'string') return transform;
  if (Array.isArray(transform)) {
    const last = transform[transform.length - 1];
    return typeof last === 'string' ? last : undefined;
  }
  return undefined;
};

const hasTransitionEndTransform = (variant: unknown): boolean => {
  return (
    (variant as { transitionEnd?: { transform?: unknown } })?.transitionEnd?.transform !== undefined
  );
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

  // When a direction is skipped (type="in" skips exit, type="out" skips entry), the near-zero
  // duration (0.0001s) WAAPI animation in Firefox doesn't reliably commit `transform` via
  // commitStyles(). We add `transitionEnd` with the target `transform` so framer-motion sets it
  // directly as an inline style after the animation, bypassing the commitStyles() path.
  const animateTransform = getFinalTransformValue(motionVariants.animate?.transform);
  const shouldAddAnimateTransitionEnd =
    shouldSkipEntryAnimation &&
    animateTransform !== undefined &&
    !hasTransitionEndTransform(motionVariants.animate);

  const exitTransform = getFinalTransformValue(motionVariants.exit?.transform);
  const shouldAddExitTransitionEnd =
    shouldSkipExitAnimation &&
    exitTransform !== undefined &&
    !hasTransitionEndTransform(motionVariants.exit);

  const newMotionVariants = {
    initial: {
      ...motionVariants.initial,
    },
    animate: {
      ...motionVariants.animate,
      transition: {
        ...motionVariants.animate?.transition,
        duration: shouldSkipEntryAnimation ? 0.0001 : motionVariants.animate?.transition?.duration,
      },
      ...(shouldAddAnimateTransitionEnd
        ? {
            transitionEnd: {
              ...motionVariants.animate?.transitionEnd,
              transform: animateTransform,
            },
          }
        : {}),
    },
    exit: {
      ...motionVariants.exit,
      transition: {
        ...motionVariants.exit.transition,
        duration: shouldSkipExitAnimation ? 0.0001 : motionVariants.exit.transition?.duration,
      },
      ...(shouldAddExitTransitionEnd
        ? {
            transitionEnd: {
              ...motionVariants.exit?.transitionEnd,
              transform: exitTransform,
            },
          }
        : {}),
    },
  } as BaseMotionBoxProps['motionVariants'];

  return newMotionVariants;
};

export { makeAnimationVariables, useMotionVariants };
