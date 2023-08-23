import getIn from 'lodash/get';
import React from 'react';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
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
  borderColor,
  children,
  isPressed,
  isDisabled,
}: Omit<AnimatedChipProps, 'theme'>): React.ReactElement => {
  const { theme } = useTheme();

  const easing = getIn(theme, chipMotionTokens.easing);
  const duration = getIn(theme, chipMotionTokens.duration);

  const chipAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(isPressed ? 0.92 : 1, {
            duration,
            easing,
          }),
        },
      ],
    };
  }, [isPressed]);

  return (
    <StyledAnimatedChip borderColor={borderColor} isDisabled={isDisabled} style={chipAnimation}>
      {children}
    </StyledAnimatedChip>
  );
};

export { AnimatedChip };
