import React from 'react';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import getIn from '~utils/lodashButBetter/get';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { chipMotionTokens } from './chipTokens';
import { useTheme } from '~components/BladeProvider';

const StyledAnimatedChip = styled(Animated.View)<AnimatedChipProps>(({ theme, ...props }) => {
  const size = props.size ?? 'small';
  return {
    ...getAnimatedChipStyles({ theme, ...props }),
    alignSelf: 'center',
    overflow: 'hidden',
    // Anchor content to the start: a long, truncated label exceeds maxWidth, and centering
    // (getAnimatedChipStyles default) would clip both edges and eat the leading icon's padding.
    // flex-start clips only the trailing text, keeping the icon's inset.
    justifyContent: 'flex-start',
    // The selected fill (interactive.background.*.faded) is semi-transparent and is painted by
    // StyledChipWrapper — same as web. Keep this outer layer transparent so the alpha isn't
    // applied twice and the blue doesn't render darker than web.
    backgroundColor: 'transparent',
    // When selected, medium & large own a single thicker border (the wrapper border is
    // suppressed): 1.5px for medium, 2px for large. xsmall/small and all unchecked chips
    // keep the default thin 1px outline.
    ...(props.isChecked &&
      size === 'medium' && { borderWidth: getIn(theme, 'border.width.thick') as number }),
    ...(props.isChecked &&
      size === 'large' && { borderWidth: getIn(theme, 'border.width.thicker') as number }),
  };
});

const AnimatedChip = ({
  borderColor,
  backgroundColor,
  children,
  isPressed,
  isDisabled,
  isChecked,
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
      isChecked={isChecked}
      size={size}
      style={chipAnimation}
    >
      {children}
    </StyledAnimatedChip>
  );
};

export { AnimatedChip };
