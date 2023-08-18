import getIn from 'lodash/get';
import React from 'react';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { useTheme } from '~components/BladeProvider';

const StyledAnimatedChip = styled(Animated.View)<AnimatedChipProps>((props) => {
  return {
    ...getAnimatedChipStyles(props),
    alignSelf: 'center',
  };
});

const AnimatedChip = ({
  isChecked,
  isDisabled,
  size = 'small',
  children,
  isPressed,
  backgroundColor,
  borderColor,
  withIcon,
}: AnimatedChipProps): React.ReactElement => {
  const { theme } = useTheme();

  const scaleDownAnimation = useSharedValue(1);

  const easing = getIn(theme, 'motion.easing.standard.effective');
  const duration = getIn(theme, 'motion.duration.xquick');

  React.useEffect(() => {
    scaleDownAnimation.value = withTiming(isPressed ? 0.8 : 1, {
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
    <StyledAnimatedChip
      isChecked={isChecked}
      size={size}
      backgroundColor={backgroundColor}
      style={chipAnimation}
      isDisabled={isDisabled}
      withIcon={withIcon}
      borderColor={borderColor}
    >
      {children}
    </StyledAnimatedChip>
  );
};

export { AnimatedChip };
