import { AnimatePresence, m as motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { useStagger } from '~components/Stagger/StaggerProvider';
import type { BaseMotionProps } from './types';

// Creating empty styled component so that the final component supports `as` prop
const StyledDiv = styled.div``;
const MotionDiv = motion(StyledDiv);

const useAnimationVariables = ({
  variant,
  isInsideStaggerContainer,
}: {
  variant: BaseMotionProps['variant'];
  isInsideStaggerContainer: boolean;
}) => {
  const animationVariables = React.useMemo(() => {
    // When component is rendered inside stagger, we remove the initial, animate, exit props
    // otherwise they override the stagger behaviour and stagger does not work
    return isInsideStaggerContainer
      ? {}
      : {
          initial: variant === 'in' || variant === 'inout' ? 'initial' : undefined,
          animate: 'animate',
          exit: variant === 'out' || variant === 'inout' ? 'exit' : undefined,
        };
  }, [variant, isInsideStaggerContainer]);

  return animationVariables;
};

const BaseMotionBox = ({
  children,
  motionVariants,
  isVisible = true,
  variant = 'inout',
}: BaseMotionProps) => {
  const { isInsideStaggerContainer } = useStagger();
  const animationVariables = useAnimationVariables({ variant, isInsideStaggerContainer });

  return (
    <AnimatePresence>
      {isVisible ? (
        <MotionDiv
          // kinda hack to build it as enhancer component
          as={children.type}
          variants={motionVariants}
          {...animationVariables}
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
        />
      ) : null}
    </AnimatePresence>
  );
};

export { MotionDiv, BaseMotionBox };
