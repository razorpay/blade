/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { DefaultTheme, Keyframes } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';

const pulseKeyframes = ({ theme }: { theme: DefaultTheme }): Keyframes => keyframes`
  0% {
    background-color: ${theme.colors.interactive.background.gray.default};
  }
  25% {
    background-color: ${theme.colors.interactive.background.gray.default};
  }
  100% {
    background-color: ${theme.colors.interactive.background.gray.highlighted};
  }
`;

const fadeInKeyframes = (): Keyframes => keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const PulseAnimation = styled(BaseBox)(({ theme }) => {
  // We need to delay the animation in between keyframes
  // Since we also offset the animation to have 300ms delay in 25% keyframe
  // https://css-tricks.com/css-keyframe-animation-delay-iterations/
  const durationPluseOff = theme.motion.duration.xmoderate;
  const durationPulseOn = theme.motion.duration['2xgentle'];
  const totalDuration = castWebType(makeMotionTime(durationPulseOn + durationPluseOff));
  const duration = castWebType(makeMotionTime(theme.motion.duration['2xgentle']));
  const easing = castWebType(theme.motion.easing.standard);

  return css`
    opacity: 0;
    background-color: ${theme.colors.interactive.background.gray.default};
    animation-name: ${fadeInKeyframes()}, ${pulseKeyframes({ theme })};
    animation-duration: ${duration}, ${totalDuration};
    animation-delay: 0ms, ${duration};
    animation-timing-function: ${easing}, ${easing};
    animation-iteration-count: 1, infinite;
    animation-direction: normal, alternate;
    animation-fill-mode: forwards;
  `;
});

export { PulseAnimation };
