/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components/native';
import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import isNumber from '~utils/lodashButBetter/isNumber';
import getIn from '~utils/lodashButBetter/get';
import { useBreakpoint } from '~utils';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { AnimatedThumbProps } from './types';
import { switchColors, switchMotion, switchSizes } from './switchTokens';
import { useTheme } from '~components/BladeProvider';

const StyledAnimatedThumb = styled(Animated.View)<{
  isDisabled?: boolean;
  _thumbWidth?: number;
  _thumbHeight?: number;
}>(({ theme, isDisabled, _thumbWidth, _thumbHeight }) => {
  const variant = isDisabled ? 'disabled' : 'default';
  const backgroundColor = getIn(theme, switchColors.thumb[variant].background);

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    // Explicit dimensions prevent '100%' from resolving to the track size (not Thumb)
    // which would produce an oval. Falls back to '100%' before device type is resolved.
    width: _thumbWidth || ('100%' as never),
    height: _thumbHeight || ('100%' as never),
    borderRadius: makeBorderSize(theme.border.radius.max),
    backgroundColor,
    position: 'absolute',
  };
});

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
  const thumbWidthToken = switchSizes.thumb[matchedDeviceType][size].width;
  const thumbHeightToken = switchSizes.thumb[matchedDeviceType][size].height;
  const finalWidth = isNumber(thumbWidthToken)
    ? thumbWidthToken
    : (getIn(theme, thumbWidthToken) as number);
  const finalHeight = isNumber(thumbHeightToken)
    ? thumbHeightToken
    : (getIn(theme, thumbHeightToken) as number);

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

  // finalWidth must be in deps: useBreakpoint initialises with 'desktop' then updates to 'mobile'
  // after mount, so the worklet would otherwise capture a stale desktop finalWidth value.
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
  }, [finalWidth]);

  return (
    <StyledAnimatedThumb
      style={thumbAnimation}
      isDisabled={isDisabled}
      _thumbWidth={finalWidth}
      _thumbHeight={finalHeight}
    >
      {children}
    </StyledAnimatedThumb>
  );
};

export { AnimatedThumb };
