import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getIndicatorButtonStyles } from './getIndicatorButtonStyles';
import type { IndicatorButtonProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';

const PressableIndicatorButton = styled(BaseBox)<
  Pick<IndicatorButtonProps, 'variant' | 'isActive'>
>(({ theme, isActive, variant }) => {
  return getIndicatorButtonStyles({ theme, isActive, variant });
});

const StyledIndicatorButton = ({
  onClick,
  accessibilityLabel,
  ...props
}: IndicatorButtonProps & { accessibilityLabel?: string }): React.ReactElement => {
  const { theme } = useTheme();
  const easing = castNativeType(theme.motion.easing.standard);
  const duration = castNativeType(makeMotionTime(theme.motion.duration.gentle));

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(props.isActive ? size[18] : size[6], {
        duration,
        easing,
      }),
    };
  }, [props.isActive]);

  return (
    <Pressable onPress={onClick} accessibilityLabel={accessibilityLabel}>
      <PressableIndicatorButton {...props}>
        <Animated.View style={style} />
      </PressableIndicatorButton>
    </Pressable>
  );
};

export { StyledIndicatorButton };
