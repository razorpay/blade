import styled, { css } from 'styled-components';
import { switchColors, switchMotion } from './switchTokens';
import type { AnimatedThumbProps } from './types';
import { BaseBox } from '~components/Box/BaseBox';
import { makeMotionTime, makeBorderSize, getIn } from '~utils';

const AnimatedThumb = styled(BaseBox)<AnimatedThumbProps>(
  ({ theme, isChecked, isDisabled, isPressed }) => {
    const variant = isDisabled ? 'disabled' : 'default';
    const backgroundColor = getIn(theme, switchColors.thumb[variant].background);
    const duration = makeMotionTime(getIn(theme, switchMotion.duration.thumb));
    // offset the thumb 10% left because we change the width
    const offset = isChecked ? '-10%' : '10%';
    // TODO: check if shouldRunAnimation is needed anymore
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 100%;
      height: 100%;
      position: relative;
      left: ${isChecked ? '100%' : '0%'};
      width: ${isPressed ? '125%' : '100%'};
      transform: translateX(${isPressed ? offset : '0%'});
      transition: ${duration};
      border-radius: ${makeBorderSize(theme.border.radius.max)};
      animation-duration: ${duration};
      background-color: ${backgroundColor};
    `;
  },
);

export { AnimatedThumb };
