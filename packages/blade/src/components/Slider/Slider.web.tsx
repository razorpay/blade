import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow as floatingArrowMiddleware,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';
import styled from 'styled-components';
import type { SliderProps } from './types';
import { SLIDER_TOKENS } from './sliderTokens';
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
import { useBreakpoint, makeSpace, castWebType, makeMotionTime } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import get from '~utils/lodashButBetter/get';
import { throwBladeError, logger } from '~utils/logger';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { TooltipContent } from '~components/Tooltip/TooltipContent';
import { ARROW_WIDTH, ARROW_HEIGHT } from '~components/Tooltip/constants';
import { PopupArrow } from '~components/PopupArrow/PopupArrow';
import { componentZIndices } from '~utils/componentZIndices';
import { useMergeRefs } from '~utils/useMergeRefs';

const tokens = SLIDER_TOKENS;
const noop = (): void => undefined;

// Background track — a styled component (class CSS, not inline style) because the
// step-segmented variant paints with a repeating-linear-gradient, which inline styles
// can't carry through jsdom for tests/snapshots.
const StyledTrackBackground = styled.div<{ $background: string }>`
  position: absolute;
  left: 0;
  right: 0;
  height: ${tokens.track.height}px;
  border-radius: ${({ theme }) => theme.border.radius.max}px;
  ${({ $background }) => $background}
`;

const StyledThumb = styled.div<{
  $isFocused: boolean;
  $isDragging: boolean;
  $showFocusRing: boolean;
}>`
  outline: none;
  ${({ theme, $showFocusRing }) => $showFocusRing && getFocusRingStyles({ theme })}
`;

const _Slider = React.forwardRef<BladeElementRef, SliderProps>(
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
      showTooltip = true,
      showSteps = false,
      isDisabled = false,
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
          message: `\`min\` (${min}) must not be greater than \`max\` (${max}) for Slider.`,
          moduleName: 'Slider',
        });
      }
      // Material's slider hard-errors when step doesn't divide the range. We stay
      // lenient (max remains reachable via snap), but with showSteps the leftover
      // makes the last segment visibly shorter — worth a heads-up while developing.
      if (showSteps && step > 0 && max > min) {
        const stepsInRange = (max - min) / step;
        if (Math.abs(Math.round(stepsInRange) - stepsInRange) > 1e-9) {
          logger({
            message: `\`step\` (${step}) does not divide the \`min\`–\`max\` range (${min}–${max}) evenly. With \`showSteps\`, the last step segment will render shorter than the rest. Consider a step that is a factor of the range.`,
            moduleName: 'Slider',
            type: 'warn',
          });
        }
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

    const dragValueRef = useRef(0);
    const rafRef = useRef(0);
    const visualPctRef = useRef(max === min ? 0 : ((currentValue - min) / (max - min)) * 100);
    const idBase = useId('slider');
    const labelId = `${idBase}-label`;
    const { theme, colorScheme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

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
      onFocus?.({ name, value: currentValueRef.current });
    }, [onFocus, name]);

    const handleThumbBlur = useCallback(() => {
      setIsThumbFocused(false);
      isPointerFocusRef.current = false;
      onBlur?.({ name, value: currentValueRef.current });
      // If focus leaves mid-keypress, no keyup will ever arrive for this element. Beyond
      // resetting the ref (so the next keydown isn't swallowed), fire onChangeEnd so a
      // consumer that reacted to onChangeStart always gets a matching close for the gesture.
      if (isKeyActiveRef.current) {
        isKeyActiveRef.current = false;
        onChangeEnd?.({ name, value: currentValueRef.current });
      }
    }, [onBlur, onChangeEnd, name]);

    const handleThumbPointerDown = useCallback(() => {
      isPointerFocusRef.current = true;
    }, []);

    const handleThumbMouseEnter = useCallback(() => {
      if (!isDisabled) setIsThumbHovered(true);
    }, [isDisabled]);

    const handleThumbMouseLeave = useCallback(() => {
      setIsThumbHovered(false);
    }, []);

    const showHalo = !isDisabled && (isThumbHovered || isDragging);
    // The value tooltip is the slider's readout: it shows above the thumb while it is
    // hovered/dragged/keyboard-focused (mirroring Material's value indicator) and is
    // purely decorative for screen readers — the thumb already announces its value
    // via aria-valuenow/valuetext.
    const showValueTooltip =
      showTooltip && !isDisabled && (isThumbHovered || isDragging || isThumbFocused);
    const valueTooltipText = suffix ? `${currentValue} ${suffix}` : String(currentValue);

    // The value tooltip is positioned by the exact same floating-ui setup Blade's Tooltip
    // uses internally (same gap, middleware, and PopupArrow) — only `open` is controlled
    // by the slider's hover/drag/focus state, since a hover-triggered Tooltip would close
    // the moment the pointer drifts off the thumb mid-drag. `animationFrame: true` keeps
    // it glued to the thumb, whose position updates imperatively during drag. flip/shift
    // also move it out of the way when there's no room (e.g. under the label at the top
    // of the viewport) instead of covering other content.
    const tooltipArrowRef = useRef<SVGSVGElement>(null);
    const tooltipGap = theme.spacing[2];
    const {
      refs: tooltipRefs,
      floatingStyles: tooltipFloatingStyles,
      context: tooltipContext,
    } = useFloating({
      placement: 'top',
      open: showValueTooltip,
      strategy: 'fixed',
      middleware: [
        shift({ crossAxis: false, padding: tooltipGap }),
        flip({ padding: tooltipGap }),
        offset(tooltipGap + ARROW_HEIGHT),
        floatingArrowMiddleware({ element: tooltipArrowRef, padding: ARROW_WIDTH }),
      ],
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, { animationFrame: true }),
    });
    const thumbMergedRef = useMergeRefs(thumbRef, tooltipRefs.setReference);
    const isDarkMode = colorScheme === 'dark';
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
    const trackBgColor = get(theme.colors, tokens.color.track.bg, '');
    // Step-segmented track (showSteps): the background track is painted as blocks
    // with a transparent gap sliced at every step position, so the discrete
    // stops read visually. A single repeating gradient (one cycle per step) keeps
    // it one DOM node regardless of step count. The solid fill renders on top, so
    // the filled portion stays continuous — matching the Figma spec.
    const stepPct = max > min ? (effectiveStep / (max - min)) * 100 : 100;
    // Density guard, mirroring Material's tick auto-hide: segments render only while
    // each step block is at least stepMinBlockWidth px wide on screen. Denser than
    // that, the gaps stop being discernible increments and the track falls back to
    // continuous.
    const [trackWidth, setTrackWidth] = useState<number | null>(null);
    useIsomorphicLayoutEffect(() => {
      if (!showSteps || !trackRef.current) {
        return undefined;
      }
      // Measured in a layout effect — before the browser paints — so the density
      // decision lands in the same frame as layout, exactly like Material's canvas
      // draw pass. A too-dense track can never flash its segments for a frame.
      setTrackWidth(trackRef.current.getBoundingClientRect().width);
      if (typeof ResizeObserver === 'undefined') {
        return undefined;
      }
      const resizeObserver = new ResizeObserver((entries) => {
        setTrackWidth(entries[0].contentRect.width);
      });
      resizeObserver.observe(trackRef.current);
      return () => resizeObserver.disconnect();
    }, [showSteps]);
    const stepBlockWidth = trackWidth === null ? null : (trackWidth * stepPct) / 100;
    // A 0 width means the slider isn't laid out (hidden tab/accordion, SSR) — nothing
    // is visible there, so segments stay on and the next real measurement decides.
    const showStepSegments =
      showSteps &&
      stepPct < 100 &&
      (stepBlockWidth === null ||
        trackWidth === 0 ||
        stepBlockWidth >= tokens.track.stepMinBlockWidth);
    const segmentedTrackBackground = `repeating-linear-gradient(to right, ${trackBgColor} 0, ${trackBgColor} calc(${stepPct}% - ${tokens.track.stepGap}px), transparent calc(${stepPct}% - ${tokens.track.stepGap}px), transparent ${stepPct}%)`;

    return (
      <BaseBox
        ref={ref as React.Ref<HTMLDivElement>}
        {...metaAttribute({ name: MetaConstants.Slider, testID })}
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
              // slider via aria-labelledby (the WAI-ARIA slider pattern) — a slider thumb is
              // not a labelable form element, so there is no id for htmlFor to point at.
              <FormLabel as="span" position={labelPosition} id={labelId} size={size}>
                {label}
              </FormLabel>
            )}

            {/* Track row */}
            <BaseBox display="flex" alignItems="center" flex="1">
              {/* Track hit-area — inset horizontally by half the (pressed) thumb so the
                  thumb never overhangs the row edge at min/max values. All positioning math
                  is relative to the inner (inset) box, so drag geometry stays consistent. */}
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
                  <StyledTrackBackground
                    $background={
                      showStepSegments
                        ? `background-image: ${segmentedTrackBackground};`
                        : `background-color: ${trackBgColor};`
                    }
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
                    ref={thumbMergedRef}
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

                  {/* Value tooltip — shown when the numeric field is hidden, while the
                      thumb is hovered/dragged/focused. Rendered with Blade's own tooltip
                      pieces (TooltipContent + PopupArrow) in a portal, positioned by the
                      floating-ui setup above. Decorative for screen readers: the thumb
                      already announces its value via aria-valuenow/valuetext. */}
                  {showValueTooltip && (
                    <FloatingPortal>
                      <BaseBox
                        ref={tooltipRefs.setFloating}
                        style={tooltipFloatingStyles}
                        pointerEvents="none"
                        zIndex={componentZIndices.tooltip}
                        aria-hidden="true"
                      >
                        <TooltipContent
                          style={{}}
                          colorScheme={colorScheme}
                          arrow={
                            <PopupArrow
                              ref={tooltipArrowRef}
                              context={tooltipContext}
                              width={ARROW_WIDTH}
                              height={ARROW_HEIGHT}
                              fillColor={theme.colors.popup.background.gray.intense}
                              strokeColor={
                                isDarkMode ? theme.colors.popup.border.gray.intense : undefined
                              }
                              strokeWidth={isDarkMode ? 1 : 0}
                            />
                          }
                        >
                          {valueTooltipText}
                        </TooltipContent>
                      </BaseBox>
                    </FloatingPortal>
                  )}
                </BaseBox>
              </BaseBox>
            </BaseBox>
          </BaseBox>
        </BaseBox>
      </BaseBox>
    );
  },
);

const Slider = assignWithoutSideEffects(_Slider, {
  componentId: MetaConstants.Slider,
  displayName: 'Slider',
});

export { Slider };
