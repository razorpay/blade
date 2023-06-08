/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { Side } from '@floating-ui/react-native';
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { Modal, Pressable, TouchableOpacity } from 'react-native';
import type { EasingFn } from 'react-native-reanimated';
import Animated, { Keyframe } from 'react-native-reanimated';
import { TooltipArrow } from './TooltipArrowNative';
import { TooltipContent } from './TooltipContent';
import { TooltipProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { useTheme } from '~components/BladeProvider';

const Tooltip = ({
  content,
  children,
  placement = 'left',
  shouldWrapChildren,
  onOpenChange,
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const gap = theme.spacing[2];
  const [side] = placement.split('-') as [Side];
  const isHorizontal = side === 'left' || side === 'right';
  const arrowRef = React.useRef();
  const context = useFloating({
    sameScrollView: false,
    middleware: [
      shift({ crossAxis: false, padding: gap }),
      flip({ padding: gap }),
      offset(gap + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? 0 : ARROW_WIDTH,
      }),
    ],
    placement,
  });

  const { refs, floatingStyles } = context;

  const handleOpen = React.useCallback(() => {
    setIsOpen(true);
    onOpenChange?.({ isOpen: true });
  }, [onOpenChange]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    onOpenChange?.({ isOpen: false });
  }, [onOpenChange]);

  // wait for animation to finish before unmounting modal
  const [isVisible, setIsVisible] = React.useState(() => isOpen);
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (!isOpen) {
        setIsVisible(false);
      }
    }, theme.motion.duration.gentle);

    if (isOpen) {
      setIsVisible(true);
    }
    return () => clearTimeout(id);
  }, [isOpen]);

  // Animations
  const easing = (theme.motion.easing.entrance.effective as unknown) as EasingFn;
  const duration = theme.motion.duration.quick;

  const FadeInTop = new Keyframe({
    from: {
      opacity: 0,
      transform: [{ translateY: 0 }],
      easing,
    },
    to: {
      opacity: 1,
      transform: [{ translateY: 10 }],
      easing,
    },
  });

  const FadeInBottom = new Keyframe({
    from: {
      opacity: 0,
      transform: [{ translateY: 10 }],
      easing,
    },
    to: {
      opacity: 1,
      transform: [{ translateY: 0 }],
      easing,
    },
  });

  const FadeOutTop = new Keyframe({
    from: {
      opacity: 1,
      transform: [{ translateY: 10 }],
      easing,
    },
    to: {
      opacity: 0,
      transform: [{ translateY: 0 }],
      easing,
    },
  });

  const FadeOutBottom = new Keyframe({
    from: {
      opacity: 1,
      transform: [{ translateY: 0 }],
      easing,
    },
    to: {
      opacity: 0,
      transform: [{ translateY: 10 }],
      easing,
    },
  });

  const FadeInLeft = new Keyframe({
    from: {
      opacity: 0,
      transform: [{ translateX: 0 }],
      easing,
    },
    to: {
      opacity: 1,
      transform: [{ translateX: 10 }],
      easing,
    },
  });

  const FadeInRight = new Keyframe({
    from: {
      opacity: 0,
      transform: [{ translateX: 10 }],
      easing,
    },
    to: {
      opacity: 1,
      transform: [{ translateX: 0 }],
      easing,
    },
  });

  const FadeOutLeft = new Keyframe({
    from: {
      opacity: 1,
      transform: [{ translateX: 10 }],
      easing,
    },
    to: {
      opacity: 0,
      transform: [{ translateX: 0 }],
      easing,
    },
  });

  const FadeOutRight = new Keyframe({
    from: {
      opacity: 1,
      transform: [{ translateX: 0 }],
      easing,
    },
    to: {
      opacity: 0,
      transform: [{ translateX: 10 }],
      easing,
    },
  });

  const animations = {
    enter: {
      left: FadeInLeft.duration(duration),
      right: FadeInRight.duration(duration),
      top: FadeInTop.duration(duration),
      bottom: FadeInBottom.duration(duration),
    },
    exit: {
      left: FadeOutLeft.duration(duration),
      right: FadeOutRight.duration(duration),
      top: FadeOutTop.duration(duration),
      bottom: FadeOutBottom.duration(duration),
    },
  };

  return (
    <>
      {shouldWrapChildren ? (
        <Pressable
          style={{ alignSelf: 'flex-start' }}
          // using touch end instead of start so that if the the children is interactive
          // it's events will get triggered also
          onTouchEnd={handleOpen}
          ref={refs.setReference}
          collapsable={false}
        >
          {children}
        </Pressable>
      ) : (
        React.cloneElement(children, {
          onTouchEnd: handleOpen,
          ref: refs.setReference,
          style: { alignSelf: 'flex-start' },
          collapse: false,
        })
      )}
      <Modal collapsable={false} transparent visible={isVisible}>
        <TouchableOpacity
          style={{
            flexShrink: 0,
            flex: 1,
          }}
          onPress={handleClose}
          activeOpacity={1}
        >
          {isOpen ? (
            <Animated.View entering={animations.enter[side]} exiting={animations.exit[side]}>
              <TooltipContent
                ref={refs.setFloating}
                style={floatingStyles}
                arrow={<TooltipArrow context={context} ref={arrowRef as never} />}
              >
                {content}
              </TooltipContent>
            </Animated.View>
          ) : null}
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export { Tooltip, TooltipProps };
