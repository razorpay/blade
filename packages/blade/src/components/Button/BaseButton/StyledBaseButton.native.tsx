import { Linking, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';
import React from 'react';
import type { TextInput, GestureResponderEvent } from 'react-native';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import { ButtonShadowOverlay } from './ButtonShadowOverlay';
import type { StyledBaseButtonProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { logger } from '~utils/logger';
import { castNativeType } from '~utils';

const StyledPressable = styled(Animated.createAnimatedComponent(Pressable))<
  Omit<StyledBaseButtonProps, 'accessibilityProps'>
>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  // boxShadow with inset values is not supported in React Native (css-to-react-native
  // cannot parse multiple inset shadows), so we exclude it from native styles.
  // Inside a full-width ButtonGroup, skip width:100% — siblings need flex:1 to share
  // the row (matches web's CSS `flex: 1` on grouped buttons).
  const { boxShadow: _boxShadow, ...nativeButtonStyles } = getStyledBaseButtonStyles(
    props.isInsideFullWidthButtonGroup ? { ...props, isFullWidth: false } : props,
  );

  // Round only the outer corners of the first/last buttons inside a ButtonGroup
  // so the group's rounded corners aren't clipped (there is no CSS cascade on RN).
  const perCornerRadii = props.borderRadii
    ? {
        borderTopLeftRadius: props.borderRadii.topLeft,
        borderTopRightRadius: props.borderRadii.topRight,
        borderBottomLeftRadius: props.borderRadii.bottomLeft,
        borderBottomRightRadius: props.borderRadii.bottomRight,
      }
    : {};

  // Overlap the previous button by one border-width so the two adjacent gray
  // borders collapse into a single line (matches web's `marginLeft: -1px`).
  const collapseBorderStyle = props.isGroupBorderCollapsed
    ? { marginLeft: -Number(String(props.theme.border.width.thin).replace('px', '')) || -1 }
    : {};

  const fullWidthInGroupStyle = props.isInsideFullWidthButtonGroup
    ? { flex: 1, alignSelf: 'stretch' as const }
    : { alignSelf: 'center' as const };

  return {
    ...nativeButtonStyles,
    ...fullWidthInGroupStyle,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    ...perCornerRadii,
    ...collapseBorderStyle,
    ...styledPropsCSSObject,
  };
});

const openURL = async (href: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(href);
    if (canOpen) {
      await Linking.openURL(href);
    }
  } catch {
    if (__DEV__) {
      logger({
        type: 'warn',
        message: `Could not open the link "href=${href}"`,
        moduleName: 'BaseButton',
      });
    }
  }
};

const _StyledBaseButton: React.ForwardRefRenderFunction<TextInput, StyledBaseButtonProps> = (
  {
    onClick,
    href,
    onBlur,
    onKeyDown,
    children,
    variant,
    minHeight,
    buttonPaddingTop,
    buttonPaddingBottom,
    buttonPaddingLeft,
    buttonPaddingRight,
    isFullWidth,
    disabled,
    defaultBackgroundColor,
    defaultBorderColor,
    hoverBackgroundColor,
    focusBackgroundColor,
    focusRingColor,
    hoverBorderColor,
    focusBorderColor,
    borderWidth,
    borderRadius,
    borderRadii,
    isGroupBorderCollapsed,
    isInsetShadowSidesFlattened,
    isInsideFullWidthButtonGroup,
    motionDuration,
    motionEasing,
    isLoading,
    accessibilityProps,
    testID,
    onTouchStart,
    onTouchEnd,
    onPointerEnter,
    onPointerDown,
    onFocus,
    shadowHighlightColor,
    shadowHighlightHeight,
    shadowBottomColor,
    shadowBottomHeight,
    shadowBorderColor,
    focusShadowBorderColor,
    shadowRingWidth,
    isShadowGradientVisible,
    ...styledProps
  },
  ref,
) => {
  const { theme } = useTheme();
  const isPressed = useSharedValue(false);
  const duration = getIn(theme.motion, motionDuration);
  const easing = getIn(theme.motion, motionEasing);

  const animatedStyles = useAnimatedStyle(() => {
    const styles: {
      backgroundColor: string;
      borderColor?: string;
    } = {
      backgroundColor: withTiming(isPressed.value ? focusBackgroundColor : defaultBackgroundColor, {
        duration,
        easing,
      }) as string,
    };

    if (variant !== 'tertiary' && defaultBorderColor && focusBorderColor) {
      styles.borderColor = withTiming(isPressed.value ? focusBorderColor : defaultBorderColor, {
        duration,
        easing,
      }) as string;
    }

    return styles;
  });

  const handleOnPress = (event: GestureResponderEvent): void => {
    if (href) {
      void openURL(href);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <StyledPressable
      {...styledProps}
      {...accessibilityProps}
      ref={ref}
      role="button"
      onTouchStart={castNativeType(onTouchStart)}
      onTouchEnd={castNativeType(onTouchEnd)}
      onPointerEnter={castNativeType(onPointerEnter)}
      onPointerDown={castNativeType(onPointerDown)}
      onFocus={castNativeType(onFocus)}
      isLoading={isLoading}
      onPress={handleOnPress}
      style={animatedStyles}
      minHeight={minHeight}
      buttonPaddingTop={buttonPaddingTop}
      buttonPaddingBottom={buttonPaddingBottom}
      buttonPaddingLeft={buttonPaddingLeft}
      buttonPaddingRight={buttonPaddingRight}
      isFullWidth={isFullWidth}
      disabled={disabled}
      defaultBackgroundColor={defaultBackgroundColor}
      defaultBorderColor={defaultBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      focusBackgroundColor={focusBackgroundColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      focusBorderColor={focusBorderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      borderRadii={borderRadii}
      isGroupBorderCollapsed={isGroupBorderCollapsed}
      isInsetShadowSidesFlattened={isInsetShadowSidesFlattened}
      isInsideFullWidthButtonGroup={isInsideFullWidthButtonGroup}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      testID={testID}
    >
      {/* eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error */}
      {/* @ts-ignore */}
      {({ pressed }): React.ReactNode => {
        isPressed.value = pressed;
        // Match web `&:active { boxShadow: focusBoxShadow }` — secondary/tertiary
        // swap gray.default → gray.highlighted so the darker press border shows.
        const activeBorderColor =
          pressed && focusShadowBorderColor ? focusShadowBorderColor : shadowBorderColor;
        return (
          <>
            {activeBorderColor ? (
              <ButtonShadowOverlay
                borderRadius={Number(String(borderRadius).replace('px', '')) || 0}
                borderRadii={borderRadii}
                highlightColor={shadowHighlightColor}
                highlightHeight={shadowHighlightHeight}
                shadowColor={shadowBottomColor}
                shadowHeight={shadowBottomHeight}
                borderColor={activeBorderColor}
                ringWidth={shadowRingWidth}
                showGradient={isShadowGradientVisible}
      isInsetShadowSidesFlattened={isInsetShadowSidesFlattened}
              />
            ) : null}
            {children}
          </>
        );
      }}
    </StyledPressable>
  );
};

const StyledBaseButton = assignWithoutSideEffects(React.forwardRef(_StyledBaseButton), {
  displayName: 'StyledBaseButton',
});

export default StyledBaseButton;
