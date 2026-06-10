import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { SliderInputProps } from './types';
import { SLIDER_INPUT_TOKENS } from './sliderInputTokens';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel, FormHint } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { useBreakpoint, makeSpace, castWebType, makeMotionTime, makeBorderSize } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import get from '~utils/lodashButBetter/get';
import getTextStyles from '~components/Typography/Text/getTextStyles';

const T = SLIDER_INPUT_TOKENS;

const StyledThumb = styled.div<{ $isFocused: boolean; $isDragging: boolean }>`
  outline: none;
  &:focus-visible {
    ${({ theme }) => getFocusRingStyles({ theme })}
  }
`;

const StyledInputWrapper = styled.div<{
  $state: 'default' | 'hovered' | 'focused' | 'disabled' | 'error';
  $size: 'medium' | 'large';
}>`
  display: flex;
  align-items: center;
  gap: ${T.gap.inputInner}px;
  width: ${T.input.width}px;
  height: ${({ $size }) => T.input.height[$size]}px;
  padding: 0 8px;
  border-radius: ${({ theme }) => makeBorderSize(theme.border.radius.large)};
  border: none;
  flex-shrink: 0;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: ${({ $state }) => ($state === 'disabled' ? 'not-allowed' : 'text')};

  background-color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? get(theme.colors, T.color.input.bgDisabled, '')
      : get(theme.colors, T.color.input.bg, '')};

  box-shadow: ${({ theme, $state }) => {
    const width =
      $state === 'focused' || $state === 'error'
        ? theme.border.width.thick
        : theme.border.width.thin;
    const colorToken =
      $state === 'error'
        ? T.color.input.borderError
        : $state === 'focused'
          ? T.color.input.borderFocus
          : $state === 'hovered'
            ? T.color.input.borderHover
            : $state === 'disabled'
              ? T.color.input.borderDisabled
              : T.color.input.border;
    return `${get(theme.colors, colorToken, '')} 0px 0px 0px ${makeBorderSize(width)}`;
  }};

  outline: ${({ theme, $state }) =>
    $state === 'focused'
      ? `4px solid ${get(theme.colors, T.color.focusRing, '')}`
      : `0px solid ${get(theme.colors, T.color.focusRing, '')}`};
  outline-offset: 1px;

  transition-property: box-shadow, background-color, outline-width;
  transition-duration: ${({ theme }) =>
    `${castWebType(makeMotionTime(theme.motion.duration.xgentle))}, ${castWebType(makeMotionTime(theme.motion.duration.xquick))}, ${castWebType(makeMotionTime(theme.motion.duration['2xquick']))}`};
  transition-timing-function: ${({ theme }) =>
    `${castWebType(theme.motion.easing.emphasized)}, ${castWebType(theme.motion.easing.standard)}, ${castWebType(theme.motion.easing.standard)}`};
`;

const _SliderInput = React.forwardRef<BladeElementRef, SliderInputProps>(
  (
    {
      label,
      accessibilityLabel,
      labelPosition = 'top',
      name,
      value,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      suffix,
      size = 'medium',
      isDisabled = false,
      isRequired = false,
      necessityIndicator,
      validationState = 'none',
      helpText,
      errorText,
      onChange,
      onChangeStart,
      onChangeEnd,
      testID,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useControllableState({
      value,
      defaultValue,
      onChange: (newValue) => onChange?.({ name, value: newValue }),
    });

    const [inputText, setInputText] = useState(String(internalValue ?? defaultValue));
    const [isDragging, setIsDragging] = useState(false);
    const [isThumbHovered, setIsThumbHovered] = useState(false);
    const [isThumbFocused, setIsThumbFocused] = useState(false);
    const [isInputHovered, setIsInputHovered] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { inputId, helpTextId, errorTextId } = useFormId('slider-input');
    const idBase = useId('slider-input');
    const labelId = `${idBase}-label`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

    const currentValue = internalValue ?? defaultValue;

    useEffect(() => {
      if (!isInputFocused) setInputText(String(currentValue));
    }, [currentValue, isInputFocused]);

    const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);
    const snap = useCallback((v: number) => Math.round(v / step) * step, [step]);
    const pct = ((currentValue - min) / (max - min)) * 100;

    const updateValue = useCallback(
      (newVal: number) => {
        const clamped = clamp(snap(newVal));
        setInternalValue(() => clamped);
      },
      [clamp, snap, setInternalValue],
    );

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        if (!trackRef.current) return currentValue;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return min + ratio * (max - min);
      },
      [min, max, currentValue],
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (isDisabled) return;
        e.preventDefault();
        setIsDragging(true);
        const val = clamp(snap(getValueFromPosition(e.clientX)));
        onChangeStart?.({ name, value: val });
        updateValue(val);
      },
      [isDisabled, getValueFromPosition, updateValue, onChangeStart, name, clamp, snap],
    );

    useEffect(() => {
      if (!isDragging) return undefined;
      const handleMove = (e: MouseEvent): void => updateValue(getValueFromPosition(e.clientX));
      const handleUp = (e: MouseEvent): void => {
        setIsDragging(false);
        onChangeEnd?.({ name, value: clamp(snap(getValueFromPosition(e.clientX))) });
      };
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      return (): void => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };
    }, [isDragging, getValueFromPosition, updateValue, onChangeEnd, name, clamp, snap]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (isDisabled) return;
        let newVal = currentValue;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            newVal = currentValue + step;
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            newVal = currentValue - step;
            break;
          case 'Home':
            newVal = min;
            break;
          case 'End':
            newVal = max;
            break;
          case 'PageUp':
            newVal = currentValue + step * 10;
            break;
          case 'PageDown':
            newVal = currentValue - step * 10;
            break;
          default:
            return;
        }
        e.preventDefault();
        updateValue(newVal);
      },
      [isDisabled, currentValue, step, min, max, updateValue],
    );

    const handleInputBlur = useCallback(() => {
      setIsInputFocused(false);
      const parsed = parseFloat(inputText);
      if (!isNaN(parsed)) {
        updateValue(parsed);
      } else {
        setInputText(String(currentValue));
      }
    }, [inputText, currentValue, updateValue]);

    const showHalo = !isDisabled && (isThumbHovered || isDragging);
    const thumbSize = isDragging ? T.thumb.pressedSize[size] : T.thumb.size[size];
    const haloSize = thumbSize * T.thumb.haloMultiplier;

    const thumbColor = isDisabled
      ? get(theme.colors, T.color.thumb.disabled, '')
      : get(theme.colors, T.color.thumb.fill, '');
    const trackBgColor = get(theme.colors, T.color.track.bg, '');
    const trackFillColor = isDisabled
      ? get(theme.colors, T.color.track.fillDisabled, '')
      : get(theme.colors, T.color.track.fill, '');
    const labelColor = isDisabled ? T.color.label.disabled : T.color.label.text;
    const valueColor = isDisabled ? T.color.value.disabled : T.color.value.text;
    const suffixColor = isDisabled ? T.color.suffix.disabled : T.color.suffix.text;

    const inputState = isDisabled
      ? 'disabled'
      : validationState === 'error'
        ? 'error'
        : isInputFocused
          ? 'focused'
          : isInputHovered
            ? 'hovered'
            : 'default';

    const labelTextStyles = getTextStyles({
      size: 'small',
      variant: 'body',
      weight: 'medium',
      color: labelColor,
      theme,
    });
    const valueTextStyles = getTextStyles({
      size: 'small',
      variant: 'body',
      weight: 'medium',
      color: valueColor,
      theme,
    });
    const suffixTextStyles = getTextStyles({
      size: 'small',
      variant: 'body',
      weight: 'regular',
      color: suffixColor,
      theme,
    });

    const willRenderHintText =
      (validationState === 'error' && Boolean(errorText)) || Boolean(helpText);

    return (
      <BaseBox
        ref={ref}
        {...metaAttribute({ name: MetaConstants.SliderInput, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <BaseBox
          display="flex"
          flexDirection="column"
          gap="spacing.1"
        >
          <BaseBox
            display="flex"
            flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
            alignItems={isLabelLeftPositioned ? 'center' : undefined}
            gap="spacing.3"
          >
            {label && (
              <FormLabel
                as="label"
                position={labelPosition}
                necessityIndicator={necessityIndicator}
                id={labelId}
                htmlFor={inputId}
                size={size}
              >
                {label}
              </FormLabel>
            )}

            <BaseBox display="flex" gap="spacing.5" alignItems="center" flex="1">
              {/* Track area */}
              <BaseBox
                ref={trackRef}
                position="relative"
                flex="1"
                height={makeSpace(32)}
                display="flex"
                alignItems="center"
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                onMouseDown={handleMouseDown as unknown as React.MouseEventHandler}
              >
                {/* Track background */}
                <BaseBox
                  position="absolute"
                  left="spacing.0"
                  right="spacing.0"
                  height={`${T.track.height}px`}
                  borderRadius="max"
                  backgroundColor={T.color.track.bg}
                  opacity={isDisabled ? 0.5 : 1}
                />

                {/* Fill track */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: `${pct}%`,
                    height: T.track.height,
                    borderRadius: theme.border.radius.max,
                    backgroundColor: trackFillColor,
                    transition: isDragging ? 'none' : `width ${castWebType(makeMotionTime(theme.motion.duration.quick))} ${castWebType(theme.motion.easing.standard)}`,
                  }}
                />

                {/* Halo */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: showHalo ? haloSize : 0,
                    height: showHalo ? haloSize : 0,
                    borderRadius: '50%',
                    backgroundColor: isDragging
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                    opacity: showHalo ? 1 : 0,
                    transition: isDragging ? 'none' : `opacity 100ms ease, width 100ms ease, height 100ms ease`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Thumb */}
                <StyledThumb
                  $isFocused={isThumbFocused}
                  $isDragging={isDragging}
                  tabIndex={isDisabled ? -1 : 0}
                  role="slider"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={currentValue}
                  aria-valuetext={suffix ? `${currentValue} ${suffix}` : String(currentValue)}
                  aria-labelledby={label ? labelId : undefined}
                  aria-label={!label ? (accessibilityLabel ?? 'Slider') : undefined}
                  aria-disabled={isDisabled}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsThumbFocused(true)}
                  onBlur={() => setIsThumbFocused(false)}
                  onMouseEnter={() => !isDisabled && setIsThumbHovered(true)}
                  onMouseLeave={() => setIsThumbHovered(false)}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: '50%',
                    backgroundColor: thumbColor,
                    border: 'none',
                    cursor: isDisabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                    transition: isDragging ? 'none' : `all ${castWebType(makeMotionTime(theme.motion.duration.xquick))} ${castWebType(theme.motion.easing.standard)}`,
                    zIndex: 2,
                    touchAction: 'none',
                  }}
                />
              </BaseBox>

              {/* Input field */}
              <StyledInputWrapper
                $state={inputState}
                $size={size}
                onMouseEnter={() => !isDisabled && setIsInputHovered(true)}
                onMouseLeave={() => setIsInputHovered(false)}
                onClick={() => inputRef.current?.focus()}
              >
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  inputMode="numeric"
                  value={inputText}
                  disabled={isDisabled}
                  name={name}
                  onChange={(e) => setInputText(e.target.value)}
                  onFocus={() => {
                    setIsInputFocused(true);
                    setInputText(String(currentValue));
                  }}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') inputRef.current?.blur();
                  }}
                  aria-labelledby={label ? labelId : undefined}
                  aria-label={!label ? (accessibilityLabel ?? 'Slider value') : undefined}
                  style={{
                    ...valueTextStyles,
                    width: 21,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    padding: 0,
                    textAlign: 'left',
                    cursor: isDisabled ? 'not-allowed' : 'text',
                  }}
                />
                {suffix && (
                  <span style={{ ...suffixTextStyles, flexShrink: 0 }}>{suffix}</span>
                )}
              </StyledInputWrapper>
            </BaseBox>
          </BaseBox>

          {willRenderHintText && (
            <BaseBox marginLeft={isLabelLeftPositioned ? `${T.label.width + T.gap.labelToSlider}px` : undefined}>
              {validationState === 'error' && errorText ? (
                <FormHint
                  type="error"
                  errorText={errorText}
                  errorTextId={errorTextId}
                />
              ) : helpText ? (
                <FormHint
                  type="help"
                  helpText={helpText}
                  helpTextId={helpTextId}
                />
              ) : null}
            </BaseBox>
          )}
        </BaseBox>
      </BaseBox>
    );
  },
);

const SliderInput = assignWithoutSideEffects(_SliderInput, {
  componentId: MetaConstants.SliderInput,
});

export { SliderInput };
