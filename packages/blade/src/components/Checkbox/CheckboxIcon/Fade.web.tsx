/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { FadeProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils/makeMotionTime';

const fadeIn = keyframes`
  from {
    transform: scale(.6);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(.6);
    opacity: 0;
  }
`;

const AnimatedFade = styled.div<{ animationType: FlattenSimpleInterpolation | null }>(
  ({ animationType }) =>
    animationType === null
      ? ''
      : css`
          ${animationType}
        `,
);

const Fade = ({ show, children, styles }: FadeProps) => {
  const { theme } = useTheme();

  const duration = theme.motion.duration.xquick;
  const enter = css`
    animation: ${fadeIn} ${makeMotionTime(duration)} ${theme.motion.easing.entrance as string};
  `;

  const exit = css`
    animation: ${fadeOut} ${makeMotionTime(duration)} ${theme.motion.easing.exit as string};
  `;

  // if show is undefined do not initialize the animation to prevent flash of animation
  const animation = show === undefined ? null : show ? enter : exit;

  return (
    <AnimatedFade
      animationType={animation}
      style={{
        opacity: show ? 1 : 0,
        ...styles,
      }}
    >
      {children}
    </AnimatedFade>
  );
};

export { Fade };
