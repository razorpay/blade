import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { StyledFileUploadWrapperProps } from './types';
import { fileUploadColorTokens, fileUploadMotionTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';

type StyledFileUploadWrapperNativeProps = Omit<StyledFileUploadWrapperProps, 'theme'> & {
  style?: Record<string, unknown>;
};

const StyledFileUploadWrapper = ({
  isDisabled,
  isActive,
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
      easing: easingFn,
    });
  }, [isActive, duration]);

  const borderColor = getIn(
    theme.colors,
    fileUploadColorTokens.border[isDisabled ? 'disabled' : 'default'],
  );

  const activeBgColor = getIn(theme.colors, fileUploadColorTokens.background.active);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        progress.value > 0.5 ? activeBgColor : 'transparent',
      opacity: 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          borderStyle: 'dashed' as const,
          borderColor,
          borderWidth: 1,
          borderRadius: 8,
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
