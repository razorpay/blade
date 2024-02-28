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
import {
  BASEINPUT_WRAPPER_MAX_HEIGHT,
  BASEINPUT_WRAPPER_MIN_HEIGHT,
  baseInputBackgroundColor,
  baseInputBorderBackgroundMotion,
  baseInputBorderColor,
} from './baseInputTokens';
import { castNativeType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import type { EasingFactoryFn } from '~tokens/global';

const StyledBaseInputWrapper = styled(Animated.View)<BaseInputWrapperProps>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'focus',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
    isTextArea: props.isTextArea,
    isDropdownTrigger: props.isDropdownTrigger,
  }),
}));

const getMaxHeight = ({
  maxTagRows,
  showAllTags,
}: Pick<BaseInputWrapperProps, 'maxTagRows' | 'showAllTags'>): number => {
  if (maxTagRows === 'single') {
    return BASEINPUT_WRAPPER_MIN_HEIGHT;
  }

  if (maxTagRows === 'multiple') {
    return BASEINPUT_WRAPPER_MAX_HEIGHT;
  }

  // In expandable, max-height depends on the state
  return showAllTags ? BASEINPUT_WRAPPER_MAX_HEIGHT : BASEINPUT_WRAPPER_MIN_HEIGHT;
};

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  HTMLDivElement,
  BaseInputWrapperProps & {
    showAllTags?: boolean;
    setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  }
> = (
  { showAllTags, setShowAllTagsWithAnimation, children, maxTagRows, isDropdownTrigger, ...rest },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const sharedHeight = useSharedValue(BASEINPUT_WRAPPER_MIN_HEIGHT); // Initial max-width value

  React.useEffect(() => {
    if (!isDropdownTrigger) {
      return;
    }

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

  const animatedStyleObject = maxTagRows === 'expandable' ? animatedStyle : {};
  const maxHeightStyleObject = {
    maxHeight: getMaxHeight({
      showAllTags,
      maxTagRows,
    }),
  };

  const baseInputState =
    rest.currentInteraction === 'focus'
      ? 'focused'
      : rest.currentInteraction === 'hover'
      ? 'hovered'
      : rest.isDisabled
      ? 'disabled'
      : 'default';

  let borderColor = getIn(theme.colors, baseInputBorderColor[baseInputState]);
  const backgroundColor = getIn(theme.colors, baseInputBackgroundColor[baseInputState]);

  if (rest.validationState === 'error') {
    borderColor = getIn(theme.colors, baseInputBorderColor.error);
  } else if (rest.validationState === 'success') {
    borderColor = getIn(theme.colors, baseInputBorderColor.success);
  }

  const motionConfig: {
    duration: number;
    easing: EasingFactoryFn;
  } = {
    duration: castNativeType(
      makeMotionTime(
        getIn(
          theme.motion.duration,
          baseInputBorderBackgroundMotion[rest.currentInteraction === 'focus' ? 'enter' : 'exit']
            .duration,
        ),
      ),
    ),
    easing: castNativeType(
      getIn(
        theme.motion.easing,
        baseInputBorderBackgroundMotion[rest.currentInteraction === 'focus' ? 'enter' : 'exit']
          .easing,
      ),
    ),
  };

  const animatedBorderAndBackgroundStyle = useAnimatedStyle(
    () => ({
      borderWidth: theme.border.width.thin,
      borderRadius: theme.border.radius.medium,
      borderStyle: 'solid',
      backgroundColor: withTiming(backgroundColor, motionConfig),
      borderColor: withTiming(borderColor, motionConfig),
    }),
    [borderColor, backgroundColor, motionConfig],
  );

  return (
    <StyledBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={[
        isDropdownTrigger
          ? {
              ...maxHeightStyleObject,
              ...animatedStyleObject,
            }
          : {},
        animatedBorderAndBackgroundStyle,
      ]}
      isDropdownTrigger={isDropdownTrigger}
      {...rest}
    >
      {children}
    </StyledBaseInputWrapper>
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
