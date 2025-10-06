import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { CounterInputProps } from './types';
import { StyledCounterInput } from './StyledCounterInput';
import { COUNTER_INPUT_TOKEN } from './token';
import { CounterInputProvider } from './CounterInputContext';
import { BaseInput } from '~components/Input/BaseInput';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import { getOuterMotionRef } from '~utils/getMotionRefs';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { useBreakpoint, makeSpace, castWebType, makeMotionTime } from '~utils';
import { MinusIcon, PlusIcon } from '~components/Icons';
import { ProgressBar } from '~components/ProgressBar';
import get from '~utils/lodashButBetter/get';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const StyledCounterButton = styled.button<{
  disabled?: boolean;
  $padding: number;
  $margin: readonly number[];
  $emphasis: 'subtle' | 'intense';
}>`
  background-color: transparent;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.border.radius.small}px;
  padding: ${({ $padding }) => makeSpace($padding)};
  margin: ${({ $margin }) => $margin.map((m) => makeSpace(m)).join(' ')};

  /* Transitions for smooth hover effects */
  transition-property: background-color, color;
  transition-duration: ${({ theme }) =>
    castWebType(makeMotionTime(get(theme.motion, 'duration.xquick')))};
  transition-timing-function: ${({ theme }) => get(theme.motion, 'easing.standard')};

  /* Hover styles based on emphasis */
  &:hover:not(:disabled) {
    ${({ theme, $emphasis }) => {
      if ($emphasis === 'subtle') {
        return `
          background-color: ${theme.colors.interactive.background.gray.fadedHighlighted} !important;
          color: ${theme.colors.interactive.icon.gray.normal} !important;
        `;
      } else {
        return `
          background-color: ${theme.colors.interactive.background.primary.fadedHighlighted} !important;
          color: ${theme.colors.interactive.icon.primary.normal} !important;
        `;
      }
    }}
  }

  &:focus-visible {
    ${({ theme }) => getFocusRingStyles({ theme, negativeOffset: true })}
  }
`;

// Icon size mapping for counter input
const ICON_SIZE_MAP = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'xlarge',
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

    const { inputId } = useFormId('counter-input');
    const idBase = useId('counter-input');
    const labelId = `${idBase}-label`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
    const emphasisTokens = COUNTER_INPUT_TOKEN.emphasis[emphasis];
    const _isDisabled = isDisabled || isLoading;
    const [animationClass, setAnimationClass] = useState('');
    const lastActionRef = useRef<'increment' | 'decrement' | null>(null);
    const previousValueRef = useRef<number | undefined>(internalValue);

    // Animation effect - triggers only when value actually changes
    useEffect(() => {
      // Only animate if:
      // 1. We have a stored action (button was clicked)
      // 2. Value actually changed from previous value
      // 3. Not currently loading
      if (lastActionRef.current && !isLoading && internalValue !== previousValueRef.current) {
        const animationClass =
          lastActionRef.current === 'increment' ? 'animate-slide-up' : 'animate-slide-down';
        setAnimationClass(animationClass);
        setTimeout(() => setAnimationClass(''), 300);
        lastActionRef.current = null;
      }

      previousValueRef.current = internalValue;
    }, [internalValue, isLoading]);

    const handleInputChange = useCallback(
      ({ value: inputValue }: { value?: string }) => {
        const numericValue = inputValue ? parseInt(inputValue, 10) : min;
        const validValue = isNaN(numericValue) ? min : numericValue;

        let constrainedValue = validValue;
        if (constrainedValue < min) constrainedValue = min;
        if (max !== undefined && constrainedValue > max) constrainedValue = max;
        setInternalValue(() => constrainedValue);
      },
      [min, max, onChange, name],
    );

    const handleIncrement = useCallback(() => {
      if (_isDisabled) return;

      const newValue = (internalValue ?? min) + 1;
      const constrainedValue = max !== undefined ? Math.min(newValue, max) : newValue;

      lastActionRef.current = 'increment';
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, max, _isDisabled, setInternalValue]);

    const handleDecrement = useCallback(() => {
      if (_isDisabled) return;

      const newValue = (internalValue ?? min) - 1;
      const constrainedValue = Math.max(newValue, min);

      lastActionRef.current = 'decrement';
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, _isDisabled, setInternalValue]);

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
        {/* __blade-counter-input: CSS selector for animations and component-specific styles */}
        <StyledCounterInput
          className="__blade-counter-input"
          data-emphasis={emphasis}
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
              backgroundColor={
                isLoading || isDisabled
                  ? emphasisTokens.loadingOrDisabledBgColor
                  : emphasisTokens.backgroundColor
              }
              width={`${COUNTER_INPUT_TOKEN.width[size]}px`}
              height={`${COUNTER_INPUT_TOKEN.height[size]}px`}
              borderRadius="medium"
              borderWidth="thin"
              borderColor={
                _isDisabled ? emphasisTokens.disabledBorderColor : emphasisTokens.borderColor
              }
            >
              <BaseBox display="flex" alignItems="center" flexDirection="row">
                <StyledCounterButton
                  className="decrement-button"
                  onClick={handleDecrement}
                  $padding={COUNTER_INPUT_TOKEN.iconPadding[size]}
                  $margin={COUNTER_INPUT_TOKEN.decrementIconMargin}
                  $emphasis={emphasis}
                  aria-label="Decrement value"
                  disabled={isDecrementDisabled}
                  style={{
                    color: isDecrementDisabled
                      ? get(theme.colors, emphasisTokens.disabledIconColor, '')
                      : get(theme.colors, emphasisTokens.iconColor, ''),
                  }}
                >
                  {/* Using currentColor allows CSS hover styles to control icon color */}
                  <MinusIcon size={ICON_SIZE_MAP[size]} color="currentColor" />
                </StyledCounterButton>

                <BaseBox className={animationClass}>
                  <BaseInput
                    ref={ref}
                    id={inputId}
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
                </BaseBox>

                <StyledCounterButton
                  className="increment-button"
                  onClick={handleIncrement}
                  $padding={COUNTER_INPUT_TOKEN.iconPadding[size]}
                  $margin={COUNTER_INPUT_TOKEN.incrementIconMargin}
                  $emphasis={emphasis}
                  aria-label="Increment value"
                  disabled={isIncrementDisabled}
                  style={{
                    color: isIncrementDisabled
                      ? get(theme.colors, emphasisTokens.disabledIconColor, '')
                      : get(theme.colors, emphasisTokens.iconColor, ''),
                  }}
                >
                  {/* Using currentColor allows CSS hover styles to control icon color */}
                  <PlusIcon size={ICON_SIZE_MAP[size]} color="currentColor" />
                </StyledCounterButton>
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
        </StyledCounterInput>
      </CounterInputProvider>
    );
  },
);

const CounterInput = assignWithoutSideEffects(_CounterInput, {
  componentId: MetaConstants.CounterInput,
});

export { CounterInput };
