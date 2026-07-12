import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { Pressable, TextInput, StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { CounterInputProps } from './types';
import {
  COUNTER_INPUT_TOKEN,
  COUNTER_INPUT_ICON_SIZE_MAP,
  COUNTER_INPUT_SIZE_TO_TEXT_SIZE,
} from './token';
import { getCounterValueDigitCount } from './counterInputUtils';
import { CounterInputProvider } from './CounterInputContext';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import { baseInputCounterInputPaddingTokens } from '~components/Input/BaseInput/baseInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel } from '~components/Form';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { MinusIcon, PlusIcon } from '~components/Icons';
import { ProgressBar } from '~components/ProgressBar';
import get from '~utils/lodashButBetter/get';
import { getTextProps } from '~components/Typography/Text/Text';

// Native platforms don't have CSS `ch` units, so we estimate digit advance width
// as a fraction of font size. The value 0.6 is a conservative average across common
// system fonts on iOS and Android — it intentionally over-allocates slightly to
// ensure digits are never clipped. Known limitation: proportional-figured fonts may
// render narrower digits, resulting in extra whitespace (safe failure direction).
const COUNTER_INPUT_NATIVE_DIGIT_WIDTH_RATIO = 0.6;

type CounterInputSize = NonNullable<CounterInputProps['size']>;

const getButtonStyle = (
  type: 'decrement' | 'increment',
  size: CounterInputSize,
): Record<string, number> => {
  const iconPadding =
    COUNTER_INPUT_TOKEN.iconPadding[size as keyof typeof COUNTER_INPUT_TOKEN.iconPadding] ??
    COUNTER_INPUT_TOKEN.iconPadding.xsmall;
  const margin =
    type === 'decrement'
      ? COUNTER_INPUT_TOKEN.decrementIconMargin
      : COUNTER_INPUT_TOKEN.incrementIconMargin;
  return {
    padding: iconPadding,
    marginTop: margin[0],
    marginRight: margin[1],
    marginBottom: margin[2],
    marginLeft: margin[3],
    borderRadius:
      COUNTER_INPUT_TOKEN.buttonBorderRadius[
        (size in COUNTER_INPUT_TOKEN.buttonBorderRadius
          ? size
          : 'xsmall') as keyof typeof COUNTER_INPUT_TOKEN.buttonBorderRadius
      ],
  };
};

const _CounterInput = React.forwardRef<BladeElementRef, CounterInputProps>(
  (
    {
      label,
      accessibilityLabel,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      labelPosition = 'top',
      name,
      value,
      defaultValue,
      min = 0,
      max,
      emphasis = 'subtle',
      size = 'medium',
      isLoading = false,
      isDisabled = false,
      onChange,
      onFocus,
      onBlur,
      testID,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useControllableState({
      value,
      defaultValue,
      onChange: (newValue) => onChange?.({ value: newValue }),
    });

    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const lastActionRef = useRef<'increment' | 'decrement' | null>(null);
    const previousValueRef = useRef<number | undefined>(internalValue);

    const labelId = useId('counter-input-label');
    const { theme } = useTheme();
    const emphasisTokens = COUNTER_INPUT_TOKEN.emphasis[emphasis];
    const _isDisabled = isDisabled || isLoading;

    const duration = theme.motion.duration.quick;

    useEffect(() => {
      if (lastActionRef.current && internalValue !== previousValueRef.current) {
        const startY = lastActionRef.current === 'increment' ? 8 : -8;
        translateY.value = startY;
        opacity.value = 0;
        translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
        lastActionRef.current = null;
      }
      previousValueRef.current = internalValue;
    }, [internalValue, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    const handleInputChange = useCallback(
      (text: string) => {
        const numericValue = text ? parseInt(text, 10) : min;
        const validValue = isNaN(numericValue) ? min : numericValue;
        let constrainedValue = validValue;
        if (constrainedValue < min) constrainedValue = min;
        if (max !== undefined && constrainedValue > max) constrainedValue = max;
        setInternalValue(() => constrainedValue);
      },
      [min, max, setInternalValue],
    );

    const handleIncrement = useCallback(() => {
      if (_isDisabled) return;
      lastActionRef.current = 'increment';
      const newValue = (internalValue ?? min) + 1;
      const constrainedValue = max !== undefined ? Math.min(newValue, max) : newValue;
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, max, _isDisabled, setInternalValue]);

    const handleDecrement = useCallback(() => {
      if (_isDisabled) return;
      lastActionRef.current = 'decrement';
      const newValue = (internalValue ?? min) - 1;
      const constrainedValue = Math.max(newValue, min);
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, _isDisabled, setInternalValue]);

    const isDecrementDisabled = _isDisabled || (internalValue ?? min) <= min;
    const isIncrementDisabled = _isDisabled || (max !== undefined && (internalValue ?? min) >= max);

    const valueColor = get(
      theme.colors,
      _isDisabled ? emphasisTokens.disabledColor : emphasisTokens.color,
      '',
    ) as string;

    const { fontSize: fontSizeToken = 100 } = getTextProps({
      variant: 'body',
      size: COUNTER_INPUT_SIZE_TO_TEXT_SIZE[size],
      weight: 'semibold',
    });
    const fontSize = theme.typography.fonts.size[fontSizeToken];
    const counterValueDigitCount = getCounterValueDigitCount(internalValue);
    const counterInputHorizontalPadding =
      theme.spacing[baseInputCounterInputPaddingTokens.left[size]] +
      theme.spacing[baseInputCounterInputPaddingTokens.right[size]];
    const counterInputFieldWidth =
      counterValueDigitCount * fontSize * COUNTER_INPUT_NATIVE_DIGIT_WIDTH_RATIO +
      counterInputHorizontalPadding;

    const tabularNumsFontVariant: NonNullable<TextStyle['fontVariant']> = ['tabular-nums'];

    const containerStyle = StyleSheet.create({
      box: {
        minWidth: COUNTER_INPUT_TOKEN.width[size],
        height: COUNTER_INPUT_TOKEN.height[size],
      },
    });

    const textInputStyle = StyleSheet.create({
      input: {
        flex: 1,
        width: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        padding: 0,
        color: valueColor,
        fontSize,
        fontFamily: theme.typography.fonts.family.text,
        fontWeight: '600',
        fontVariant: tabularNumsFontVariant,
      },
    });

    const inputWrapperStyle = useMemo(() => ({ width: counterInputFieldWidth }), [
      counterInputFieldWidth,
    ]);

    const contextValue = {
      size,
      emphasis,
      isDisabled,
      isLoading,
      color: emphasisTokens.color,
      disabledTextColor: emphasisTokens.disabledColor,
      isInsideCounterInput: true,
    };

    return (
      <CounterInputProvider value={contextValue}>
        <BaseBox
          ref={ref}
          {...metaAttribute({ name: MetaConstants.CounterInput, testID })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
        >
          <BaseBox display="flex" flexDirection="column">
            {label && (
              <FormLabel as="span" position="top" id={labelId} size={size}>
                {label}
              </FormLabel>
            )}

            <BaseBox
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor={
                isLoading || isDisabled
                  ? emphasisTokens.loadingOrDisabledBgColor
                  : emphasisTokens.backgroundColor
              }
              style={containerStyle.box}
              borderRadius={COUNTER_INPUT_TOKEN.containerBorderRadius[size]}
              borderWidth="thin"
              borderColor={
                _isDisabled ? emphasisTokens.disabledBorderColor : emphasisTokens.borderColor
              }
            >
              <BaseBox display="flex" alignItems="center" flexDirection="row" flex={1}>
                <Pressable
                  onPress={handleDecrement}
                  disabled={isDecrementDisabled}
                  style={getButtonStyle('decrement', size)}
                  accessibilityLabel="Decrement value"
                  accessibilityRole="button"
                >
                  <MinusIcon
                    size={COUNTER_INPUT_ICON_SIZE_MAP[size]}
                    color={
                      isDecrementDisabled
                        ? emphasisTokens.disabledIconColor
                        : emphasisTokens.iconColor
                    }
                  />
                </Pressable>

                <Animated.View style={[inputWrapperStyle, animatedStyle]}>
                  <TextInput
                    value={internalValue?.toString() ?? String(min)}
                    onChangeText={handleInputChange}
                    onFocus={() => onFocus?.({ name, value: internalValue?.toString() })}
                    onBlur={() => onBlur?.({ name, value: internalValue?.toString() })}
                    editable={!_isDisabled}
                    keyboardType="numeric"
                    style={textInputStyle.input}
                    accessibilityLabel={accessibilityLabel ?? label}
                    accessibilityRole="spinbutton"
                  />
                </Animated.View>

                <Pressable
                  onPress={handleIncrement}
                  disabled={isIncrementDisabled}
                  style={getButtonStyle('increment', size)}
                  accessibilityLabel="Increment value"
                  accessibilityRole="button"
                >
                  <PlusIcon
                    size={COUNTER_INPUT_ICON_SIZE_MAP[size]}
                    color={
                      isIncrementDisabled
                        ? emphasisTokens.disabledIconColor
                        : emphasisTokens.iconColor
                    }
                  />
                </Pressable>
              </BaseBox>

              {isLoading && (
                <BaseBox width="100%" position="absolute" bottom="spacing.0">
                  <ProgressBar
                    color={emphasisTokens.progressBarColor}
                    showPercentage={false}
                    value={1}
                    isIndeterminate={true}
                    _oscillation={true}
                  />
                </BaseBox>
              )}
            </BaseBox>
          </BaseBox>
        </BaseBox>
      </CounterInputProvider>
    );
  },
);

const CounterInput = assignWithoutSideEffects(_CounterInput, {
  componentId: MetaConstants.CounterInput,
});

export { CounterInput };
