import React from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { mergeRefs } from '@mantine/hooks';
import type { BaseMotionBoxProps, MotionMeta, BaseMotionEntryExitProps } from './types';
import { makeAnimationVariables, useMotionVariants } from './baseMotionUtils';
import { useAnimateInteractions } from '~components/AnimateInteractions/AnimateInteractionsProvider';
import { useStagger } from '~components/Stagger/StaggerProvider';
import type { BladeElementRef } from '~utils/types';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles';
import type { BoxProps } from '~components/Box';
import type { Theme } from '~components/BladeProvider';

// Creating empty styled component so that the final component supports `as` prop
const StyledDiv = styled.div((props: BoxProps & { theme: Theme }) => {
  // We're turning normal div into Box here because our BaseBox does not forward the props to next component which is needed for enhancer component wrapper
  const boxStyles = useMemoizedStyles(props);
  return boxStyles;
});

const MotionDiv = motion(StyledDiv);

const _BaseMotionBox = (
  {
    children,
    motionVariants: userMotionVariants,
    type = 'inout',
    motionTriggers = ['mount'],
    animateVisibility,
    ...rest
  }: BaseMotionBoxProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { isInsideAnimateInteractionsContainer } = useAnimateInteractions();
  const { isInsideStaggerContainer, staggerType } = useStagger();
  const shouldSkipAnimationVariables =
    (isInsideAnimateInteractionsContainer && motionTriggers.includes('on-animate-interactions')) ||
    isInsideStaggerContainer;

  const animationVariables = shouldSkipAnimationVariables
    ? {}
    : makeAnimationVariables(motionTriggers, {
        animateVisibility,
      });

  const motionVariants = useMotionVariants(
    userMotionVariants,
    isInsideStaggerContainer ? staggerType : type,
  );

  return (
    <MotionDiv
      ref={ref as never}
      viewport={{ amount: 0.8, once: true }}
      variants={motionVariants}
      {...animationVariables}
      {...rest}
    >
      {children}
    </MotionDiv>
  );
};

/**
 * Base motion component that handles animation variables, reduced motion, type and motionTriggers prop, etc
 */
const BaseMotionBox = React.forwardRef(_BaseMotionBox);

const _BaseMotionEnhancerBox: React.ForwardRefRenderFunction<HTMLDivElement, BaseMotionBoxProps> = (
  { children, ...motionBoxArgs },
  ref,
) => {
  return (
    <BaseMotionBox
      // we need the ref of this item in AnimateInteractions to pass down ref that adds focusWithin logic
      ref={mergeRefs(children.props.ref, ref)}
      as={children.type}
      {...motionBoxArgs}
      // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
      {...children.props}
    />
  );
};

/**
 * Used in AnimateInteraction, Scale, etc
 *
 * Enhances the child to add motion support
 */
const BaseMotionEnhancerBox = React.forwardRef(_BaseMotionEnhancerBox);

/**
 * Base component for entry / exit animations
 *
 * Handles states, entry exit controls, animation variables, mount / unmount, etc
 */
const BaseMotionEntryExit = ({
  children,
  motionVariants,
  isVisible = true,
  type = 'inout',
  motionTriggers = ['mount'],
  shouldUnmountWhenHidden = false,
}: BaseMotionEntryExitProps): React.ReactElement => {
  // Only need AnimatePresence when we have to unmount the component
  const AnimateWrapper = shouldUnmountWhenHidden ? AnimatePresence : React.Fragment;
  // keep it always mounted when shouldUnmountWhenHidden is false
  const isMounted = shouldUnmountWhenHidden ? isVisible : true;

  const motionMeta: MotionMeta = React.useMemo(() => {
    return {
      isEnhanced: true,
      // @ts-expect-error: ref does exist on children prop
      innerRef: children.ref,
    };
    // @ts-expect-error: ref does exist on children prop
  }, [children.ref]);

  return (
    <AnimateWrapper>
      {isMounted ? (
        <BaseMotionBox
          as={children.type}
          motionVariants={motionVariants}
          motionTriggers={motionTriggers}
          type={type}
          {...(shouldUnmountWhenHidden
            ? {}
            : { animateVisibility: isVisible ? 'animate' : 'exit' })}
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
          _motionMeta={motionMeta}
        />
      ) : null}
    </AnimateWrapper>
  );
};

export { MotionDiv, BaseMotionBox, BaseMotionEnhancerBox, BaseMotionEntryExit };
