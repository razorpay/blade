import React from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import type { BaseInputWrapperProps } from './types';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { castNativeType, useTheme } from '~utils';

const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];
const MAX_ROWS = 4;

const BASEINPUT_MIN_HEIGHT = (size['36'] as number) + BASEINPUT_BOTTOM_LINE_HEIGHT;
const BASEINPUT_MAX_HEIGHT = size['36'] * MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT; // we don't want exact number but rough number to be able to animate correctly in height.

const StyledBaseInputWrapper = styled(Animated.View)<BaseInputWrapperProps>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'active',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
    isTextArea: props.isTextArea,
  }),
}));

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  HTMLDivElement,
  BaseBoxProps & {
    showAllTags?: boolean;
    setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  }
> = ({ showAllTags, setShowAllTagsWithAnimation, ...props }, ref): React.ReactElement => {
  const { theme } = useTheme();
  const sharedHeight = useSharedValue(0); // Initial max-width value

  React.useEffect(() => {
    sharedHeight.value = withTiming(
      showAllTags ? BASEINPUT_MAX_HEIGHT : BASEINPUT_MIN_HEIGHT,
      {
        duration: theme.motion.duration.xquick,
        easing: castNativeType(theme.motion.easing.exit.effective),
      },
      (isComplete) => {
        if (isComplete && !showAllTags) {
          runOnJS(setShowAllTagsWithAnimation)(false);
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllTags]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: sharedHeight.value,
    };
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <StyledBaseInputWrapper ref={ref as any} style={animatedStyle}>
      {props.children}
    </StyledBaseInputWrapper>
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
