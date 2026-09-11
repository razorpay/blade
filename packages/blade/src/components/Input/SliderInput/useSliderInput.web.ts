import React from 'react';
import { getValueFromPointer, snapValue, clamp } from './utils';
import { SLIDER_DRAG_SLOP } from './sliderInputTokens';
import type { ValueRange } from './utils';
import { useControllableState } from '~utils/useControllable';

type UseSliderInputProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (args: { value: number }) => void;
  onChangeEnd?: (args: { value: number }) => void;
  range: ValueRange;
  isDisabled: boolean;
};

type UseSliderInputReturn = {
  value: number;
  /** Wraps the track and shares its box, so its rect is the track's rect. */
  trackAreaRef: React.RefObject<HTMLDivElement>;
  thumbRef: React.RefObject<HTMLDivElement>;
  /** 0 until first measured. Suppression treats that as "show everything". */
  trackWidth: number;
  isRTL: boolean;
  /** Pointer is down. Drives the highlight and the value indicator. */
  isDragging: boolean;
  /**
   * Pointer is down and has moved past the slop, so the thumb is being scrubbed rather than
   * placed. Only this suppresses the movement easing: a click should glide to where it landed.
   */
  isScrubbing: boolean;
  controlProps: {
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => void;
  };
  thumbProps: {
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onKeyUp: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  };
};

const useSliderInput = ({
  value: valueProp,
  defaultValue,
  onChange,
  onChangeEnd,
  range,
  isDisabled,
}: UseSliderInputProps): UseSliderInputReturn => {
  const trackAreaRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = React.useState(0);
  const [isRTL, setIsRTL] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isScrubbing, setIsScrubbing] = React.useState(false);

  /** Where the press landed, so movement can be measured against it. */
  const pointerDownX = React.useRef<number | null>(null);

  /**
   * The value when the current interaction began. `onChangeEnd` is for expensive work, so a
   * drag or a click that lands back on the starting value should not trigger it.
   */
  const valueAtInteractionStart = React.useRef<number | null>(null);

  const [rawValue, setRawValue] = useControllableState<number>({
    value: valueProp,
    defaultValue: defaultValue ?? range.min,
    onChange: (next) => onChange?.({ value: next }),
  });

  // A controlled value that is off-step still renders on the nearest step, so what the thumb
  // shows and what the keyboard steps from are never out of sync.
  const value = snapValue(rawValue, range);

  const setValue = React.useCallback(
    (next: number) => setRawValue(() => snapValue(next, range)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setRawValue, range.min, range.max, range.step],
  );

  const endInteraction = React.useCallback(
    (finalValue: number) => {
      const startValue = valueAtInteractionStart.current;
      valueAtInteractionStart.current = null;
      if (startValue !== null && startValue !== finalValue) {
        onChangeEnd?.({ value: finalValue });
      }
    },
    [onChangeEnd],
  );

  React.useEffect(() => {
    const element = trackAreaRef.current;
    if (!element) return undefined;

    setIsRTL(window.getComputedStyle(element).direction === 'rtl');

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setTrackWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getValueAtPointer = React.useCallback(
    (clientX: number): number => {
      const element = trackAreaRef.current;
      if (!element) return range.min;
      const rect = element.getBoundingClientRect();
      return getValueFromPointer({
        clientX,
        trackRect: { left: rect.left, width: rect.width },
        isRTL,
        range,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRTL, range.min, range.max, range.step],
  );

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDisabled || event.button !== 0) return;
      // Keeps the pointer bound to the slider once the drag leaves the 32px box, so the thumb
      // keeps tracking instead of stalling at whichever edge the pointer crossed. Guarded
      // because pointer capture is absent in some non-browser DOM implementations.
      if (typeof event.currentTarget.setPointerCapture === 'function') {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      // Stops the drag from turning into a text selection across the rest of the page. It also
      // suppresses the focus the browser would otherwise move to the thumb, so that is done
      // by hand below: without it, arrow keys do nothing until the user tabs in separately.
      event.preventDefault();
      thumbRef.current?.focus();

      valueAtInteractionStart.current = value;
      pointerDownX.current = Number.isFinite(event.clientX) ? event.clientX : null;
      setIsDragging(true);
      // Deliberately not scrubbing yet. Until the pointer moves this is a click, and the
      // thumb glides to it rather than teleporting.
      setValue(getValueAtPointer(event.clientX));
    },
    [isDisabled, value, setValue, getValueAtPointer],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || isDisabled) return;

      const startX = pointerDownX.current;
      const travelled = startX === null ? NaN : Math.abs(event.clientX - startX);
      /*
       * Past the slop the press is a drag, so the easing is dropped from here on and the thumb
       * sits exactly under the finger. Batched with the value so the first scrubbed frame is
       * already un-eased.
       *
       * A move event is itself evidence of a drag; the slop only exists to forgive a mouse
       * that jitters between press and release. So when the distance cannot be measured at
       * all, err towards dragging: losing the glide is far less bad than easing every frame
       * and leaving the thumb trailing the pointer.
       */
      if (!isScrubbing && (!Number.isFinite(travelled) || travelled > SLIDER_DRAG_SLOP)) {
        setIsScrubbing(true);
      }
      setValue(getValueAtPointer(event.clientX));
    },
    [isDragging, isScrubbing, isDisabled, setValue, getValueAtPointer],
  );

  const stopDragging = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
      setIsScrubbing(false);
      pointerDownX.current = null;
      endInteraction(getValueAtPointer(event.clientX));
    },
    [isDragging, endInteraction, getValueAtPointer],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled) return;

      const { min, max, step } = range;
      // A page jump of one step would be pointless, so it moves ten steps or a tenth of the
      // range, whichever is larger.
      const pageStep = Math.max(step * 10, (max - min) / 10);
      const direction = isRTL ? -1 : 1;

      const next = ((): number | null => {
        switch (event.key) {
          case 'ArrowRight':
            return value + step * direction;
          case 'ArrowLeft':
            return value - step * direction;
          case 'ArrowUp':
            return value + step;
          case 'ArrowDown':
            return value - step;
          case 'PageUp':
            return value + pageStep;
          case 'PageDown':
            return value - pageStep;
          case 'Home':
            return min;
          case 'End':
            return max;
          default:
            return null;
        }
      })();

      if (next === null) return;
      // Arrow and Page keys would otherwise scroll the page under the slider.
      event.preventDefault();

      if (valueAtInteractionStart.current === null) {
        valueAtInteractionStart.current = value;
      }
      setValue(clamp(next, min, max));
    },
    [isDisabled, range, value, isRTL, setValue],
  );

  const onKeyUp = React.useCallback(() => {
    // Holding a key repeats keydown but fires keyup once, so a held adjustment commits once.
    if (valueAtInteractionStart.current === null) return;
    endInteraction(value);
  }, [endInteraction, value]);

  return {
    value,
    trackAreaRef,
    thumbRef,
    trackWidth,
    isRTL,
    isDragging,
    isScrubbing,
    controlProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: stopDragging,
      onPointerCancel: stopDragging,
    },
    thumbProps: { onKeyDown, onKeyUp },
  };
};

export { useSliderInput };
export type { UseSliderInputProps, UseSliderInputReturn };
