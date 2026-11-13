import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, makeSpace } from '~utils';

const StyledVoiceSlot = styled(BaseBox)<{ $shift: number }>(({ theme, $shift }) => ({
  display: 'flex',
  transform: `translateX(${makeSpace($shift)})`,
  transitionProperty: 'transform',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xmoderate)),
  transitionTimingFunction: castWebType(theme.motion.easing.entrance),
  '@media (prefers-reduced-motion: reduce)': {
    transitionDuration: '0ms',
  },
}));

/**
 * Holds the mic. While Send is hidden, the mic moves over into Send's place at the end of the
 * row, so an empty box has no gap after it. Once there is something to send, it slides back as
 * Send springs in. Instant with reduced motion.
 */
const ChatInputVoiceSlot = ({
  shift,
  children,
}: {
  /**
   * How far right to move the mic, in px: Send's width plus the gap while Send is hidden, else 0
   */
  shift: number;
  children: React.ReactElement;
}): React.ReactElement => <StyledVoiceSlot $shift={shift}>{children}</StyledVoiceSlot>;

export { ChatInputVoiceSlot };
