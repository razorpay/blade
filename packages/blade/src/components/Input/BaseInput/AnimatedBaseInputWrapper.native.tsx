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
import { BASEINPUT_WRAPPER_MAX_HEIGHT, BASEINPUT_WRAPPER_MIN_HEIGHT } from './baseInputConfig';
import { castNativeType, useTheme } from '~utils';

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
  BaseInputWrapperProps & {
    showAllTags?: boolean;
    setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  }
> = (
  { showAllTags, setShowAllTagsWithAnimation, children, maxTagRows, ...rest },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const sharedHeight = useSharedValue(BASEINPUT_WRAPPER_MIN_HEIGHT); // Initial max-width value

  React.useEffect(() => {
    sharedHeight.value = withTiming(
      showAllTags ? BASEINPUT_WRAPPER_MAX_HEIGHT : BASEINPUT_WRAPPER_MIN_HEIGHT,
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
    <StyledBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={maxTagRows === 'expandable' ? animatedStyle : undefined}
      {...rest}
    >
      {children}
    </StyledBaseInputWrapper>
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
