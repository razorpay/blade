import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';

const StyledSendSlot = styled(BaseBox)<{ $isVisible: boolean }>(({ theme, $isVisible }) => ({
  display: 'flex',
  opacity: $isVisible ? 1 : 0,
  transform: $isVisible ? 'scale(1)' : 'scale(0.8)',
  // hidden Send is out of the tab order and the accessibility tree, and its slot keeps its width,
  // so the text box never moves when Send appears
  visibility: $isVisible ? 'visible' : 'hidden',
  transitionProperty: 'opacity, transform, visibility',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
  '@media (prefers-reduced-motion: reduce)': {
    transitionDuration: '0ms',
  },
}));

/**
 * Holds Send: it fades and grows in once there is something to send, and fades out when the box
 * is empty again. Instant with reduced motion.
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
