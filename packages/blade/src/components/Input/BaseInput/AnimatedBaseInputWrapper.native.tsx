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
  baseInputBorderRadius,
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
    size: props.size,
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

  const isFocused = rest.currentInteraction === 'focus';
  const focusRingColor = getIn(theme.colors, 'surface.border.primary.muted');

  const motionConfig: {
    duration: number;
    easing: EasingFactoryFn;
  } = {
    duration: castNativeType(
      makeMotionTime(
        getIn(
          theme.motion.duration,
          baseInputBorderBackgroundMotion[isFocused ? 'enter' : 'exit'].duration,
        ),
      ),
    ),
    easing: castNativeType(
      theme.motion.easing[baseInputBorderBackgroundMotion[isFocused ? 'enter' : 'exit'].easing],
    ),
  };

  const targetBorderWidth = rest.isTableInputCell
    ? theme.border.width.none
    : isFocused
    ? theme.border.width.thick
    : theme.border.width.thin;

  const inputBorderRadius = rest.isTableInputCell
    ? theme.border.radius.none
    : theme.border.radius[baseInputBorderRadius[rest.size]];

  const animatedBorderAndBackgroundStyle = useAnimatedStyle(
    () => ({
      borderWidth: withTiming(targetBorderWidth, motionConfig),
      borderRadius: inputBorderRadius,
      borderStyle: 'solid',
      backgroundColor: withTiming(backgroundColor, motionConfig),
      borderColor: withTiming(borderColor, motionConfig),
    }),
    [
      borderColor,
      backgroundColor,
      motionConfig,
      rest.isTableInputCell,
      rest.size,
      targetBorderWidth,
      inputBorderRadius,
    ],
  );

  const FOCUS_RING_MAX_WIDTH = 4;

  // Shared value drives the expanding animation: 0 → FOCUS_RING_MAX_WIDTH on focus, back to 0 on blur.
  // Animating borderWidth + position together makes the ring appear to physically grow outward,
  // matching the web's outline-width transition.
  const ringWidth = useSharedValue(0);
  React.useEffect(() => {
    ringWidth.value = withTiming(isFocused ? FOCUS_RING_MAX_WIDTH : 0, motionConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const focusRingStyle = useAnimatedStyle(() => ({
    top: -ringWidth.value,
    left: -ringWidth.value,
    right: -ringWidth.value,
    bottom: -ringWidth.value,
    borderRadius: inputBorderRadius + ringWidth.value,
    borderWidth: ringWidth.value,
  }));

  return (
    // Outer wrapper has no overflow clipping so the focus ring overlay can extend beyond input edges
    <Animated.View style={{ width: '100%', position: 'relative' }}>
      {/* Focus ring — expands outward from the dark border edge as borderWidth grows 0 → 4 */}
      {!rest.isTableInputCell && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              borderColor: focusRingColor,
            },
            focusRingStyle,
          ]}
        />
      )}
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
    </Animated.View>
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
