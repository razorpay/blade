import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
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
import { useBreakpoint, makeSpace, castWebType, makeMotionTime } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import get from '~utils/lodashButBetter/get';

const T = SLIDER_INPUT_TOKENS;

const StyledThumb = styled.div<{
  $isFocused: boolean;
  $isDragging: boolean;
  $showFocusRing: boolean;
}>`
  outline: none;
  ${({ theme, $showFocusRing }) => $showFocusRing && getFocusRingStyles({ theme })}
`;

const StyledNumericInput = styled.input<{
  $size: 'medium' | 'large';
  $validationState: 'none' | 'error' | 'success';
}>`
  -moz-appearance: textfield;
  appearance: none;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  height: ${({ $size }) => ($size === 'large' ? 48 : 36)}px;
  width: 64px;
  padding: 0 8px;
  border: 1px solid;
  border-color: ${({ theme, $validationState }) => {
    if ($validationState === 'error')
      return get(theme.colors, 'feedback.border.negative.intense', '#d73131');
    if ($validationState === 'success')
      return get(theme.colors, 'feedback.border.positive.intense', '#1DA462');
    return get(theme.colors, 'interactive.border.gray.default', '#DEE1E3');
  }};
  border-radius: ${({ theme }) => theme.border.radius.medium}px;
  font-size: ${({ $size }) => ($size === 'large' ? 14 : 12)}px;
  text-align: right;
  font-family: inherit;
  background: transparent;
  color: inherit;
  outline: none;
  cursor: inherit;
  flex-shrink: 0;
  ${({ theme }) => css`
    &:focus {
      border-color: ${get(theme.colors, 'interactive.border.primary.default', '#528FF0')};
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}
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
      necessityIndicator,
      validationState = 'none',
      helpText,
      errorText,
      successText,
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

    const [isDragging, setIsDragging] = useState(false);
    const [isThumbHovered, setIsThumbHovered] = useState(false);
    const [isThumbFocused, setIsThumbFocused] = useState(false);
    const isPointerFocusRef = useRef(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const currentValue = internalValue ?? defaultValue;
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;

    const dragValueRef = useRef(0);
    const rafRef = useRef(0);
    const visualPctRef = useRef(((currentValue - min) / (max - min)) * 100);
    const targetPctRef = useRef(visualPctRef.current);
    const lerpRafRef = useRef(0);
    const { helpTextId, errorTextId, successTextId } = useFormId('slider-input');
    const idBase = useId('slider-input');
    const labelId = `${idBase}-label`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

    const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);
    const snap = useCallback((v: number) => Math.round(v / step) * step, [step]);
    const pct = ((currentValue - min) / (max - min)) * 100;

    useEffect(() => {
      if (!isDragging) {
        visualPctRef.current = pct;
        targetPctRef.current = pct;
      }
    }, [pct, isDragging]);

    const updateValue = useCallback(
      (newVal: number) => {
        const clamped = clamp(snap(newVal));
        setInternalValue(() => clamped);
      },
      [clamp, snap, setInternalValue],
    );

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        if (!trackRef.current) return currentValueRef.current;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return min + ratio * (max - min);
      },
      [min, max],
    );

    const applyPosition = useCallback((p: number) => {
      if (thumbRef.current) thumbRef.current.style.left = `${p}%`;
      if (fillRef.current) fillRef.current.style.width = `${p}%`;
    }, []);

    const animateToTarget = useCallback(() => {
      cancelAnimationFrame(lerpRafRef.current);
      const tick = (): void => {
        const diff = targetPctRef.current - visualPctRef.current;
        if (Math.abs(diff) < 0.1) {
          visualPctRef.current = targetPctRef.current;
          applyPosition(visualPctRef.current);
          return;
        }
        visualPctRef.current += diff * 0.3;
        applyPosition(visualPctRef.current);
        lerpRafRef.current = requestAnimationFrame(tick);
      };
      lerpRafRef.current = requestAnimationFrame(tick);
    }, [applyPosition]);

    const positionDomElements = useCallback(
      (val: number) => {
        const p = ((val - min) / (max - min)) * 100;
        targetPctRef.current = p;
        if (step > 1) {
          animateToTarget();
        } else {
          visualPctRef.current = p;
          applyPosition(p);
        }
      },
      [min, max, step, applyPosition, animateToTarget],
    );

    const setDragTransitions = useCallback((enable: boolean) => {
      if (thumbRef.current) thumbRef.current.style.transition = enable ? 'none' : '';
      if (fillRef.current) fillRef.current.style.transition = enable ? 'none' : '';
    }, []);

    const startDrag = useCallback(
      (clientX: number) => {
        isPointerFocusRef.current = true;
        setDragTransitions(true);
        setIsDragging(true);
        const val = clamp(snap(getValueFromPosition(clientX)));
        dragValueRef.current = val;
        positionDomElements(val);
        onChangeStart?.({ name, value: val });
        updateValue(val);
      },
      [
        getValueFromPosition,
        updateValue,
        onChangeStart,
        name,
        clamp,
        snap,
        positionDomElements,
        setDragTransitions,
      ],
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (isDisabled) return;
        e.preventDefault();
        startDrag(e.clientX);
      },
      [isDisabled, startDrag],
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (isDisabled) return;
        startDrag(e.touches[0].clientX);
      },
      [isDisabled, startDrag],
    );

    useEffect(() => {
      if (!isDragging) return undefined;
      const onMove = (clientX: number): void => {
        const val = clamp(snap(getValueFromPosition(clientX)));
        if (val === dragValueRef.current) return;
        dragValueRef.current = val;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          positionDomElements(val);
        });
        updateValue(val);
      };
      const onEnd = (clientX: number): void => {
        cancelAnimationFrame(rafRef.current);
        cancelAnimationFrame(lerpRafRef.current);
        setDragTransitions(false);
        const val = clamp(snap(getValueFromPosition(clientX)));
        const p = ((val - min) / (max - min)) * 100;
        visualPctRef.current = p;
        targetPctRef.current = p;
        applyPosition(p);
        setIsDragging(false);
        updateValue(val);
        onChangeEnd?.({ name, value: val });
      };
      const handleMouseMove = (e: MouseEvent): void => onMove(e.clientX);
      const handleMouseUp = (e: MouseEvent): void => onEnd(e.clientX);
      const handleTouchMove = (e: TouchEvent): void => {
        e.preventDefault();
        onMove(e.touches[0].clientX);
      };
      const handleTouchEnd = (e: TouchEvent): void => {
        const touch = e.changedTouches[0];
        onEnd(touch.clientX);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      return (): void => {
        cancelAnimationFrame(rafRef.current);
        cancelAnimationFrame(lerpRafRef.current);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }, [
      isDragging,
      getValueFromPosition,
      updateValue,
      onChangeEnd,
      name,
      clamp,
      snap,
      positionDomElements,
      setDragTransitions,
    ]);

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

    const [inputStringValue, setInputStringValue] = useState(String(currentValue));
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
      if (!isInputFocused) {
        setInputStringValue(String(currentValue));
      }
    }, [currentValue, isInputFocused]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputStringValue(e.target.value);
        const raw = parseFloat(e.target.value);
        if (!isNaN(raw)) {
          updateValue(raw);
        }
      },
      [updateValue],
    );

    const handleInputBlur = useCallback(() => {
      setIsInputFocused(false);
      const raw = parseFloat(inputStringValue);
      if (isNaN(raw)) {
        setInputStringValue(String(currentValueRef.current));
      } else {
        updateValue(raw);
      }
    }, [inputStringValue, updateValue]);

    const showHalo = !isDisabled && (isThumbHovered || isDragging);
    const thumbSize = isDragging ? T.thumb.pressedSize[size] : T.thumb.size[size];
    const haloSize = thumbSize * T.thumb.haloMultiplier;

    const thumbColor = isDisabled
      ? T.color.thumb.disabledHardcoded
      : get(theme.colors, T.color.thumb.fill, '');
    const trackFillColor = isDisabled
      ? T.color.track.fillDisabledHardcoded
      : get(theme.colors, T.color.track.fill, '');

    const suffixColor = isDisabled
      ? get(theme.colors, T.color.label.disabled, '')
      : get(theme.colors, T.color.label.text, '');

    const willRenderHintText =
      (validationState === 'error' && Boolean(errorText)) ||
      (validationState === 'success' && Boolean(successText)) ||
      Boolean(helpText);

    return (
      <BaseBox
        ref={ref as React.Ref<HTMLDivElement>}
        {...metaAttribute({ name: MetaConstants.SliderInput, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <BaseBox display="flex" flexDirection="column" gap="spacing.1">
          <BaseBox
            display="flex"
            flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
            alignItems={isLabelLeftPositioned ? 'center' : undefined}
            gap="spacing.3"
          >
            {label && (
              <FormLabel
                as="span"
                position={labelPosition}
                necessityIndicator={necessityIndicator}
                id={labelId}
                size={size}
              >
                {label}
              </FormLabel>
            )}

            {/* Track + numeric input row */}
            <BaseBox display="flex" alignItems="center" flex="1" gap="spacing.3">
              {/* Track area */}
              <BaseBox
                ref={trackRef}
                position="relative"
                flex="1"
                height={makeSpace(44)}
                display="flex"
                alignItems="center"
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                onMouseDown={(handleMouseDown as unknown) as React.MouseEventHandler}
                onTouchStart={(handleTouchStart as unknown) as React.TouchEventHandler}
                style={{ touchAction: 'none' }}
              >
                {/* Track background */}
                <BaseBox
                  position="absolute"
                  left="spacing.0"
                  right="spacing.0"
                  height={`${T.track.height}px`}
                  borderRadius="max"
                  backgroundColor={T.color.track.bg}
                />

                {/* Fill track */}
                <div
                  ref={fillRef}
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: `${pct}%`,
                    height: T.track.height,
                    borderRadius: theme.border.radius.max,
                    backgroundColor: trackFillColor,
                    transition: isDragging
                      ? 'none'
                      : `width ${castWebType(
                          makeMotionTime(theme.motion.duration.quick),
                        )} ${castWebType(theme.motion.easing.standard)}`,
                  }}
                />

                {/* Thumb wrapper — halo + visual thumb nested inside */}
                <StyledThumb
                  ref={thumbRef}
                  $isFocused={isThumbFocused}
                  $isDragging={isDragging}
                  $showFocusRing={isThumbFocused && !isPointerFocusRef.current}
                  tabIndex={isDisabled ? -1 : 0}
                  role="slider"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={currentValue}
                  aria-valuetext={suffix ? `${currentValue} ${suffix}` : String(currentValue)}
                  aria-labelledby={label ? labelId : undefined}
                  aria-label={!label ? accessibilityLabel ?? 'Slider' : undefined}
                  aria-disabled={isDisabled}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsThumbFocused(true)}
                  onBlur={() => {
                    setIsThumbFocused(false);
                    isPointerFocusRef.current = false;
                  }}
                  onPointerDown={() => {
                    isPointerFocusRef.current = true;
                  }}
                  onMouseEnter={() => !isDisabled && setIsThumbHovered(true)}
                  onMouseLeave={() => setIsThumbHovered(false)}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    background: 'transparent',
                    cursor: isDisabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                    zIndex: 2,
                    touchAction: 'none',
                  }}
                >
                  {/* Halo */}
                  <div
                    style={{
                      position: 'absolute',
                      width: showHalo ? haloSize : 0,
                      height: showHalo ? haloSize : 0,
                      borderRadius: '50%',
                      backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                      opacity: showHalo ? 1 : 0,
                      transition: isDragging
                        ? 'none'
                        : `opacity 100ms ease, width 100ms ease, height 100ms ease`,
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Visual thumb */}
                  <div
                    style={{
                      width: thumbSize,
                      height: thumbSize,
                      borderRadius: '50%',
                      backgroundColor: thumbColor,
                      transition: isDragging
                        ? 'none'
                        : `all ${castWebType(
                            makeMotionTime(theme.motion.duration.xquick),
                          )} ${castWebType(theme.motion.easing.standard)}`,
                      pointerEvents: 'none',
                    }}
                  />
                </StyledThumb>
              </BaseBox>

              {/* Numeric input */}
              <StyledNumericInput
                type="number"
                $size={size}
                $validationState={validationState}
                value={inputStringValue}
                min={min}
                max={max}
                step={step}
                disabled={isDisabled}
                aria-label={
                  suffix
                    ? `${label ?? accessibilityLabel ?? 'Slider'} value in ${suffix}`
                    : undefined
                }
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={handleInputBlur}
              />
              {suffix && (
                <span
                  style={{
                    color: suffixColor,
                    fontSize: size === 'large' ? 14 : 12,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {suffix}
                </span>
              )}
            </BaseBox>
          </BaseBox>

          {willRenderHintText && (
            <BaseBox
              marginLeft={
                isLabelLeftPositioned ? `${T.label.width + T.gap.labelToSlider}px` : undefined
              }
            >
              {validationState === 'error' && errorText ? (
                <FormHint type="error" errorText={errorText} errorTextId={errorTextId} />
              ) : validationState === 'success' && successText ? (
                <FormHint type="success" successText={successText} successTextId={successTextId} />
              ) : helpText ? (
                <FormHint type="help" helpText={helpText} helpTextId={helpTextId} />
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
