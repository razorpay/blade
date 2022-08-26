import styled from 'styled-components/native';
import type { EasingFn } from 'react-native-reanimated';
import Animated, { Keyframe } from 'react-native-reanimated';
import type { ReactNode } from 'react';
// import type { CSSObject } from 'styled-components';
import { makeBorderSize } from '~utils';
import { useTheme } from '~components/BladeProvider';
import type { ActionStates } from '~tokens/theme/theme';

const BaseInputStyledAnimatedBorder = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  // right: 0,
  opacity: 0,
  width: 0,
  backgroundColor: theme.colors.brand.primary[500],
  height: makeBorderSize(theme.border.width.thin),
}));

export const BaseInputAnimatedBorder = ({
  currentInteraction,
}: {
  currentInteraction: keyof ActionStates;
}): ReactNode => {
  const { theme } = useTheme();
  const borderAnimationEasing = (theme.motion.easing.standard.effective as unknown) as EasingFn;

  const scaleBorder = new Keyframe({
    from: {
      width: 0,
      // right: -100,
      opacity: 0,
      easing: borderAnimationEasing,
    },
    to: {
      width: 100,
      // right: 0,
      opacity: 1,
      easing: borderAnimationEasing,
    },
  }).duration(theme.motion.duration.moderate);

  const fadeOutBorder = new Keyframe({
    from: {
      opacity: 1,
      easing: borderAnimationEasing,
    },
    to: {
      opacity: 0,
      easing: borderAnimationEasing,
    },
  }).duration(theme.motion.duration.xquick);

  // let borderAnimation = null;
  // if (currentInteraction === 'focus') {
  //   borderAnimation = borderAnimationOnFocus;
  // } else if (currentInteraction === 'default') {
  //   borderAnimation = borderAnimationOnBlur;
  // }

  return currentInteraction === 'focus' ? (
    <BaseInputStyledAnimatedBorder entering={scaleBorder} exiting={fadeOutBorder} />
  ) : null;
};
