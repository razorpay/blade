import React from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { CSSProperties } from 'styled-components';
import type { GetFocusRingArgs, FocusRingWrapperProps } from './types';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import { castNativeType, makeMotionTime } from '~utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFocusRingStyles(_: GetFocusRingArgs): CSSProperties {
  // React Native uses FocusRingWrapper component for animated focus rings
  return {};
}

const FOCUS_RING_MAX_WIDTH = 4;

const FocusRingWrapper = ({
  isFocused,
  borderRadius,
  disabled,
  children,
}: FocusRingWrapperProps): React.ReactElement => {
  const { theme } = useTheme();
  const focusRingColor = getIn(theme.colors, 'surface.border.primary.muted');

  const motionConfig = {
    duration: castNativeType(makeMotionTime(getIn(theme.motion.duration, 'xgentle') as number)),
    easing: castNativeType(theme.motion.easing.emphasized),
  };

  const ringWidth = useSharedValue(0);

  React.useEffect(() => {
    ringWidth.value = withTiming(isFocused ? FOCUS_RING_MAX_WIDTH : 0, motionConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const focusRingStyle = useAnimatedStyle(() => ({
    top: -ringWidth.value,
    left: -ringWidth.value,
    right: -ringWidth.value,
    bottom: -ringWidth.value,
    borderRadius: borderRadius + ringWidth.value,
    borderWidth: ringWidth.value,
  }));

  return (
    <Animated.View style={{ width: '100%', position: 'relative' }}>
      {!disabled && (
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', borderColor: focusRingColor }, focusRingStyle]}
        />
      )}
      {children}
    </Animated.View>
  );
};

export { getFocusRingStyles, FocusRingWrapper };
