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

  const fadeInEasing = (theme.motion.easing.entrance as unknown) as EasingFn;
  const fadeOutEasing = (theme.motion.easing.exit as unknown) as EasingFn;
  const fadeIn = new Keyframe({
    from: {
      transform: [{ scale: 0.6 }],
      opacity: 0,
      easing: fadeInEasing,
    },
    to: {
      transform: [{ scale: 1 }],
      opacity: 1,
      easing: fadeInEasing,
    },
  }).duration(theme.motion.duration.quick);

  const fadeOut = new Keyframe({
    from: {
      transform: [{ scale: 1 }],
      opacity: 1,
      easing: fadeOutEasing,
    },
    to: {
      transform: [{ scale: 0.6 }],
      opacity: 0,
      easing: fadeOutEasing,
    },
  }).duration(theme.motion.duration.quick);

  return show ? (
    <StyledFade styles={styles as CSSObject} entering={fadeIn} exiting={fadeOut}>
      {children}
    </StyledFade>
  ) : null;
};

export { Fade };
