import React from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import type { BaseInputWrapperProps } from './types';
import {
  getAnimatedBaseInputWrapperMaxHeight,
  getBaseInputState,
  getInputBackgroundAndBorderStyles,
} from './baseInputStyles';
import {
  baseInputBackgroundColor,
  baseInputBorderBackgroundMotion,
  baseInputBorderColor,
  baseInputHeight,
  baseInputWrapperMaxHeight,
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
    isTableInputCell: props.isTableInputCell,
  }),
}));

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  HTMLDivElement,
  BaseInputWrapperProps & {
    showAllTags?: boolean;
    setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  }
> = (
  {
    showAllTags,
    isTextArea,
    numberOfLines,
    setShowAllTagsWithAnimation,
    children,
    maxTagRows,
    isDropdownTrigger,
    ...rest
  },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const sharedHeight = useSharedValue<number>(baseInputHeight[rest.size]); // Initial max-width value

  React.useEffect(() => {
    if (!isDropdownTrigger) {
      return;
    }

    sharedHeight.value = withTiming(
      showAllTags ? baseInputWrapperMaxHeight[rest.size] : baseInputHeight[rest.size],
      {
        duration: theme.motion.duration.xquick,
        easing: castNativeType(theme.motion.easing.exit),
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
    maxHeight: getAnimatedBaseInputWrapperMaxHeight({
      maxTagRows,
      showAllTags,
      size: rest.size,
    }),
  };

  const baseInputState = getBaseInputState({
    isFocused: rest.currentInteraction === 'focus',
    isHovered: rest.currentInteraction === 'hover',
    isDisabled: Boolean(rest.isDisabled),
  });

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
      theme.motion.easing[
        baseInputBorderBackgroundMotion[rest.currentInteraction === 'focus' ? 'enter' : 'exit']
          .easing
      ],
    ),
  };

  const animatedBorderAndBackgroundStyle = useAnimatedStyle(
    () => ({
      borderWidth: rest.isTableInputCell ? theme.border.width.none : theme.border.width.thin,
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
        // We only want to define height in tagged inputs except height for TextArea is set on TextArea based on numberOfLines prop
        isDropdownTrigger && !isTextArea
          ? {
              ...maxHeightStyleObject,
              ...animatedStyleObject,
            }
          : {},
        animatedBorderAndBackgroundStyle,
      ]}
      isDropdownTrigger={isDropdownTrigger}
      numberOfLines={numberOfLines}
      setShowAllTagsWithAnimation={setShowAllTagsWithAnimation}
      {...rest}
    >
      {children}
    </StyledBaseInputWrapper>
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
