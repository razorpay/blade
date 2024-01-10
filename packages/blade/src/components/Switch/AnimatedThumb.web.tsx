import styled, { css } from 'styled-components';
import { switchColors, switchMotion } from './switchTokens';
import type { AnimatedThumbProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { BaseBox } from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { makeBorderSize } from '~utils/makeBorderSize';

const AnimatedThumb = styled(BaseBox)<AnimatedThumbProps>(
  ({ theme, isChecked, isDisabled, isPressed }) => {
    const variant = isDisabled ? 'disabled' : 'default';
    const backgroundColor = getIn(theme, switchColors.thumb[variant].background);
    const duration = makeMotionTime(getIn(theme, switchMotion.duration.thumb));
    // offset the thumb x% left because we change the width and width changes from the center origin of thumb
    const offset = isChecked ? '-39%' : '12.5%';
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      height: 100%;
      position: relative;
      will-change: transform, left;
      width: ${isPressed ? '125%' : '100%'};
      left: ${isPressed ? offset : '0%'};
      transform: translateX(${isChecked ? '100%' : '0%'});
      transition: ${duration};
      border-radius: ${makeBorderSize(theme.border.radius.max)};
      animation-duration: ${duration};
      background-color: ${backgroundColor};
    `;
  },
);

export { AnimatedThumb };
