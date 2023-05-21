/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DefaultTheme } from 'styled-components';
import styled, { keyframes, css } from 'styled-components';
import { switchColors } from './switchTokens';
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
    ${onAnimation} ${makeMotionTime(props.theme.motion.duration.xquick)} ${props.theme.motion.easing
      .standard.effective as string} forwards;
  `;
};
const exit = (props: { theme: DefaultTheme }) => {
  return css`
    ${offAnimation} ${makeMotionTime(props.theme.motion.duration.xquick)} ${props.theme.motion
      .easing.standard.effective as string} forwards;
  `;
};

const AnimatedThumb = styled(BaseBox)<{
  isChecked?: boolean;
  isDisabled?: boolean;
  size: 'small' | 'medium';
}>(({ theme, isChecked, isDisabled }) => {
  const variant = isDisabled ? 'disabled' : 'default';
  const backgroundColor = getIn(theme, switchColors.thumb[variant].background);

  return css`
    width: 100%;
    height: 100%;
    border-radius: ${makeBorderSize(theme.border.radius.max)};
    transform: translateX(0%);
    animation: ${isChecked ? enter : exit};
    background-color: ${backgroundColor};
  `;
});

export { AnimatedThumb };
