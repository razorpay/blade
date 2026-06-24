import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { CounterInputProps } from './types';
import { StyledCounterInput } from './StyledCounterInput';
import { COUNTER_INPUT_TOKEN, COUNTER_INPUT_ICON_SIZE_MAP } from './token';
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
import {
  useBreakpoint,
  makeSpace,
  castWebType,
  makeMotionTime,
  makeBorderSize,
  makeTypographySize,
} from '~utils';
import { MinusIcon, PlusIcon } from '~components/Icons';
import { ProgressBar } from '~components/ProgressBar';
import get from '~utils/lodashButBetter/get';
import { mergeRefs } from '~utils/useMergeRefs';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { getTextProps } from '~components/Typography/Text/Text';

const COUNTER_INPUT_SIZE_TO_TEXT_SIZE = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

// Horizontal padding inside the input (spacing[2] left + spacing[2] right = 4px + 4px)
const INPUT_PADDING_X = 8;

type DigitAnimationState = {
  digits: string[];
  animatingIndices: Set<number>;
  direction: 'up' | 'down';
} | null;

const StyledCounterButton = styled.button<{
  disabled?: boolean;
  $padding: number;
  $margin: readonly number[];
  $emphasis: 'subtle' | 'intense';
  $borderRadius: number;
}>`
  background-color: transparent;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ $borderRadius }) => makeBorderSize($borderRadius)};
  padding: ${({ $padding }) => makeSpace($padding)};
  margin: ${({ $margin }) => $margin.map((m) => makeSpace(m)).join(' ')};

  /* Transitions for smooth hover effects */
  transition-property: background-color, color;
  transition-duration: ${({ theme }) =>
    castWebType(makeMotionTime(get(theme.motion, 'duration.xquick')))};
  transition-timing-function: ${({ theme }) => get(theme.motion, 'easing.standard')};

  &:focus-visible {
    ${({ theme }) => getFocusRingStyles({ theme, negativeOffset: true })}
  }

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
`;

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
    const lastActionRef = useRef<'increment' | 'decrement' | null>(null);
    const previousValueRef = useRef<number | undefined>(internalValue);
    const containerRef = useRef<HTMLDivElement>(null);

    // Per-digit animation state: tracks which digit positions are animating and direction
    const [digitAnimState, setDigitAnimState] = useState<DigitAnimationState>(null);

    // Track Tab navigation to show focus ring only on keyboard navigation (not mouse clicks)
    // Note: :focus-visible doesn't work for text inputs - shows ring on both Tab and click
    // TODO: Re-evaluate and remove later once focus style is unified from design
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return undefined;

      const handleTabKey = (event: KeyboardEvent): void => {
        if (event.key === 'Tab') {
          container.classList.add('counter-input-keyboard-focus');
        }
      };

      const handleMouseDown = (): void => {
        container.classList.remove('counter-input-keyboard-focus');
      };

      document.addEventListener('keydown', handleTabKey, true);
      document.addEventListener('mousedown', handleMouseDown, true);

      return (): void => {
        document.removeEventListener('keydown', handleTabKey, true);
        document.removeEventListener('mousedown', handleMouseDown, true);
      };
    }, []);

    // Per-digit animation effect — only animates the digits that actually changed
    useEffect(() => {
      if (lastActionRef.current && !isLoading && internalValue !== previousValueRef.current) {
        const direction = lastActionRef.current === 'increment' ? 'up' : 'down';
        const prevStr = String(previousValueRef.current ?? min ?? 0);
        const currStr = String(internalValue ?? 0);

        const maxLen = Math.max(prevStr.length, currStr.length);
        const paddedPrev = prevStr.padStart(maxLen, '0');
        const paddedCurr = currStr.padStart(maxLen, '0');

        // Compute which positions (from the left of currStr) actually changed.
        // paddedPrev and paddedCurr are aligned from the left so index 0 = most-significant digit.
        // displayOffset converts from padded-index to currStr-index (skips leading padding zeros).
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

        setDigitAnimState({ digits: currStr.split(''), animatingIndices, direction });
        setTimeout(() => setDigitAnimState(null), 300);
        lastActionRef.current = null;
      }

      previousValueRef.current = internalValue;
    }, [internalValue, isLoading, min]);

    const handleInputChange = useCallback(
      ({ value: inputValue }: { value?: string }) => {
        const numericValue = inputValue ? parseInt(inputValue, 10) : min;
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

    // Compute the width of the input area based on digit count.
    // minWidth keeps two-digit space by default; grows for longer numbers.
    const valueStr = String(internalValue ?? min ?? 0);
    const digitCount = Math.max(2, valueStr.length);
    const inputAreaWidth = `calc(${digitCount}ch + ${INPUT_PADDING_X}px)`;

    // Font properties for the per-digit overlay — must match BaseInput's body/semibold styling
    const textSize =
      COUNTER_INPUT_SIZE_TO_TEXT_SIZE[size as keyof typeof COUNTER_INPUT_SIZE_TO_TEXT_SIZE];
    const { fontSize: fontSizeToken = 200 } = getTextProps({
      variant: 'body',
      size: textSize,
      weight: 'semibold',
    });
    const overlayFontSize = makeTypographySize(theme.typography.fonts.size[fontSizeToken]);
    const overlayColor = _isDisabled
      ? (get(theme.colors, emphasisTokens.disabledColor, '') as string)
      : (get(theme.colors, emphasisTokens.color, '') as string);

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
          ref={mergeRefs(getOuterMotionRef({ _motionMeta, ref }), containerRef)}
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
              // minWidth preserves two-digit default size; container grows for longer numbers
              minWidth={`${COUNTER_INPUT_TOKEN.width[size]}px`}
              height={`${COUNTER_INPUT_TOKEN.height[size]}px`}
              borderRadius={COUNTER_INPUT_TOKEN.containerBorderRadius[size]}
              borderWidth="thin"
              borderColor={
                _isDisabled ? emphasisTokens.disabledBorderColor : emphasisTokens.borderColor
              }
            >
              <BaseBox display="flex" alignItems="center" flexDirection="row">
                <StyledCounterButton
                  className="__blade-counter-input-decrement-button"
                  onClick={handleDecrement}
                  $padding={COUNTER_INPUT_TOKEN.iconPadding[size]}
                  $margin={COUNTER_INPUT_TOKEN.decrementIconMargin}
                  $emphasis={emphasis}
                  $borderRadius={COUNTER_INPUT_TOKEN.buttonBorderRadius[size]}
                  aria-label="Decrement value"
                  disabled={isDecrementDisabled}
                  style={{
                    color: isDecrementDisabled
                      ? get(theme.colors, emphasisTokens.disabledIconColor, '')
                      : get(theme.colors, emphasisTokens.iconColor, ''),
                  }}
                >
                  {/* Using currentColor allows CSS hover styles to control icon color */}
                  <MinusIcon size={COUNTER_INPUT_ICON_SIZE_MAP[size]} color="currentColor" />
                </StyledCounterButton>

                {/*
                 * Input area: dynamic width keeps two-digit minimum, grows for longer numbers.
                 * During animation the real input text is hidden and the digit overlay is shown
                 * so that only changed digits animate (slot-machine style).
                 */}
                <BaseBox
                  position="relative"
                  style={{ width: inputAreaWidth }}
                  className={digitAnimState ? '__blade-counter-input-hide-text' : undefined}
                >
                  {/* Per-digit animation overlay — visible only during button-click animations */}
                  {digitAnimState && (
                    <BaseBox
                      position="absolute"
                      top="spacing.0"
                      bottom="spacing.0"
                      left="spacing.0"
                      right="spacing.0"
                      className="__blade-counter-input-digit-overlay"
                      aria-hidden="true"
                      style={{
                        fontSize: overlayFontSize,
                        fontFamily: theme.typography.fonts.family.text,
                        fontWeight: 600,
                        color: overlayColor,
                      }}
                    >
                      {digitAnimState.digits.map((char, i) => (
                        <span
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          className="__blade-counter-input-digit-slot"
                        >
                          <span
                            className={
                              digitAnimState.animatingIndices.has(i)
                                ? `__blade-counter-input-digit-animate-${digitAnimState.direction}`
                                : undefined
                            }
                          >
                            {char}
                          </span>
                        </span>
                      ))}
                    </BaseBox>
                  )}
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
                  className="__blade-counter-input-increment-button"
                  onClick={handleIncrement}
                  $padding={COUNTER_INPUT_TOKEN.iconPadding[size]}
                  $margin={COUNTER_INPUT_TOKEN.incrementIconMargin}
                  $emphasis={emphasis}
                  $borderRadius={COUNTER_INPUT_TOKEN.buttonBorderRadius[size]}
                  aria-label="Increment value"
                  disabled={isIncrementDisabled}
                  style={{
                    color: isIncrementDisabled
                      ? get(theme.colors, emphasisTokens.disabledIconColor, '')
                      : get(theme.colors, emphasisTokens.iconColor, ''),
                  }}
                >
                  {/* Using currentColor allows CSS hover styles to control icon color */}
                  <PlusIcon size={COUNTER_INPUT_ICON_SIZE_MAP[size]} color="currentColor" />
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
