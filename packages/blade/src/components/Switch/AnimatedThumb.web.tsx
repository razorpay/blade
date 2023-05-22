/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DefaultTheme } from 'styled-components';
import styled, { keyframes, css } from 'styled-components';
import { switchColors } from './switchTokens';
import type { AnimatedThumbProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime, makeBorderSize, getIn } from '~utils';

const onAnimation = keyframes`
  0% {
    transform: translateX(0%);
    width: 100%;
  }
  30% {
    transform: translateX(10%);
    width: 125%;
  }
  100% {
    transform: translateX(100%);
    width: 100%;
  }
`;

const offAnimation = keyframes`
  0% {
    transform: translateX(100%);
    width: 100%;
  }
  30% {
    transform: translateX(70%);
    width: 125%;
  }
  100% {
    transform: translateX(0%);
    width: 100%;
  }
`;

const enter = (props: { theme: DefaultTheme }) => {
  return css`
    ${onAnimation} ${props.theme.motion.easing.standard.effective as string} forwards;
  `;
};
const exit = (props: { theme: DefaultTheme }) => {
  return css`
    ${offAnimation} ${props.theme.motion.easing.standard.effective as string} forwards;
  `;
};

const AnimatedThumb = styled(BaseBox)<AnimatedThumbProps>(
  ({ theme, isChecked, isDisabled, shouldRunAnimation }) => {
    const variant = isDisabled ? 'disabled' : 'default';
    const backgroundColor = getIn(theme, switchColors.thumb[variant].background);

    return css`
      width: 100%;
      height: 100%;
      border-radius: ${makeBorderSize(theme.border.radius.max)};
      animation: ${isChecked ? enter : exit};
      animation-duration: ${shouldRunAnimation
        ? makeMotionTime(theme.motion.duration.xquick)
        : '0ms'};
      background-color: ${backgroundColor};
    `;
  },
);

export { AnimatedThumb };
