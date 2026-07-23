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

const tokens = SLIDER_INPUT_TOKENS;
const noop = (): void => undefined;

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
  appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
  height: ${({ $size }) => ($size === 'large' ? 48 : 36)}px;
  width: 64px;
  padding: 0 8px;
  border: 1px solid;
  border-color: ${({ theme, $validationState }) => {
    if ($validationState === 'error')
      return get(theme.colors, 'feedback.border.negative.intense', '');
    if ($validationState === 'success')
      return get(theme.colors, 'feedback.border.positive.intense', '');
    return get(theme.colors, 'interactive.border.gray.default', '');
  }};
  border-radius: ${({ theme }) => theme.border.radius.medium}px;
  font-size: ${({ theme, $size }) => theme.typography.fonts.size[$size === 'large' ? 100 : 75]}px;
  text-align: right;
  font-family: inherit;
  background: transparent;
  color: inherit;
  outline: none;
  cursor: inherit;
  flex-shrink: 0;
  ${({ theme }) => css`
    &:focus {
      border-color: ${get(theme.colors, 'interactive.border.primary.default', '')};
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
      isRequired = false,
      necessityIndicator,
      validationState = 'none',
      helpText,
      errorText,
      successText,
      onChange,
      onChangeStart,
      onChangeEnd,
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

    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
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
    const visualPctRef = useRef(max === min ? 0 : ((currentValue - min) / (max - min)) * 100);
    const targetPctRef = useRef(visualPctRef.current);
    const lerpRafRef = useRef(0);
    const { helpTextId, errorTextId, successTextId } = useFormId('slider-input');
    const idBase = useId('slider-input');
    const labelId = `${idBase}-label`;
    const inputId = `${idBase}-input`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
    const _isRequired = isRequired || necessityIndicator === 'required';

    const getRatio = useCallback((val: number) => (max === min ? 0 : (val - min) / (max - min)), [
      min,
      max,
    ]);

    const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);
    const effectiveStep = step > 0 ? step : 1;
    const snap = useCallback((v: number) => Math.round(v / effectiveStep) * effectiveStep, [
      effectiveStep,
    ]);
    const pct = getRatio(currentValue) * 100;

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
        const p = getRatio(val) * 100;
        targetPctRef.current = p;
        if (step > 1 && !isDraggingRef.current) {
          animateToTarget();
        } else {
          visualPctRef.current = p;
          applyPosition(p);
        }
      },
      [getRatio, step, applyPosition, animateToTarget],
    );

    // Position the thumb/fill imperatively via refs rather than through the JSX `style`
    // attribute (see visualPctRef usage below), so a React re-render triggered by
    // unrelated state (e.g. hover) can't stomp over an in-flight LERP animation with a
    // stale target percentage.
    const isFirstPositionRef = useRef(true);

    useEffect(() => {
      if (isDragging) return;
      if (isFirstPositionRef.current) {
        isFirstPositionRef.current = false;
        return;
      }
      positionDomElements(currentValue);
    }, [currentValue, isDragging, positionDomElements]);

    const setDragTransitions = useCallback((isDraggingActive: boolean) => {
      if (thumbRef.current) thumbRef.current.style.transition = isDraggingActive ? 'none' : '';
      if (fillRef.current) fillRef.current.style.transition = isDraggingActive ? 'none' : '';
    }, []);

    // Holds the teardown for the currently-attached drag listeners (if any).
    const detachDragListenersRef = useRef<() => void>(noop);

    // Attached synchronously from the mousedown/touchstart handler itself (not from a
    // useEffect keyed on `isDragging`) so there's no gap between drag starting and the
    // window listeners being live — closing a race where a very fast mouseup could fire
    // before a state-driven effect had a chance to attach it, leaving isDragging stuck true.
    const attachDragListeners = useCallback(() => {
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
        detachDragListenersRef.current();
        cancelAnimationFrame(rafRef.current);
        cancelAnimationFrame(lerpRafRef.current);
        setDragTransitions(false);
        const val = clamp(snap(getValueFromPosition(clientX)));
        const p = getRatio(val) * 100;
        visualPctRef.current = p;
        targetPctRef.current = p;
        applyPosition(p);
        isDraggingRef.current = false;
        setIsDragging(false);
        updateValue(val);
        onChangeEnd?.({ value: val });
      };
      const handleMouseMove = (e: MouseEvent): void => onMove(e.clientX);
      const handleMouseUp = (e: MouseEvent): void => onEnd(e.clientX);
      const handleTouchMove = (e: TouchEvent): void => {
        e.preventDefault();
        onMove(e.touches[0].clientX);
      };
      const handleTouchEnd = (e: TouchEvent): void => {
        if (!e.changedTouches.length) {
          detachDragListenersRef.current();
          setDragTransitions(false);
          isDraggingRef.current = false;
          setIsDragging(false);
          return;
        }
        onEnd(e.changedTouches[0].clientX);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      detachDragListenersRef.current = (): void => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        detachDragListenersRef.current = noop;
      };
    }, [
      clamp,
      snap,
      getValueFromPosition,
      positionDomElements,
      updateValue,
      getRatio,
      applyPosition,
      setDragTransitions,
      onChangeEnd,
    ]);

    useEffect(() => {
      return () => {
        detachDragListenersRef.current();
        cancelAnimationFrame(lerpRafRef.current);
      };
    }, []);

    const startDrag = useCallback(
      (clientX: number) => {
        isPointerFocusRef.current = true;
        setDragTransitions(true);
        isDraggingRef.current = true;
        setIsDragging(true);
        const val = clamp(snap(getValueFromPosition(clientX)));
        dragValueRef.current = val;
        positionDomElements(val);
        onChangeStart?.({ value: val });
        updateValue(val);
        attachDragListeners();
      },
      [
        getValueFromPosition,
        updateValue,
        onChangeStart,
        clamp,
        snap,
        positionDomElements,
        setDragTransitions,
        attachDragListeners,
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

    const isKeyActiveRef = useRef(false);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (isDisabled) return;
        let newVal = currentValue;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            newVal = currentValue + effectiveStep;
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            newVal = currentValue - effectiveStep;
            break;
          case 'Home':
            newVal = min;
            break;
          case 'End':
            newVal = max;
            break;
          case 'PageUp':
            newVal = currentValue + effectiveStep * 10;
            break;
          case 'PageDown':
            newVal = currentValue - effectiveStep * 10;
            break;
          default:
            return;
        }
        e.preventDefault();
        if (!isKeyActiveRef.current) {
          isKeyActiveRef.current = true;
          onChangeStart?.({ value: currentValue });
        }
        updateValue(newVal);
      },
      [isDisabled, currentValue, effectiveStep, min, max, updateValue, onChangeStart],
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent) => {
        const isSliderKey = [
          'ArrowRight',
          'ArrowUp',
          'ArrowLeft',
          'ArrowDown',
          'Home',
          'End',
          'PageUp',
          'PageDown',
        ].includes(e.key);
        if (!isSliderKey || !isKeyActiveRef.current) return;
        isKeyActiveRef.current = false;
        onChangeEnd?.({ value: currentValueRef.current });
      },
      [onChangeEnd],
    );

    const handleThumbFocus = useCallback(() => {
      setIsThumbFocused(true);
    }, []);

    const handleThumbBlur = useCallback(() => {
      setIsThumbFocused(false);
      isPointerFocusRef.current = false;
      // If focus leaves mid-keypress, no keyup will ever arrive for this element. Beyond
      // resetting the ref (so the next keydown isn't swallowed), fire onChangeEnd so a
      // consumer that reacted to onChangeStart always gets a matching close for the gesture.
      if (isKeyActiveRef.current) {
        isKeyActiveRef.current = false;
        onChangeEnd?.({ value: currentValueRef.current });
      }
    }, [onChangeEnd]);

    const handleThumbPointerDown = useCallback(() => {
      isPointerFocusRef.current = true;
    }, []);

    const handleThumbMouseEnter = useCallback(() => {
      if (!isDisabled) setIsThumbHovered(true);
    }, [isDisabled]);

    const handleThumbMouseLeave = useCallback(() => {
      setIsThumbHovered(false);
    }, []);

    const [inputStringValue, setInputStringValue] = useState(String(currentValue));
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
      if (!isInputFocused) {
        setInputStringValue(String(currentValue));
      }
    }, [currentValue, isInputFocused]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputStringValue(e.target.value);
    }, []);

    const handleInputBlur = useCallback(() => {
      setIsInputFocused(false);
      const raw = parseFloat(inputStringValue);
      if (isNaN(raw)) {
        setInputStringValue(String(currentValueRef.current));
        onBlur?.({ name, value: currentValueRef.current });
      } else {
        updateValue(raw);
        onBlur?.({ name, value: raw });
      }
    }, [inputStringValue, updateValue, onBlur, name]);

    const handleInputFocus = useCallback(() => {
      setIsInputFocused(true);
      onFocus?.({ name, value: currentValueRef.current });
    }, [onFocus, name]);

    const showHalo = !isDisabled && (isThumbHovered || isDragging);
    const thumbSize = isDragging ? tokens.thumb.pressedSize[size] : tokens.thumb.size[size];
    const haloSize = thumbSize * tokens.thumb.haloMultiplier;
    const haloTransitionDuration = castWebType(makeMotionTime(theme.motion.duration.xquick));
    const haloTransitionEasing = castWebType(
      showHalo ? theme.motion.easing.entrance : theme.motion.easing.exit,
    );

    // Auto-render tick marks for discrete sliders with a manageable number of steps,
    // matching the decisions.md heuristic: (max - min) / step <= 20.
    // Only render when stepCount is an integer to avoid misaligned or overflowing ticks.
    const stepCount = effectiveStep > 0 ? (max - min) / effectiveStep : 0;
    const shouldShowTicks =
      effectiveStep > 0 &&
      Number.isFinite(stepCount) &&
      Number.isInteger(stepCount) &&
      stepCount > 0 &&
      stepCount <= 20;
    const tickSize = tokens.tick.size[size];
    const tickColorOnActiveTrack = get(theme.colors, tokens.color.tick.onActiveTrack, '');
    const tickColorOnInactiveTrack = get(theme.colors, tokens.color.tick.onInactiveTrack, '');
    const tickPositions = shouldShowTicks
      ? Array.from({ length: stepCount + 1 }, (_, index) => (index / stepCount) * 100)
      : [];

    const thumbColor = get(
      theme.colors,
      isDisabled ? tokens.color.thumb.disabled : tokens.color.thumb.fill,
      '',
    );
    const trackFillColor = get(
      theme.colors,
      isDisabled ? tokens.color.track.fillDisabled : tokens.color.track.fill,
      '',
    );

    const suffixColor = isDisabled
      ? get(theme.colors, tokens.color.label.disabled, '')
      : get(theme.colors, tokens.color.label.text, '');

    const willRenderHintText =
      (validationState === 'error' && Boolean(errorText)) ||
      (validationState === 'success' && Boolean(successText)) ||
      Boolean(helpText);

    const describedById =
      validationState === 'error' && errorText
        ? errorTextId
        : validationState === 'success' && successText
        ? successTextId
        : helpText
        ? helpTextId
        : undefined;
    const isInvalid = validationState === 'error';

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
                as="label"
                htmlFor={inputId}
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
                  height={`${tokens.track.height}px`}
                  borderRadius="max"
                  backgroundColor={tokens.color.track.bg}
                />

                {/* Fill track */}
                <div
                  ref={fillRef}
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: `${visualPctRef.current}%`,
                    height: tokens.track.height,
                    borderRadius: theme.border.radius.max,
                    backgroundColor: trackFillColor,
                    transition: isDragging
                      ? 'none'
                      : `width ${castWebType(
                          makeMotionTime(theme.motion.duration.quick),
                        )} ${castWebType(theme.motion.easing.standard)}`,
                  }}
                />

                {/* Tick marks — decorative, auto-rendered for manageable step counts */}
                {shouldShowTicks && (
                  <div
                    aria-hidden="true"
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                  >
                    {tickPositions.map((tickPct) => (
                      <div
                        key={tickPct}
                        style={{
                          position: 'absolute',
                          left: `${tickPct}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: tickSize,
                          height: tickSize,
                          borderRadius: '50%',
                          backgroundColor:
                            tickPct <= pct ? tickColorOnActiveTrack : tickColorOnInactiveTrack,
                        }}
                      />
                    ))}
                  </div>
                )}

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
                  aria-invalid={isInvalid}
                  aria-describedby={describedById}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  onFocus={handleThumbFocus}
                  onBlur={handleThumbBlur}
                  onPointerDown={handleThumbPointerDown}
                  onMouseEnter={handleThumbMouseEnter}
                  onMouseLeave={handleThumbMouseLeave}
                  style={{
                    position: 'absolute',
                    left: `${visualPctRef.current}%`,
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
                      backgroundColor: isDragging
                        ? get(theme.colors, tokens.color.halo.dragging, '')
                        : get(theme.colors, tokens.color.halo.default, ''),
                      opacity: showHalo ? 1 : 0,
                      transition: isDragging
                        ? 'none'
                        : `opacity ${haloTransitionDuration} ${haloTransitionEasing}, width ${haloTransitionDuration} ${haloTransitionEasing}, height ${haloTransitionDuration} ${haloTransitionEasing}`,
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
                id={inputId}
                type="number"
                $size={size}
                $validationState={validationState}
                value={inputStringValue}
                min={min}
                max={max}
                step={step}
                disabled={isDisabled}
                required={_isRequired}
                aria-invalid={isInvalid}
                aria-describedby={describedById}
                aria-label={
                  suffix
                    ? `${label ?? accessibilityLabel ?? 'Slider'} value in ${suffix}`
                    : label ?? accessibilityLabel ?? 'Slider value'
                }
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {suffix && (
                <span
                  style={{
                    color: suffixColor,
                    fontSize: theme.typography.fonts.size[size === 'large' ? 100 : 75],
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
                isLabelLeftPositioned
                  ? `${tokens.label.width + tokens.gap.labelToSlider}px`
                  : undefined
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
  displayName: 'SliderInput',
});

export { SliderInput };
