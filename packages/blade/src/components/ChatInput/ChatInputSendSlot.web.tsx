import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';

const StyledSendSlot = styled(BaseBox)<{ $isVisible: boolean }>(({ theme, $isVisible }) => {
  const quick = castWebType(makeMotionTime(theme.motion.duration.quick));
  return {
    display: 'flex',
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'scale(1)' : 'scale(0.3)',
    // hidden Send is out of the tab order and the accessibility tree, and its slot keeps its
    // width, so the text box never moves when Send appears
    visibility: $isVisible ? 'visible' : 'hidden',
    transitionProperty: 'opacity, transform, visibility',
    // in: springs up from 0.3x with a slight overshoot; out: shrinks away quickly
    transitionDuration: $isVisible
      ? `${quick}, ${castWebType(makeMotionTime(theme.motion.duration.gentle))}, ${quick}`
      : quick,
    transitionTimingFunction: $isVisible
      ? `${castWebType(theme.motion.easing.entrance)}, ${castWebType(
          theme.motion.easing.overshoot,
        )}, ${castWebType(theme.motion.easing.entrance)}`
      : castWebType(theme.motion.easing.exit),
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '0ms',
    },
  };
});

/**
 * Holds Send: once there is something to send it springs up from a third of its size, and when the
 * box is empty again it shrinks away. Instant with reduced motion.
 */
const ChatInputSendSlot = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactElement;
}): React.ReactElement => {
  return (
    <StyledSendSlot $isVisible={isVisible} aria-hidden={isVisible ? undefined : true}>
      {children}
    </StyledSendSlot>
  );
};

export { ChatInputSendSlot };
