/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import usePresence from 'use-presence';
import type { FadeProps } from './Fade.d';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils';

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
    animation: ${fadeIn} ${makeMotionTime(duration)}
      ${theme.motion.easing.entrance.effective as string};
  `;

  const exit = css`
    animation: ${fadeOut} ${makeMotionTime(duration)}
      ${theme.motion.easing.exit.effective as string};
  `;

  const { isMounted, isVisible } = usePresence(!!show, {
    transitionDuration: duration,
    initialEnter: true,
  });

  return (
    <>
      {isMounted && (
        <AnimatedFade animationType={isVisible ? enter : exit} style={styles}>
          {children}
        </AnimatedFade>
      )}
    </>
  );
};

export { Fade };
