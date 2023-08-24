import React from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';

const BASEINPUT_MIN_HEIGHT: number = size['36'];
const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];
const MAX_ROWS = 4;
const BASEINPUT_MAX_HEIGHT = size['36'] * MAX_ROWS; // we don't want exact number but rough number to be able to animate correctly in height.

const useAnimatedBaseInputWrapper = ({ showAllTags }) => {
  const inputHeight = useSharedValue(36);

  const toggleExpand = () => {
    console.log({ showAllTags });
    inputHeight.value = withTiming(showAllTags ? 144 : 36, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });
  };

  React.useEffect(() => {
    toggleExpand();
  }, [showAllTags]);

  const inputStyle = useAnimatedStyle(() => {
    return {
      maxHeight: inputHeight.value,
    };
  });

  return { inputStyle };
};

const AnimatedBaseInputWrapper = ({
  showAllTags,
  setShowAllTagsWithAnimation,
  ...props
}: BaseBoxProps & {
  showAllTags?: boolean;
  setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
}): React.ReactElement => {
  const { inputStyle } = useAnimatedBaseInputWrapper({ showAllTags });
  return (
    <Animated.View style={inputStyle}>
      <BaseBox {...props} />
    </Animated.View>
  );
};

export { AnimatedBaseInputWrapper };
