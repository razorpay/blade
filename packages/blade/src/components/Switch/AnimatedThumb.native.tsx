/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components/native';
import getIn from 'lodash/get';
import React from 'react';
import isNumber from 'lodash/isNumber';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { switchColors, switchMotion, switchSizes } from './switchTokens';
import type { AnimatedThumbProps } from './types';
import { useBreakpoint } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { makeBorderSize } from '~utils/makeBorderSize';

const StyledAnimatedThumb = styled(Animated.View)<{ isDisabled?: boolean }>(
  ({ theme, isDisabled }) => {
    const variant = isDisabled ? 'disabled' : 'default';
    const backgroundColor = getIn(theme, switchColors.thumb[variant].background);

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '100%',
      height: '100%',
      borderRadius: makeBorderSize(theme.border.radius.max),
      backgroundColor,
      position: 'absolute',
    };
  },
);

const AnimatedThumb = ({
  isChecked,
  isDisabled,
  size = 'medium',
  children,
  isPressed,
}: AnimatedThumbProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const sharedLeft = useSharedValue(isChecked ? 1 : 0);
  const sharedWidth = useSharedValue(isPressed ? 1 : 0);
  const sharedShouldShiftOffset = useSharedValue(Boolean(isChecked && isPressed));

  const easing = getIn(theme, switchMotion.easing.thumb);
  const duration = getIn(theme, switchMotion.duration.thumb);
  const thumbWidth = switchSizes.thumb[matchedDeviceType][size].width;
  const finalWidth = isNumber(thumbWidth) ? thumbWidth : getIn(theme, thumbWidth);

  React.useEffect(() => {
    sharedLeft.value = withTiming(isChecked ? 1 : 0, {
      duration,
      easing,
    });
  }, [isChecked]);

  React.useEffect(() => {
    sharedWidth.value = withTiming(isPressed ? 1 : 0, {
      duration,
      easing,
    });
  }, [isPressed]);

  React.useEffect(() => {
    sharedShouldShiftOffset.value = Boolean(isChecked && isPressed);
  }, [isChecked, isPressed]);

  const thumbAnimation = useAnimatedStyle(() => {
    return {
      width: interpolate(
        sharedWidth.value,
        [0, 1],
        // scale thumb by 25%, 1.25 comes from motion guidelines
        [finalWidth, finalWidth * 1.25],
      ),
      left: withTiming(
        // While on checked state, shift the thumb 25% to left because
        // We elongate the width 25% to right.
        sharedShouldShiftOffset.value ? finalWidth * -0.25 : 0,
        { easing, duration },
      ),
      transform: [
        {
          translateX: interpolate(sharedLeft.value, [0, 1], [0, finalWidth]),
        },
      ],
    };
  }, []);

  return (
    <StyledAnimatedThumb style={thumbAnimation} isDisabled={isDisabled}>
      {children}
    </StyledAnimatedThumb>
  );
};

export { AnimatedThumb };
