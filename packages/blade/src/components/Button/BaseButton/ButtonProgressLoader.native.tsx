import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ButtonShadowOverlay } from './ButtonShadowOverlay';
import type { ButtonCornerRadii } from './types';

type ButtonProgressLoaderProps = {
  duration: number;
  restColor: string;
  borderRadius: number;
  borderRadii?: ButtonCornerRadii;
  shadowHighlightColor?: string;
  shadowHighlightHeight?: number;
  shadowBottomColor?: string;
  shadowBottomHeight?: number;
  shadowBorderColor?: string;
  shadowRingWidth?: number;
  showGradient?: boolean;
  isInsetShadowSidesFlattened?: boolean;
};

const ButtonProgressLoader = ({
  duration,
  restColor,
  borderRadius,
  borderRadii,
  shadowHighlightColor,
  shadowHighlightHeight,
  shadowBottomColor,
  shadowBottomHeight,
  shadowBorderColor,
  shadowRingWidth,
  showGradient,
  isInsetShadowSidesFlattened,
}: ButtonProgressLoaderProps): React.ReactElement => {
  const progress = useSharedValue(1);

  React.useEffect(() => {
    progress.value = 1;
    progress.value = withTiming(0, {
      duration,
      easing: Easing.linear,
    });

    return () => {
      cancelAnimation(progress);
    };
  }, [duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        {
          zIndex: 0,
          overflow: 'hidden',
          borderRadius,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: restColor,
          },
          animatedStyle,
        ]}
      />
      {shadowBorderColor ? (
        <ButtonShadowOverlay
          borderRadius={borderRadius}
          borderRadii={borderRadii}
          highlightColor={shadowHighlightColor}
          highlightHeight={shadowHighlightHeight}
          shadowColor={shadowBottomColor}
          shadowHeight={shadowBottomHeight}
          borderColor={shadowBorderColor}
          ringWidth={shadowRingWidth}
          showGradient={showGradient}
          isInsetShadowSidesFlattened={isInsetShadowSidesFlattened}
        />
      ) : null}
    </View>
  );
};

export { ButtonProgressLoader };
export type { ButtonProgressLoaderProps };
