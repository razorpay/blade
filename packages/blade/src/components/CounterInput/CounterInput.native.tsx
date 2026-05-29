import React, { useCallback } from 'react';
import { Pressable, TextInput } from 'react-native';
import type { CounterInputProps } from './types';
import { COUNTER_INPUT_TOKEN } from './token';
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

const ICON_SIZE_MAP = {
  xsmall: 'small',
  small: 'small',
  medium: 'large',
  large: 'xlarge',
} as const;

const FONT_SIZE_MAP = {
  xsmall: 75,
  small: 75,
  medium: 100,
  large: 200,
} as const;

const _CounterInput = React.forwardRef<BladeElementRef, CounterInputProps>(
  (
    {
      label,
      accessibilityLabel,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _motionMeta,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useControllableState({
      value,
      defaultValue,
      onChange: (newValue) => onChange?.({ value: newValue }),
    });

    const labelId = useId('counter-input-label');
    const { theme } = useTheme();
    const emphasisTokens = COUNTER_INPUT_TOKEN.emphasis[emphasis];
    const _isDisabled = isDisabled || isLoading;

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
      const newValue = (internalValue ?? min) + 1;
      const constrainedValue = max !== undefined ? Math.min(newValue, max) : newValue;
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, max, _isDisabled, setInternalValue]);

    const handleDecrement = useCallback(() => {
      if (_isDisabled) return;
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
              style={{
                width: COUNTER_INPUT_TOKEN.width[size],
                height: COUNTER_INPUT_TOKEN.height[size],
              }}
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
                  style={{
                    padding: COUNTER_INPUT_TOKEN.iconPadding[size],
                    marginTop: COUNTER_INPUT_TOKEN.decrementIconMargin[0],
                    marginRight: COUNTER_INPUT_TOKEN.decrementIconMargin[1],
                    marginBottom: COUNTER_INPUT_TOKEN.decrementIconMargin[2],
                    marginLeft: COUNTER_INPUT_TOKEN.decrementIconMargin[3],
                    borderRadius: COUNTER_INPUT_TOKEN.buttonBorderRadius[size],
                  }}
                  accessibilityLabel="Decrement value"
                  accessibilityRole="button"
                >
                  <MinusIcon
                    size={ICON_SIZE_MAP[size]}
                    color={
                      isDecrementDisabled
                        ? emphasisTokens.disabledIconColor
                        : emphasisTokens.iconColor
                    }
                  />
                </Pressable>

                <TextInput
                  value={internalValue?.toString() ?? String(min)}
                  onChangeText={handleInputChange}
                  onFocus={() => onFocus?.({ name, value: internalValue?.toString() })}
                  onEndEditing={() => onBlur?.({ name, value: internalValue?.toString() })}
                  editable={!_isDisabled}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: valueColor,
                    fontSize: theme.typography.fonts.size[FONT_SIZE_MAP[size]],
                    fontFamily: theme.typography.fonts.family.text,
                  }}
                  accessibilityLabel={accessibilityLabel ?? label}
                  accessibilityRole="spinbutton"
                />

                <Pressable
                  onPress={handleIncrement}
                  disabled={isIncrementDisabled}
                  style={{
                    padding: COUNTER_INPUT_TOKEN.iconPadding[size],
                    marginTop: COUNTER_INPUT_TOKEN.incrementIconMargin[0],
                    marginRight: COUNTER_INPUT_TOKEN.incrementIconMargin[1],
                    marginBottom: COUNTER_INPUT_TOKEN.incrementIconMargin[2],
                    marginLeft: COUNTER_INPUT_TOKEN.incrementIconMargin[3],
                    borderRadius: COUNTER_INPUT_TOKEN.buttonBorderRadius[size],
                  }}
                  accessibilityLabel="Increment value"
                  accessibilityRole="button"
                >
                  <PlusIcon
                    size={ICON_SIZE_MAP[size]}
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
