import { AnimatePresence, AnimationType, m as motion } from 'motion/react';
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
  shouldRenderAnimationVariables,
  motionTriggers,
}: {
  variant: BaseMotionEntryExitProps['variant'];
  motionTriggers: BaseMotionEntryExitProps['motionTriggers'];
  shouldRenderAnimationVariables: BaseMotionBoxProps['shouldRenderAnimationVariables'];
}) => {
  const animationVariables = React.useMemo(() => {
    if (!shouldRenderAnimationVariables) {
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
  }, [variant, shouldRenderAnimationVariables]);

  return animationVariables;
};

const BaseMotionBox = ({
  children,
  motionVariants,
  variant = 'inout',
  motionTriggers = ['mount'],
  shouldRenderAnimationVariables,
  speed,
  ...rest
}: BaseMotionBoxProps) => {
  const animationVariables = useAnimationVariables({
    variant,
    shouldRenderAnimationVariables,
    motionTriggers,
  });

  console.log({ animationVariables, motionTriggers, variant });

  return (
    <MotionDiv
      // kinda hack to build it as enhancer component
      variants={motionVariants}
      {...animationVariables}
      {...rest}
      tabIndex={0}
    >
      {children}
    </MotionDiv>
  );
};

const BaseMotionEnhancerBox = ({ children, ...props }) => {
  return <BaseMotionBox as={children.type} {...props} {...children.props} />;
};

const BaseMotionEntryExit = ({
  children,
  motionVariants,
  isVisible = true,
  variant = 'inout',
  motionTriggers = ['mount'],
}: BaseMotionEntryExitProps) => {
  const { isInsideAnimateInteractionsContainer } = useAnimateInteractions();
  const { isInsideStaggerContainer } = useStagger();

  return (
    <AnimatePresence>
      {isVisible ? (
        <BaseMotionBox
          // kinda hack to build it as enhancer component
          as={children.type}
          motionVariants={motionVariants}
          motionTriggers={motionTriggers}
          variant={variant}
          shouldRenderAnimationVariables={
            !isInsideAnimateInteractionsContainer && !isInsideStaggerContainer
          }
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
        />
      ) : null}
    </AnimatePresence>
  );
};

export { MotionDiv, BaseMotionEntryExit, BaseMotionBox, BaseMotionEnhancerBox };
