import { mergeRefs } from '@mantine/hooks';
import { AnimatePresence } from 'motion/react';
import React from 'react';
import { BaseMotionBox } from './BaseMotionBox';
import type { BaseMotionBoxProps, BaseMotionEntryExitProps, MotionMeta } from './types';

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
  shouldUnmountWhenHidden = false,
}: BaseMotionEntryExitProps) => {
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
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
          _motionMeta={motionMeta}
          {...(shouldUnmountWhenHidden
            ? {}
            : { conditionalAnimate: isVisible ? 'animate' : 'exit' })}
        />
      ) : null}
    </AnimateWrapper>
  );
};

export { BaseMotionEntryExit, BaseMotionBox, BaseMotionEnhancerBox };
