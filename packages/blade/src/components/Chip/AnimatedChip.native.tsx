import getIn from 'lodash/get';
import React from 'react';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { chipMotionTokens } from './chipTokens';
import { useTheme } from '~components/BladeProvider';

const StyledAnimatedChip = styled(Animated.View)<AnimatedChipProps>((props) => {
  return {
    ...getAnimatedChipStyles(props),
    alignSelf: 'center',
  };
});

const AnimatedChip = ({
  children,
  isPressed,
  isDisabled,
}: Omit<AnimatedChipProps, 'theme'>): React.ReactElement => {
  const { theme } = useTheme();
  const scaleDownAnimation = useSharedValue(1);

  const easing = getIn(theme, chipMotionTokens.timingFunction);
  const duration = getIn(theme, chipMotionTokens.duration);

  React.useEffect(() => {
    scaleDownAnimation.value = withTiming(isPressed ? 0.92 : 1, {
      duration,
      easing,
    });
  }, [isPressed]);

  const chipAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scaleDownAnimation.value,
        },
      ],
    };
  }, []);

  return (
    <StyledAnimatedChip isDisabled={isDisabled} style={chipAnimation}>
      {children}
    </StyledAnimatedChip>
  );
};

export { AnimatedChip };
