/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { DefaultTheme, Keyframes } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';

const pulseKeyframes = ({
  theme,
  contrast,
}: {
  theme: DefaultTheme;
  contrast: 'low' | 'high';
}): Keyframes => keyframes`
  0% {
    background-color: ${theme.colors.brand.gray.a100[`${contrast}Contrast`]};
  }
  25% {
    background-color: ${theme.colors.brand.gray.a100[`${contrast}Contrast`]};
  }
  100% {
    background-color: ${theme.colors.brand.gray.a50[`${contrast}Contrast`]};
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

const PulseAnimation = styled(BaseBox)<{ contrast: 'low' | 'high' }>(({ theme, contrast }) => {
  // We need to delay the animation in between keyframes
  // Since we also offset the animation to have 300ms delay in 25% keyframe
  // https://css-tricks.com/css-keyframe-animation-delay-iterations/
  const delay = 300;
  const duration = castWebType(makeMotionTime(theme.motion.duration['2xgentle'] + delay));
  const easing = castWebType(theme.motion.easing.standard.effective);

  return css`
    opacity: 0;
    background-color: ${theme.colors.brand.gray.a100[`${contrast}Contrast`]};
    animation-name: ${fadeInKeyframes()}, ${pulseKeyframes({ contrast, theme })};
    animation-duration: 900ms, ${duration};
    animation-delay: 0ms, 900ms;
    animation-timing-function: ${easing}, ${easing};
    animation-iteration-count: 1, infinite;
    animation-direction: normal, alternate;
    animation-fill-mode: forwards;
  `;
});

export { PulseAnimation };
