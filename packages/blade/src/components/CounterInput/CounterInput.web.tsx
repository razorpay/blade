import React, { useCallback } from 'react';
import type { CounterInputProps } from './types';
import { BaseInput } from '~components/Input/BaseInput';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import { getOuterMotionRef } from '~utils/getMotionRefs';
import { StyledCounterInput } from './StyledCounterInput';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { useBreakpoint } from '~utils';
import { MinusIcon, PlusIcon } from '~components/Icons';
import { COUNTER_INPUT_TOKEN } from './token';
import { ProgressBar } from '~components/ProgressBar';
import { CounterInputProvider } from './CounterInputContext';

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
      emphasis = 'intense',
      size = 'medium',
      isLoading = false,
      isDisabled = false,
      onChange,
      onFocus,
      onBlur,
      testID,
      _motionMeta,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useControllableState({
      value: value,
      defaultValue: defaultValue,
      onChange: (newValue) => onChange?.({ value: newValue }),
    });

    const { inputId } = useFormId('counter-input');
    const idBase = useId('counter-input');
    const labelId = `${idBase}-label`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
    const emphasisTokens = COUNTER_INPUT_TOKEN.emphasis[emphasis];
    const _isDisabled = isDisabled || isLoading;

    const handleInputChange = useCallback(
      ({ value: inputValue }: { value?: string }) => {
        const numericValue = inputValue ? parseInt(inputValue, 10) : min;
        const validValue = isNaN(numericValue) ? min : numericValue;

        let constrainedValue = validValue;
        if (constrainedValue < min) constrainedValue = min;
        if (max !== undefined && constrainedValue > max) constrainedValue = max;
        setInternalValue(() => constrainedValue);
        onChange?.({ value: constrainedValue as number });
      },
      [min, max, onChange, name],
    );

    const handleIncrement = useCallback(() => {
      if (_isDisabled) return;

      const newValue = (internalValue ?? min) + 1;
      const constrainedValue = max !== undefined ? Math.min(newValue, max) : newValue;

      setInternalValue(() => constrainedValue);

      onChange?.({ value: constrainedValue as number });
    }, [internalValue, min, max, isDisabled, isLoading, onChange, name]);

    const handleDecrement = useCallback(() => {
      if (_isDisabled) return;

      const newValue = (internalValue ?? min) - 1;
      const constrainedValue = Math.max(newValue, min);

      setInternalValue(() => constrainedValue);
      onChange?.({ value: constrainedValue });
    }, [internalValue, min, isDisabled, isLoading, onChange, name]);

    const isDecrementDisabled = _isDisabled || (internalValue ?? min) <= min;
    const isIncrementDisabled = _isDisabled || (max !== undefined && (internalValue ?? min) >= max);

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
        <StyledCounterInput
          className="__blade-counter-input"
          ref={getOuterMotionRef({ _motionMeta, ref })}
          {...metaAttribute({ name: MetaConstants.CounterInput, testID })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
        >
          <BaseBox
            display="flex"
            flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
            alignItems={isLabelLeftPositioned ? 'center' : undefined}
          >
            {label && (
              <FormLabel
                as="label"
                position={labelPosition}
                id={labelId}
                htmlFor={inputId}
                size={size}
              >
                {label}
              </FormLabel>
            )}

            <BaseBox
              display="flex"
              position="relative"
              alignItems="center"
              flexDirection="column"
              backgroundColor={emphasisTokens.backgroundColor}
              width={`${COUNTER_INPUT_TOKEN.width[size]}px`}
              height={`${COUNTER_INPUT_TOKEN.height[size]}px`}
              borderRadius="medium"
              borderWidth="thin"
              borderColor={
                _isDisabled ? emphasisTokens.disabledBorderColor : emphasisTokens.borderColor
              }
            >
              <BaseBox display="flex" alignItems="center" flexDirection="row">
                <BaseBox
                  display="flex"
                  cursor={isDecrementDisabled ? 'not-allowed' : 'pointer'}
                  onClick={handleDecrement}
                  margin={COUNTER_INPUT_TOKEN.leftIconMargin[size]}
                >
                  <MinusIcon
                    size={size === 'xsmall' ? 'small' : size}
                    color={
                      isDecrementDisabled
                        ? emphasisTokens.disabledIconColor
                        : emphasisTokens.iconColor
                    }
                  />
                </BaseBox>

                <BaseInput
                  ref={ref}
                  id="__counter-input"
                  as="input"
                  name={name}
                  type="number"
                  componentName={MetaConstants.CounterInput}
                  label=""
                  accessibilityLabel={accessibilityLabel}
                  value={internalValue?.toString() ?? ''}
                  onChange={handleInputChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  isDisabled={isDisabled}
                  size={size}
                  textAlign="center"
                  // Accessibility attributes for spinbutton
                  role="spinbutton"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={internalValue ?? min}
                />

                <BaseBox
                  display="flex"
                  alignItems="center"
                  cursor={isIncrementDisabled ? 'not-allowed' : 'pointer'}
                  onClick={handleIncrement}
                  margin={COUNTER_INPUT_TOKEN.rightIconMargin[size]}
                >
                  <PlusIcon
                    size={size === 'xsmall' ? 'small' : size}
                    color={
                      isIncrementDisabled
                        ? emphasisTokens.disabledIconColor
                        : emphasisTokens.iconColor
                    }
                  />
                </BaseBox>
              </BaseBox>
              {isLoading && (
                <BaseBox width="100%" position="absolute" bottom="spacing.0">
                  <ProgressBar
                    color={emphasisTokens.progressBarColor}
                    showPercentage={false}
                    value={1}
                    isIndeterminate={true}
                  />
                </BaseBox>
              )}
            </BaseBox>
          </BaseBox>
        </StyledCounterInput>
      </CounterInputProvider>
    );
  },
);

const CounterInput = assignWithoutSideEffects(_CounterInput, {
  componentId: MetaConstants.CounterInput,
});

export { CounterInput };
