import { AnimatePresence, AnimationType, m as motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { useAnimateInteractions } from '~components/AnimateInteractions/AnimateInteractionsProvider';
import { useStagger } from '~components/Stagger/StaggerProvider';
import type { BaseMotionBoxProps, BaseMotionEntryExitProps, MotionTriggersType } from './types';

// Creating empty styled component so that the final component supports `as` prop
const StyledDiv = styled.div``;
const MotionDiv = motion(StyledDiv);

const motionTriggersArrayToGesturePropsMap: Record<MotionTriggersType, AnimationType> = {
  mount: 'animate',
  hover: 'whileHover',
  inView: 'whileInView',
  tap: 'whileTap',
  focus: 'whileFocus',
};

const useAnimationVariables = ({
  variant,
  isInsideStaggerContainer,
  isInsideAnimateInteractionsContainer,
  motionTriggers,
}: {
  variant: BaseMotionEntryExitProps['variant'];
  motionTriggers: BaseMotionEntryExitProps['motionTriggers'];
  isInsideStaggerContainer: boolean;
  isInsideAnimateInteractionsContainer: boolean;
}) => {
  const animationVariables = React.useMemo(() => {
    console.log({ isInsideStaggerContainer });
    if (isInsideStaggerContainer) {
      return {};
    }

    if (isInsideAnimateInteractionsContainer) {
      return {};
    }

    const triggerProps = motionTriggers?.reduce<Partial<Record<AnimationType, 'animate'>>>(
      (prevProps, currentTrigger) => {
        prevProps[motionTriggersArrayToGesturePropsMap[currentTrigger]] = 'animate';
        return prevProps;
      },
      {},
    );

    // When component is rendered inside stagger, we remove the initial, animate, exit props
    // otherwise they override the stagger behaviour and stagger does not work
    return {
      initial: variant === 'in' || variant === 'inout' ? 'initial' : undefined,
      exit: variant === 'out' || variant === 'inout' ? 'exit' : undefined,
      ...triggerProps,
    };
  }, [variant, isInsideStaggerContainer]);

  return animationVariables;
};

const BaseMotionBox = ({
  children,
  motionVariants,
  variant = 'inout',
  motionTriggers = ['mount'],
  speed,
  ...rest
}: BaseMotionBoxProps) => {
  const { isInsideStaggerContainer } = useStagger();
  const { isInsideAnimateInteractionsContainer } = useAnimateInteractions();
  const animationVariables = useAnimationVariables({
    variant,
    isInsideStaggerContainer,
    isInsideAnimateInteractionsContainer,
    motionTriggers,
  });

  console.log({ animationVariables, motionTriggers, variant });

  return (
    <MotionDiv
      // kinda hack to build it as enhancer component
      variants={motionVariants}
      {...animationVariables}
      {...rest}
    >
      {children}
    </MotionDiv>
  );
};

const BaseMotionEntryExit = ({
  children,
  motionVariants,
  isVisible = true,
  variant = 'inout',
  motionTriggers = ['mount'],
}: BaseMotionEntryExitProps) => {
  return (
    <AnimatePresence>
      {isVisible ? (
        <BaseMotionBox
          // kinda hack to build it as enhancer component
          as={children.type}
          motionVariants={motionVariants}
          motionTriggers={motionTriggers}
          variant={variant}
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
        />
      ) : null}
    </AnimatePresence>
  );
};

export { MotionDiv, BaseMotionEntryExit, BaseMotionBox };
