import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import type { StyledFileUploadWrapperProps } from './types';
import {
  fileUploadColorTokens,
  fileUploadHeightTokens,
  fileUploadMotionTokens,
} from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';

type StyledFileUploadWrapperNativeProps = Omit<StyledFileUploadWrapperProps, 'theme'> & {
  style?: Record<string, unknown>;
};

const StyledFileUploadWrapper = ({
  isDisabled,
  isActive,
  size,
  children,
  style,
}: StyledFileUploadWrapperNativeProps): React.ReactElement => {
  const { theme } = useTheme();
  const progress = useSharedValue(isActive ? 1 : 0);

  const duration = getIn(theme.motion, fileUploadMotionTokens.duration);
  const easingFn = getIn(theme.motion, fileUploadMotionTokens.easing);

  React.useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration,
      easing: castNativeType(easingFn),
    });
  }, [isActive, duration, easingFn]);

  const borderColor = getIn(
    theme.colors,
    fileUploadColorTokens.border[isDisabled ? 'disabled' : 'default'],
  );

  const activeBgColor = getIn(theme.colors, fileUploadColorTokens.background.active);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', activeBgColor]),
    };
  });

  return (
    <Animated.View
      style={[
        {
          // Note: borderStyle 'dashed' is not supported on Android in RN <= 0.72 and silently falls back to 'solid'.
          // iOS renders a dashed border correctly; Android will show a solid border.
          borderStyle: 'dashed' as const,
          borderColor,
          borderWidth: 1,
          borderRadius: theme.border.radius.medium,
          // Raw numeric size tokens (e.g. 56/64) — Animated.View style expects numbers,
          // unlike BaseBox which accepts makeSize()'s `${n}px` strings.
          minHeight: size === 'variable' ? undefined : fileUploadHeightTokens[size],
          display: 'flex' as const,
          flexDirection: 'row' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export { StyledFileUploadWrapper };
