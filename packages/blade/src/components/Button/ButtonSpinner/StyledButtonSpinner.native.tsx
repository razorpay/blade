import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import getButtonSpinnerStyles from './getButtonSpinnerStyles';

const AnimatedButtonSpinner = styled(Animated.createAnimatedComponent(View))(({ theme }) =>
  getButtonSpinnerStyles(theme),
);

type StyledButtonSpinnerProps = {
  children: React.ReactNode;
};
const StyledButtonSpinner = (props: StyledButtonSpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  const duration = getIn(theme.motion, 'duration.2xgentle');
  const easing = getIn(theme.motion, 'easing.standard.effective');
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing,
      }),
      -1,
    );
    return (): void => {
      cancelAnimation(rotation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AnimatedButtonSpinner {...props} style={animatedStyles} />;
};

export default StyledButtonSpinner;
