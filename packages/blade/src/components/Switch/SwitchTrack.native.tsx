import styled from 'styled-components';
import getIn from 'lodash/get';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import type { TrackProps } from './types';
import { getTrackStyles } from './getTrackStyles';
import { switchColors, switchMotion } from './switchTokens';
import { useTheme } from '~components/BladeProvider';

const StyledSwitchTrack = styled(Animated.View)<TrackProps>(
  ({ theme, size, deviceType, isDisabled, isChecked }) => {
    return {
      ...getTrackStyles({ theme, size, deviceType, isDisabled, isChecked }),
    };
  },
);

const SwitchTrack = ({
  children,
  isChecked,
  ...props
}: TrackProps & { children: React.ReactNode }): React.ReactElement => {
  const { theme } = useTheme();
  const sharedColor = useSharedValue(isChecked ? 1 : 0);

  const easing = getIn(theme, switchMotion.easing.track);
  const duration = getIn(theme, switchMotion.duration.track);
  const checkedColor = getIn(theme, switchColors.track.default.background.checked);
  const uncheckedColor = getIn(theme, switchColors.track.default.background.unchecked);

  React.useEffect(() => {
    sharedColor.value = withTiming(isChecked ? 1 : 0, {
      duration,
      easing,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked]);

  const colorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(sharedColor.value, [0, 1], [uncheckedColor, checkedColor]),
    };
  }, []);

  return (
    <StyledSwitchTrack isChecked={isChecked} {...props} style={colorStyle}>
      {children}
    </StyledSwitchTrack>
  );
};

export { SwitchTrack };
