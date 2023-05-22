import styled from 'styled-components/native';
import React from 'react';
import isNumber from 'lodash/isNumber';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { switchColors, switchSizes } from './switchTokens';
import type { AnimatedThumbProps } from './types';
import { castNativeType, getIn, makeBorderSize, useBreakpoint } from '~utils';
import { useTheme } from '~components/BladeProvider';

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
}: AnimatedThumbProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const translateX = useSharedValue(isChecked ? 1 : 0);

  const easingIn = castNativeType(theme.motion.easing.standard.effective);
  const easingOut = castNativeType(theme.motion.easing.standard.effective);
  const thumbWidth = switchSizes.thumb[matchedDeviceType][size].width;
  const finalWidth = isNumber(thumbWidth) ? thumbWidth : getIn(theme, thumbWidth);

  React.useEffect(() => {
    translateX.value = withTiming(isChecked ? 1 : 0, {
      duration: theme.motion.duration.xquick,
      easing: isChecked ? easingIn : easingOut,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked]);

  const thumbAnimation = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateX.value,
        [0, 0.3, 1],
        [finalWidth, finalWidth * 1.25, finalWidth],
      ),
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [0, 0.3, 1],
            [0 * finalWidth, 0.1 * finalWidth, 1 * finalWidth],
          ),
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
