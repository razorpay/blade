import styled from 'styled-components/native';
import Animated, {
  EasingFn,
  useAnimatedStyle,
  useSharedValue,
  Keyframe,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
// import type { CSSObject } from 'styled-components';
import { makeBorderSize } from '~utils';
import { useTheme } from '~components/BladeProvider';
import type { ActionStates } from '~tokens/theme/theme';

const BaseInputStyledAnimatedBorder = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  opacity: 1,
  backgroundColor: theme.colors.brand.primary[500],
  height: makeBorderSize(theme.border.width.thin),
}));

export const BaseInputAnimatedBorder = ({
  currentInteraction,
}: {
  currentInteraction: keyof ActionStates;
}): ReactNode => {
  const { theme } = useTheme();
  // const borderAnimationEasing = (theme.motion.easing.standard.effective as unknown) as EasingFn;

  // const scaleBorder = new Keyframe({
  //   from: {
  //     width: 0,
  //     // right: -100,
  //     opacity: 0,
  //     easing: borderAnimationEasing,
  //   },
  //   to: {
  //     width: 100,
  //     // right: 0,
  //     opacity: 1,
  //     easing: borderAnimationEasing,
  //   },
  // }).duration(theme.motion.duration.moderate);

  // const fadeOutBorder = new Keyframe({
  //   from: {
  //     opacity: 1,
  //     easing: borderAnimationEasing,
  //   },
  //   to: {
  //     opacity: 0,
  //     easing: borderAnimationEasing,
  //   },
  // }).duration(theme.motion.duration.xquick);

  const widthTrigger = useSharedValue(0);
  const opacityTrigger = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(widthTrigger.value, [0, 1], [0, 100], {})}%`,
      opacity: interpolate(opacityTrigger.value, [0, 1], [0, 1], {}),
    };
  });

  // setTimeout(() => {
  //   widthTrigger.value = withTiming(1, {
  //     duration: 2000,
  //     easing: Easing.bezier(0.3, 0.0, 0.2, 1.0),
  //   });
  // }, 1000);

  // setTimeout(() => {
  //   opacityTrigger.value = withTiming(0, {
  //     duration: 2000,
  //     easing: Easing.bezier(0.3, 0.0, 0.2, 1.0),
  //   });
  // }, 5000);
  useEffect(() => {
    if (currentInteraction == 'focus') {
      widthTrigger.value = withTiming(1, {
        duration: 2000,
        easing: Easing.bezier(0.3, 0.0, 0.2, 1.0),
      });
    } else {
      opacityTrigger.value = withTiming(0, {
        duration: 2000,
        easing: Easing.bezier(0.3, 0.0, 0.2, 1.0),
      });
    }
  }, [currentInteraction, opacityTrigger, widthTrigger]);
  console.log(
    '🚀 ~ file: BaseInputAnimatedBorder.native.tsx ~ line 99 ~ currentInteraction',
    currentInteraction,
  );

  // let borderAnimation = null;
  // if (currentInteraction === 'focus') {
  //   borderAnimation = borderAnimationOnFocus;
  // } else if (currentInteraction === 'default') {
  //   borderAnimation = borderAnimationOnBlur;
  // }

  return currentInteraction === 'focus' ? (
    <BaseInputStyledAnimatedBorder style={animatedStyle} />
  ) : null;
};
