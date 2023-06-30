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
    background-color: ${theme.colors.brand.gray[300][`${contrast}Contrast`]};
  }
  100% {
    background-color: ${theme.colors.brand.gray[400][`${contrast}Contrast`]};
  }
`;

const PulseAnimation = styled(BaseBox)<{ contrast: 'low' | 'high' }>(({ theme, contrast }) => {
  const duration = castWebType(makeMotionTime(theme.motion.duration['2xgentle']));
  const easing = castWebType(theme.motion.easing.standard.revealing);

  return css`
    background-color: ${theme.colors.brand.gray[300][`${contrast}Contrast`]};
    animation: ${pulseKeyframes({ contrast, theme })} ${duration} ${easing} infinite alternate;
  `;
});

export { PulseAnimation };
