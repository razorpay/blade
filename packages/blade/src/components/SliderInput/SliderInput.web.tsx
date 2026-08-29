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
import { useBreakpoint, makeSpace, castWebType, makeMotionTime } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import get from '~utils/lodashButBetter/get';
import { throwBladeError } from '~utils/logger';
import { TextInput } from '~components/Input/TextInput';

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
      helpText,
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
      onChange: (newValue) => onChange?.({ name, value: newValue }),
    });

    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const [isThumbHovered, setIsThumbHovered] = useState(false);
    const [isThumbFocused, setIsThumbFocused] = useState(false);
    const isPointerFocusRef = useRef(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    if (__DEV__) {
      if (min > max) {
        throwBladeError({
          message: `\`min\` (${min}) must not be greater than \`max\` (${max}) for SliderInput.`,
          moduleName: 'SliderInput',
        });
      }
    }

    const effectiveStep = step > 0 ? step : 1;
    const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);
    // Snap to the nearest step anchored at `min` (not at zero), with two fixes over the
    // naive round(v / step) * step:
    // 1. `max` is always reachable — when the range isn't a multiple of step (e.g. min=0,
    //    max=10, step=3), dragging to the end / End key / typing the max would otherwise
    //    land on the last full step (9) and never reach 10. If the candidate is closer to
    //    max than to its snapped step, max wins.
    // 2. Results are rounded to the precision of min/step so fractional steps don't leak
    //    floating-point artifacts into the field (0.1 + 0.2 → 0.3, not 0.30000000000000004).
    const snap = useCallback(
      (v: number) => {
        const decimalsOf = (n: number): number => (String(n).split('.')[1] ?? '').length;
        const decimals = Math.max(decimalsOf(effectiveStep), decimalsOf(min));
        const snapped = min + Math.round((v - min) / effectiveStep) * effectiveStep;
        if (snapped >= max) return max;
        const nearest = Math.abs(max - v) < Math.abs(v - snapped) ? max : snapped;
        return Number(nearest.toFixed(decimals));
      },
      [effectiveStep, min, max],
    );
    // Clamp/snap the resolved initial value into [min, max] before first paint. Without this,
    // e.g. min={10} with no value/defaultValue leaves the initial value at 0 → the thumb/fill
    // render off the left edge and the numeric input shows a below-min number. This mirrors the
    // clamp+snap that updateValue applies on interaction, so the value is always in-range.
    const currentValue = clamp(snap(internalValue ?? defaultValue));
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;

    // Draft state of the numeric input. While the input is focused, the user's draft wins;
    // once it isn't (or a track/thumb gesture sets a value), it mirrors the committed value.
    const [inputStringValue, setInputStringValue] = useState(String(currentValue));
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
      if (!isInputFocused) {
        setInputStringValue(String(currentValue));
      }
    }, [currentValue, isInputFocused]);

    const dragValueRef = useRef(0);
    const rafRef = useRef(0);
    const visualPctRef = useRef(max === min ? 0 : ((currentValue - min) / (max - min)) * 100);
    const { helpTextId } = useFormId('slider-input');
    const idBase = useId('slider-input');
    const labelId = `${idBase}-label`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
    const _isRequired = isRequired || necessityIndicator === 'required';

    const getRatio = useCallback((val: number) => (max === min ? 0 : (val - min) / (max - min)), [
      min,
      max,
    ]);

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

    // Both the thumb (left) and the fill (width) are positioned here, in the same
    // frame, and both carry the SAME CSS transition (see JSX) — one shared animation
    // is what keeps them moving in lockstep for programmatic jumps (Enter/keyboard/
    // track-click). During drag the transition is disabled (setDragTransitions), so
    // both track the pointer 1:1. Do NOT animate these separately (an earlier JS
    // lerp on top of the fill's CSS transition made them move at different paces).
    const applyPosition = useCallback((p: number) => {
      visualPctRef.current = p;
      if (thumbRef.current) thumbRef.current.style.left = `${p}%`;
      if (fillRef.current) fillRef.current.style.width = `${p}%`;
    }, []);

    const positionDomElements = useCallback(
      (val: number) => {
        applyPosition(getRatio(val) * 100);
      },
      [getRatio, applyPosition],
    );

    // Position the thumb/fill imperatively via refs rather than through the JSX `style`
    // attribute (see visualPctRef usage below), so a React re-render triggered by
    // unrelated state (e.g. hover) can't stomp over an in-flight move with a stale
    // percentage.
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
        setDragTransitions(false);
        const val = clamp(snap(getValueFromPosition(clientX)));
        applyPosition(getRatio(val) * 100);
        isDraggingRef.current = false;
        setIsDragging(false);
        updateValue(val);
        // The numeric input may still be focused with a stale draft (mousedown on the
        // track preventDefaults, so the input never blurs). Sync the draft to the gesture
        // value so it can't later commit over what the user just picked on the track.
        setInputStringValue(String(val));
        onChangeEnd?.({ name, value: val });
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
      name,
    ]);

    useEffect(() => {
      return () => {
        detachDragListenersRef.current();
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
        onChangeStart?.({ name, value: val });
        updateValue(val);
        // See onEnd: keep a still-focused input's draft in sync with the gesture value.
        setInputStringValue(String(val));
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
        name,
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
        // Shift+Arrow jumps by step * 10 (the same "large step" as PageUp/PageDown),
        // matching the WAI-ARIA slider pattern and Base UI's largeStep behavior.
        const arrowStep = e.shiftKey ? effectiveStep * 10 : effectiveStep;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            newVal = currentValue + arrowStep;
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            newVal = currentValue - arrowStep;
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
          onChangeStart?.({ name, value: currentValue });
        }
        updateValue(newVal);
      },
      [isDisabled, currentValue, effectiveStep, min, max, updateValue, onChangeStart, name],
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
        onChangeEnd?.({ name, value: currentValueRef.current });
      },
      [onChangeEnd, name],
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
        onChangeEnd?.({ name, value: currentValueRef.current });
      }
    }, [onChangeEnd, name]);

    const handleThumbPointerDown = useCallback(() => {
      isPointerFocusRef.current = true;
    }, []);

    const handleThumbMouseEnter = useCallback(() => {
      if (!isDisabled) setIsThumbHovered(true);
    }, [isDisabled]);

    const handleThumbMouseLeave = useCallback(() => {
      setIsThumbHovered(false);
    }, []);

    const handleInputChange = useCallback(({ value: typed }: { name?: string; value?: string }) => {
      setInputStringValue(typed ?? '');
    }, []);

    // Parse + clamp/snap the current draft and commit it. Returns the committed value.
    // Shared by Enter (commit while staying focused) and blur (commit on leaving).
    // An unparseable draft resets the field to the current value and commits nothing new.
    const commitInputDraft = useCallback(() => {
      const raw = parseFloat(inputStringValue);
      const committed = isNaN(raw) ? currentValueRef.current : clamp(snap(raw));
      if (!isNaN(raw)) {
        updateValue(raw);
      }
      // Reflect the committed (clamped/snapped) value in the field immediately — e.g.
      // typing 26 with max 24 and pressing Enter must show 24, not the raw 26.
      setInputStringValue(String(committed));
      return committed;
    }, [inputStringValue, clamp, snap, updateValue]);

    const handleInputBlur = useCallback(() => {
      setIsInputFocused(false);
      // onBlur/onChangeEnd report what was actually committed (clamped/snapped), and the
      // gesture opened by onChangeStart on focus is always closed — even when nothing
      // valid was typed — so start/end callbacks come in pairs.
      const committed = commitInputDraft();
      onBlur?.({ name, value: committed });
      onChangeEnd?.({ name, value: committed });
    }, [commitInputDraft, onBlur, onChangeEnd, name]);

    // Enter commits the draft (slider thumb snaps to it) while keeping focus in the
    // field, matching the standard expectation for numeric steppers.
    const handleInputKeyDown = useCallback(
      ({ key }: { name?: string; key?: string }) => {
        if (key !== 'Enter') return;
        const committed = commitInputDraft();
        onChangeEnd?.({ name, value: committed });
      },
      [commitInputDraft, onChangeEnd, name],
    );

    const handleInputFocus = useCallback(() => {
      setIsInputFocused(true);
      onFocus?.({ name, value: currentValueRef.current });
      // Typing is a value-editing gesture like drag/keyboard: open it with onChangeStart on
      // focus so the start → change → end contract holds for all three interaction modes.
      onChangeStart?.({ name, value: currentValueRef.current });
    }, [onFocus, onChangeStart, name]);

    const showHalo = !isDisabled && (isThumbHovered || isDragging);
    const thumbSize = isDragging ? tokens.thumb.pressedSize[size] : tokens.thumb.size[size];
    const haloSize = thumbSize * tokens.thumb.haloMultiplier;
    // One shared movement animation for programmatic jumps (Enter/keyboard/track-click):
    // the thumb's `left` and the fill's `width` use the identical duration + easing so
    // both move in lockstep. During drag, transitions are disabled for 1:1 tracking.
    const moveTransitionDuration = castWebType(makeMotionTime(theme.motion.duration.quick));
    const moveTransitionEasing = castWebType(theme.motion.easing.standard);
    const haloTransitionDuration = castWebType(makeMotionTime(theme.motion.duration.xquick));
    const haloTransitionEasing = castWebType(
      showHalo ? theme.motion.easing.entrance : theme.motion.easing.exit,
    );

    const thumbColor = get(
      theme.colors,
      isDisabled ? tokens.color.thumb.disabled : tokens.color.thumb.fill,
      '',
    );
    // The disabled tint is translucent; without an opaque base the track line shows
    // through the marker. Mirrors the Figma construction: base-filled frame + tint circle.
    const thumbDisabledBaseColor = get(theme.colors, tokens.color.thumb.disabledBase, '');
    const trackFillColor = get(
      theme.colors,
      isDisabled ? tokens.color.track.fillDisabled : tokens.color.track.fill,
      '',
    );

    const describedById = helpText ? helpTextId : undefined;

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
              // Rendered as a span (not a native <label htmlFor>): the visible label names the
              // slider via aria-labelledby (the WAI-ARIA slider pattern), and the embedded
              // TextInput owns its internal input id and carries its own accessibilityLabel —
              // there is no reachable id for htmlFor to point at.
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
              {/* Track hit-area — inset horizontally by half the (pressed) thumb so the
                  thumb never overhangs the row edge: this keeps the 8px flex gap to the
                  numeric input visually intact at min/max values. All positioning math is
                  relative to the inner (inset) box, so drag geometry stays consistent. */}
              <BaseBox
                flex="1"
                height={makeSpace(tokens.interactionArea)}
                display="flex"
                alignItems="center"
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                onMouseDown={(handleMouseDown as unknown) as React.MouseEventHandler}
                onTouchStart={(handleTouchStart as unknown) as React.TouchEventHandler}
                paddingLeft={makeSpace(tokens.thumb.pressedSize[size] / 2)}
                paddingRight={makeSpace(tokens.thumb.pressedSize[size] / 2)}
                style={{ touchAction: 'none' }}
              >
                <BaseBox
                  ref={trackRef}
                  position="relative"
                  flex="1"
                  height="100%"
                  display="flex"
                  alignItems="center"
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
                        : `width ${moveTransitionDuration} ${moveTransitionEasing}`,
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
                    // The optional help text is associated with the slider (the primary control)
                    // only. The embedded TextInput and the thumb represent the same value, so
                    // describing both would make screen readers announce the hint twice — once
                    // per tab stop.
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
                      width: tokens.interactionArea,
                      height: tokens.interactionArea,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      background: 'transparent',
                      cursor: isDisabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                      zIndex: 2,
                      touchAction: 'none',
                      // Must be the exact same duration/easing as the fill's width
                      // transition — see moveTransitionDuration above.
                      transition: isDragging
                        ? 'none'
                        : `left ${moveTransitionDuration} ${moveTransitionEasing}`,
                    }}
                  >
                    {/* Halo */}
                    <div
                      style={{
                        position: 'absolute',
                        width: showHalo ? haloSize : 0,
                        height: showHalo ? haloSize : 0,
                        borderRadius: theme.border.radius.round,
                        backgroundColor: get(theme.colors, tokens.color.halo, ''),
                        opacity: showHalo ? 1 : 0,
                        transition: isDragging
                          ? 'none'
                          : `opacity ${haloTransitionDuration} ${haloTransitionEasing}, width ${haloTransitionDuration} ${haloTransitionEasing}, height ${haloTransitionDuration} ${haloTransitionEasing}`,
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Visual thumb — when disabled, an opaque base circle sits under the
                        translucent tint so the track can't show through (per Figma). */}
                    <div
                      style={{
                        position: 'relative',
                        width: thumbSize,
                        height: thumbSize,
                        borderRadius: theme.border.radius.round,
                        backgroundColor: isDisabled ? thumbDisabledBaseColor : thumbColor,
                        transition: isDragging
                          ? 'none'
                          : `all ${castWebType(
                              makeMotionTime(theme.motion.duration.xquick),
                            )} ${castWebType(theme.motion.easing.standard)}`,
                        pointerEvents: 'none',
                      }}
                    >
                      {isDisabled && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: theme.border.radius.round,
                            backgroundColor: thumbColor,
                          }}
                        />
                      )}
                    </div>
                  </StyledThumb>
                </BaseBox>
              </BaseBox>

              {/* Numeric input — composed from Blade's TextInput so border, focus, disabled,
                  sizing, and the trailing unit (suffix) all come from the design system.
                  It deliberately exposes only the editable value and the unit: the visible
                  label, help text, and value semantics live on the slider, so nothing is
                  announced twice. */}
              <BaseBox width={makeSpace(tokens.input.width)} flexShrink={0}>
                <TextInput
                  accessibilityLabel={
                    suffix
                      ? `${label ?? accessibilityLabel ?? 'Slider'} value in ${suffix}`
                      : `${label ?? accessibilityLabel ?? 'Slider'} value`
                  }
                  type="number"
                  // The Figma spec binds the field to Form.Input.Textfield.Small (32px,
                  // 12px text) for the medium slider — one size down from the slider's
                  // own size, so medium → small and large → medium.
                  size={size === 'large' ? 'medium' : 'small'}
                  name={name}
                  value={inputStringValue}
                  suffix={suffix}
                  isDisabled={isDisabled}
                  isRequired={_isRequired}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                />
              </BaseBox>
            </BaseBox>
          </BaseBox>

          {Boolean(helpText) && (
            <BaseBox
              marginLeft={
                isLabelLeftPositioned
                  ? `${tokens.label.width + tokens.gap.labelToSlider}px`
                  : undefined
              }
            >
              <FormHint type="help" helpText={helpText} helpTextId={helpTextId} />
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
