import type { DefaultTheme, FlattenSimpleInterpolation } from 'styled-components';
import styled, { keyframes, css } from 'styled-components';
import { switchColors, switchMotion } from './switchTokens';
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

const enter = (props: { theme: DefaultTheme }): FlattenSimpleInterpolation => {
  return css`
    ${onAnimation} ${getIn(props.theme, switchMotion.easing.thumb)} forwards;
  `;
};
const exit = (props: { theme: DefaultTheme }): FlattenSimpleInterpolation => {
  return css`
    ${offAnimation} ${getIn(props.theme, switchMotion.easing.thumb)} forwards;
  `;
};

const AnimatedThumb = styled(BaseBox)<AnimatedThumbProps>(
  ({ theme, isChecked, isDisabled, shouldRunAnimation }) => {
    const variant = isDisabled ? 'disabled' : 'default';
    const backgroundColor = getIn(theme, switchColors.thumb[variant].background);
    const duration = makeMotionTime(getIn(theme, switchMotion.duration.thumb));
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 100%;
      height: 100%;
      border-radius: ${makeBorderSize(theme.border.radius.max)};
      animation: ${isChecked ? enter : exit};
      animation-duration: ${shouldRunAnimation ? duration : '0ms'};
      background-color: ${backgroundColor};
    `;
  },
);

export { AnimatedThumb };
