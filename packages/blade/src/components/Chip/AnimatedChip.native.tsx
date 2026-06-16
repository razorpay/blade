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
    const size = props.size ?? 'small';
    const isSmallSize = size === 'xsmall' || size === 'small';
    // Mirror StyledChipWrapper's border width logic so the clip radius exactly matches
    // the outer edge of the visible border and avoids corner bleed.
    const borderWidth = getIn(
      theme,
      isSmallSize ? 'border.width.thick' : 'border.width.thicker',
    ) as number;
    return {
      ...getAnimatedChipStyles({ theme, ...props }),
      alignSelf: 'center',
      overflow: 'hidden',
      backgroundColor: backgroundColor ? getIn(theme.colors, backgroundColor) : 'transparent',
      // StyledChipWrapper renders the visible border; suppress AnimatedChip's own border to avoid double border
      borderWidth: 0,
      borderRadius: makeBorderSize(theme.border.radius[chipBorderRadiusTokens[size]] - borderWidth),
    };
  },
);

const AnimatedChip = ({
  borderColor,
  backgroundColor,
  children,
  isPressed,
  isDisabled,
  size,
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
      size={size}
      style={chipAnimation}
    >
      {children}
    </StyledAnimatedChip>
  );
};

export { AnimatedChip };
