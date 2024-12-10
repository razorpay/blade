/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import type { EasingFn } from 'react-native-reanimated';
import Animated, { Keyframe } from 'react-native-reanimated';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components/native';
import type { FadeProps } from './types';
import { useTheme } from '~components/BladeProvider';

const StyledFade = styled(Animated.View)<{ styles: CSSObject }>(({ styles }) => {
  return {
    ...styles,
  };
});

const Fade = ({ children, show, styles }: FadeProps) => {
  const { theme } = useTheme();

  const enterEasing = (theme.motion.easing.entrance as unknown) as EasingFn;
  const exitEasing = (theme.motion.easing.exit as unknown) as EasingFn;
  const scaleIn = new Keyframe({
    from: {
      transform: [{ scale: 0.3 }],
      opacity: 0,
      easing: enterEasing,
    },
    to: {
      transform: [{ scale: 1 }],
      opacity: 1,
      easing: enterEasing,
    },
  }).duration(theme.motion.duration.quick);

  const fadeOut = new Keyframe({
    from: {
      opacity: 1,
      easing: exitEasing,
    },
    to: {
      opacity: 0,
      easing: exitEasing,
    },
  }).duration(theme.motion.duration.quick);

  return show ? (
    <StyledFade styles={styles as CSSObject} entering={scaleIn} exiting={fadeOut}>
      {children}
    </StyledFade>
  ) : null;
};

export { Fade };
