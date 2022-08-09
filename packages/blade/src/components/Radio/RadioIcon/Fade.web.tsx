/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { FadeProps } from './Fade.d';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils';

const scaleIn = keyframes`
  from {
    transform: scale(.3);
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
    transform: scale(1);
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

  const enter = css`
    animation: ${scaleIn} ${makeMotionTime(theme.motion.duration.xquick)}
      ${theme.motion.easing.entrance.effective as string};
  `;

  const leave = css`
    animation: ${fadeOut} ${makeMotionTime(theme.motion.duration.xquick)}
      ${theme.motion.easing.exit.effective as string};
  `;

  // if show is undefined do not initialize the animation to prevent flash of animation
  const animation = show === undefined ? null : show ? enter : leave;

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
