import { m as motion } from 'motion/react';
import type { AnimationType } from 'motion/react';
import React from 'react';
import styled from 'styled-components';
import { useAnimateInteractions } from '~components/AnimateInteractions/AnimateInteractionsProvider';
import { useStagger } from '~components/Stagger/StaggerProvider';
import type { BladeElementRef } from '~utils/types';
import type { BaseMotionBoxProps, MotionTriggersType, MotionVariantsType } from './types';

// Creating empty styled component so that the final component supports `as` prop
const StyledDiv = styled.div``;
const MotionDiv = motion.create(StyledDiv);

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

const useAnimationVariables = ({
  type,
  motionTriggers,
  conditionalAnimate,
}: {
  type: BaseMotionBoxProps['type'];
  motionTriggers: MotionTriggersType[];
  conditionalAnimate?: BaseMotionBoxProps['conditionalAnimate'];
}) => {
  const { isInsideAnimateInteractionsContainer } = useAnimateInteractions();
  const { isInsideStaggerContainer } = useStagger();
  const skipMotionOnCurrentElement =
    (isInsideAnimateInteractionsContainer && motionTriggers.includes('on-animate-interactions')) ||
    isInsideStaggerContainer;

  const animationVariables = React.useMemo(() => {
    if (skipMotionOnCurrentElement) {
      return {};
    }

    const triggerProps = motionTriggers?.reduce<
      Partial<Record<AnimationType, keyof MotionVariantsType>>
    >((prevProps, currentTrigger) => {
      // impossible state since when this is true, the `skipMotionOnCurrentElement` is also true which early returns above
      // Keeping it for TS check and for future in case we change anything in condition above
      if (currentTrigger === 'on-animate-interactions') {
        return prevProps;
      }

      // This is for the case where we have conditional animations instead (especially for scenarios where component is always mounted)
      if (currentTrigger === 'mount' && conditionalAnimate) {
        prevProps.animate = conditionalAnimate;
        return prevProps;
      }

      prevProps[motionTriggersArrayToGesturePropsMap[currentTrigger]] = 'animate';

      return prevProps;
    }, {});

    // When component is rendered inside stagger, we remove the initial, animate, exit props
    // otherwise they override the stagger behaviour and stagger does not work
    return {
      initial: type === 'in' || type === 'inout' ? 'initial' : undefined,
      exit: type === 'out' || type === 'inout' ? 'exit' : undefined,
      ...triggerProps,
    };
  }, [type, skipMotionOnCurrentElement, motionTriggers, conditionalAnimate]);

  return animationVariables;
};

const _BaseMotionBox = (
  {
    children,
    motionVariants,
    type = 'inout',
    motionTriggers = ['mount'],
    conditionalAnimate,
    ...rest
  }: BaseMotionBoxProps,
  ref: React.Ref<BladeElementRef>,
) => {
  const animationVariables = useAnimationVariables({
    type,
    motionTriggers,
    conditionalAnimate,
  });

  return (
    <MotionDiv
      ref={ref}
      variants={motionVariants}
      viewport={{ amount: 0.8, once: true }}
      {...animationVariables}
      {...rest}
    >
      {children}
    </MotionDiv>
  );
};

const BaseMotionBox = React.forwardRef(_BaseMotionBox);

export { MotionDiv, BaseMotionBox };
