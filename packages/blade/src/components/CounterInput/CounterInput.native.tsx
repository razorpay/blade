import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, StyleSheet, Text } from 'react-native';
import type { TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { CounterInputProps } from './types';
import { COUNTER_INPUT_TOKEN, COUNTER_INPUT_ICON_SIZE_MAP } from './token';
import { CounterInputProvider } from './CounterInputContext';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel } from '~components/Form';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { MinusIcon, PlusIcon } from '~components/Icons';
import { ProgressBar } from '~components/ProgressBar';
import get from '~utils/lodashButBetter/get';
import { getTextProps } from '~components/Typography/Text/Text';

const COUNTER_INPUT_SIZE_TO_TEXT_SIZE = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

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

type DigitSlotProps = {
  char: string;
  isAnimating: boolean;
  direction: 'up' | 'down';
  duration: number;
  digitStyle: Pick<TextStyle, 'color' | 'fontSize' | 'fontFamily' | 'fontWeight'>;
};

/**
 * A single digit slot with its own Reanimated values so only the changed
 * digit plays the slide animation (slot-machine style).
 */
const DigitSlot = ({
  char,
  isAnimating,
  direction,
  duration,
  digitStyle,
}: DigitSlotProps): JSX.Element => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isAnimating) {
      const startY = direction === 'up' ? 16 : -16;
      translateY.value = startY;
      opacity.value = 0;
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={{
          ...digitStyle,
          includeFontPadding: false,
          padding: 0,
          fontVariant: ['tabular-nums'],
        }}
      >
        {char}
      </Text>
    </Animated.View>
  );
};

type NativeDigitState = {
  digits: string[];
  animatingIndices: Set<number>;
  direction: 'up' | 'down';
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

    const lastActionRef = useRef<'increment' | 'decrement' | null>(null);
    const previousValueRef = useRef<number | undefined>(internalValue);

    const labelId = useId('counter-input-label');
    const { theme } = useTheme();
    const emphasisTokens = COUNTER_INPUT_TOKEN.emphasis[emphasis];
    const _isDisabled = isDisabled || isLoading;

    const duration = theme.motion.duration.quick;

    const [digitState, setDigitState] = useState<NativeDigitState>(() => ({
      digits: String(internalValue ?? min ?? 0).split(''),
      animatingIndices: new Set<number>(),
      direction: 'up' as const,
    }));

    useEffect(() => {
      if (lastActionRef.current && internalValue !== previousValueRef.current) {
        const direction = lastActionRef.current === 'increment' ? 'up' : 'down';
        const prevStr = String(previousValueRef.current ?? min ?? 0);
        const currStr = String(internalValue ?? 0);

        const maxLen = Math.max(prevStr.length, currStr.length);
        const paddedPrev = prevStr.padStart(maxLen, '0');
        const paddedCurr = currStr.padStart(maxLen, '0');

        const displayOffset = maxLen - currStr.length;
        const animatingIndices = new Set<number>();
        for (let i = 0; i < maxLen; i++) {
          if (paddedPrev[i] !== paddedCurr[i]) {
            const displayIdx = i - displayOffset;
            if (displayIdx >= 0) {
              animatingIndices.add(displayIdx);
            }
          }
        }

        setDigitState({ digits: currStr.split(''), animatingIndices, direction });
        lastActionRef.current = null;
      } else if (!lastActionRef.current && internalValue !== previousValueRef.current) {
        // Value changed via direct text input — update display without animation
        const currStr = String(internalValue ?? min ?? 0);
        setDigitState({ digits: currStr.split(''), animatingIndices: new Set(), direction: 'up' });
      }

      previousValueRef.current = internalValue;
    }, [internalValue, min]);

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

    const digitTextStyle: Pick<TextStyle, 'color' | 'fontSize' | 'fontFamily' | 'fontWeight'> = {
      color: valueColor,
      fontSize: theme.typography.fonts.size[fontSizeToken],
      fontFamily: theme.typography.fonts.family.text,
      fontWeight: '600',
    };

    const containerStyle = StyleSheet.create({
      box: {
        // minWidth lets the container grow for numbers beyond two digits
        minWidth: COUNTER_INPUT_TOKEN.width[size],
        height: COUNTER_INPUT_TOKEN.height[size],
      },
    });

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

                {/*
                 * Digit display area: each digit is its own DigitSlot so only the
                 * changed digit animates. A transparent TextInput sits on top for
                 * accessibility and direct keyboard input.
                 */}
                <BaseBox
                  flex={1}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                >
                  {digitState.digits.map((char, i) => (
                    <DigitSlot
                      // Key based on position-from-right keeps the units digit stable
                      // across digit-count changes (e.g. "9" → "10")
                      key={`digit-${digitState.digits.length - 1 - i}`}
                      char={char}
                      isAnimating={digitState.animatingIndices.has(i)}
                      direction={digitState.direction}
                      duration={duration}
                      digitStyle={digitTextStyle}
                    />
                  ))}

                  {/* Transparent TextInput for accessibility and keyboard input */}
                  <TextInput
                    value={internalValue?.toString() ?? String(min)}
                    onChangeText={handleInputChange}
                    onFocus={() => onFocus?.({ name, value: internalValue?.toString() })}
                    onBlur={() => onBlur?.({ name, value: internalValue?.toString() })}
                    editable={!_isDisabled}
                    keyboardType="numeric"
                    style={StyleSheet.flatten([StyleSheet.absoluteFillObject, { opacity: 0 }])}
                    accessibilityLabel={accessibilityLabel ?? label}
                    accessibilityRole="spinbutton"
                  />
                </BaseBox>

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
