import { mergeRefs } from '@mantine/hooks';
import { AnimatePresence, AnimationType, m as motion } from 'motion/react';
import React from 'react';
import styled from 'styled-components';
import { useAnimateInteractions } from '~components/AnimateInteractions/AnimateInteractionsProvider';
import { useStagger } from '~components/Stagger/StaggerProvider';
import type {
  BaseMotionBoxProps,
  BaseMotionEntryExitProps,
  MotionMeta,
  MotionTriggersType,
} from './types';

// Creating empty styled component so that the final component supports `as` prop
const StyledDiv = styled.div`
  display: inline-block;
`;
const MotionDiv = motion(StyledDiv);

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
}: {
  type: BaseMotionEntryExitProps['type'];
  motionTriggers: MotionTriggersType[];
}) => {
  const { isInsideAnimateInteractionsContainer } = useAnimateInteractions();
  const { isInsideStaggerContainer } = useStagger();
  const skipMotionOnCurrentElement =
    (isInsideAnimateInteractionsContainer && motionTriggers.includes('on-animate-interactions')) ||
    isInsideStaggerContainer;

  const shouldRenderAnimationVariables = !skipMotionOnCurrentElement;

  const animationVariables = React.useMemo(() => {
    if (!shouldRenderAnimationVariables) {
      return {};
    }

    const triggerProps = shouldRenderAnimationVariables
      ? motionTriggers?.reduce<Partial<Record<AnimationType, 'animate'>>>(
          (prevProps, currentTrigger) => {
            prevProps[
              motionTriggersArrayToGesturePropsMap[
                currentTrigger as Exclude<MotionTriggersType, 'on-animate-interactions'>
              ]
            ] = 'animate';
            return prevProps;
          },
          {},
        )
      : {};

    // When component is rendered inside stagger, we remove the initial, animate, exit props
    // otherwise they override the stagger behaviour and stagger does not work
    return {
      initial: type === 'in' || type === 'inout' ? 'initial' : undefined,
      exit: type === 'out' || type === 'inout' ? 'exit' : undefined,
      ...triggerProps,
    };
  }, [type, shouldRenderAnimationVariables]);

  return animationVariables;
};

const _BaseMotionBox: React.ForwardRefRenderFunction<HTMLDivElement, BaseMotionBoxProps> = (
  { children, motionVariants, type = 'inout', motionTriggers = ['mount'], ...rest },
  ref,
) => {
  const animationVariables = useAnimationVariables({
    type,
    motionTriggers,
  });

  console.log({
    motionVariants,
    motionTriggers,
    animationVariables,
  });

  return (
    <MotionDiv ref={ref} variants={motionVariants} {...animationVariables} {...rest}>
      {children}
    </MotionDiv>
  );
};

const BaseMotionBox = React.forwardRef(_BaseMotionBox);

const _BaseMotionEnhancerBox: React.ForwardRefRenderFunction<HTMLDivElement, BaseMotionBoxProps> = (
  { children, ...motionBoxArgs },
  ref,
) => {
  return (
    <BaseMotionBox
      ref={mergeRefs(children.props.ref, ref)}
      as={children.type}
      {...motionBoxArgs}
      // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
      {...children.props}
    />
  );
};

const BaseMotionEnhancerBox = React.forwardRef(_BaseMotionEnhancerBox);

const BaseMotionEntryExit = ({
  children,
  motionVariants,
  isVisible = true,
  type = 'inout',
  motionTriggers = ['mount'],
}: BaseMotionEntryExitProps) => {
  return (
    <AnimatePresence>
      {isVisible ? (
        <BaseMotionBox
          as={children.type}
          motionVariants={motionVariants}
          motionTriggers={motionTriggers}
          type={type}
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
          _motionMeta={
            {
              isEnhanced: true,
              // @ts-expect-error: ref does exist on children prop
              innerRef: children.ref,
            } as MotionMeta
          }
        />
      ) : null}
    </AnimatePresence>
  );
};

export { MotionDiv, BaseMotionEntryExit, BaseMotionBox, BaseMotionEnhancerBox };
