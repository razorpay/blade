/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import usePresence from 'use-presence';
import type { FadeProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils/makeMotionTime';

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

  const duration = theme.motion.duration.xquick;
  const enter = css`
    animation: ${scaleIn} ${makeMotionTime(duration)} ${theme.motion.easing.entrance as string};
  `;

  const exit = css`
    animation: ${fadeOut} ${makeMotionTime(duration)} ${theme.motion.easing.exit as string};
  `;

  // usePresence hook waits for the animation to finish before unmounting the component
  // It's similar to motion/react's usePresence hook
  // https://www.framer.com/docs/animate-presence/#usepresence
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
