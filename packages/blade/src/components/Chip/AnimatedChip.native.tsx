import React from 'react';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import getIn from '~utils/lodashButBetter/get';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { chipMotionTokens, chipBorderRadiusTokens } from './chipTokens';
import { makeBorderSize } from '~utils/makeBorderSize';
import { useTheme } from '~components/BladeProvider';

const StyledAnimatedChip = styled(Animated.View)<AnimatedChipProps>(
  ({ theme, backgroundColor, ...props }) => {
    return {
      ...getAnimatedChipStyles({ theme, ...props }),
      alignSelf: 'center',
      overflow: 'hidden',
      backgroundColor: backgroundColor ? getIn(theme.colors, backgroundColor) : 'transparent',
      // StyledChipWrapper renders the visible border; suppress AnimatedChip's own border to avoid double border
      borderWidth: 0,
      // Clip radius must match StyledChipWrapper's outer border radius (outerRadius - thick = 8 - 1.5 = 6.5)
      borderRadius: makeBorderSize(theme.border.radius[chipBorderRadiusTokens[props.size ?? 'small']] - (getIn(theme, 'border.width.thick') as number)),
    };
  },
);

const AnimatedChip = ({
  borderColor,
  backgroundColor,
  children,
  isPressed,
  isDisabled,
}: Omit<AnimatedChipProps, 'theme'>): React.ReactElement => {
  const { theme } = useTheme();

  const easing = getIn(theme.motion, chipMotionTokens.easing);
  const duration = getIn(theme.motion, chipMotionTokens.duration);

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
    <StyledAnimatedChip
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      isDisabled={isDisabled}
      style={chipAnimation}
    >
      {children}
    </StyledAnimatedChip>
  );
};

export { AnimatedChip };
