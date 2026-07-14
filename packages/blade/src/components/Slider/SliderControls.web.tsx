import React from 'react';
import type { SliderMark, SliderProps, SliderRangeValue } from './types';
import { sliderTokens } from './sliderTokens';
import { sliderKeyboardKeys } from './sliderKeyboard';
import { getPercent } from './sliderUtils';
import {
  MarkDot,
  MarkLabel,
  NativeRangeInput,
  StyledTrackArea,
  ThumbValueLabel,
  TrackFill,
  TrackLine,
} from './SliderTrack.web';
import type { FeedbackColors } from '~tokens/theme/theme';

type SliderSize = NonNullable<SliderProps['size']>;
type SliderVariant = NonNullable<SliderProps['variant']>;

type SliderControlsProps = {
  accessibilityLabel?: string;
  activeThumb: 0 | 1;
  color: FeedbackColors;
  describedBy?: string;
  endInputRef: React.Ref<HTMLInputElement>;
  endPercent: number;
  endValue: number;
  hasError: boolean;
  inputId: string;
  isDisabled: boolean;
  label?: string;
  labelId?: string;
  max: number;
  min: number;
  name?: string;
  onCommit: () => void;
  onInputChange: (index: 0 | 1) => React.ChangeEventHandler<HTMLInputElement>;
  onInputKeyDown: (index: 0 | 1) => React.KeyboardEventHandler<HTMLInputElement>;
  onThumbPointerDown: (index: 0 | 1) => void;
  onThumbPointerUp: () => void;
  onTrackPointerDown: React.PointerEventHandler<HTMLDivElement>;
  rangeValue: SliderRangeValue;
  showThumbValue: boolean;
  size: SliderSize;
  startInputRef: React.Ref<HTMLInputElement>;
  startPercent: number;
  step: number;
  trackRef: React.Ref<HTMLDivElement>;
  valueFormatter: (value: number) => string;
  variant: SliderVariant;
  visibleMarks: SliderMark[];
};

const SliderControls = ({
  accessibilityLabel,
  activeThumb,
  color,
  describedBy,
  endInputRef,
  endPercent,
  endValue,
  hasError,
  inputId,
  isDisabled,
  label,
  labelId,
  max,
  min,
  name,
  onCommit,
  onInputChange,
  onInputKeyDown,
  onThumbPointerDown,
  onThumbPointerUp,
  onTrackPointerDown,
  rangeValue,
  showThumbValue,
  size,
  startInputRef,
  startPercent,
  step,
  trackRef,
  valueFormatter,
  variant,
  visibleMarks,
}: SliderControlsProps): React.ReactElement => {
  const tokens = sliderTokens.size[size];
  const hasMarkLabels = visibleMarks.some((mark) => Boolean(mark.label));
  const trackStyleProps = {
    $color: color,
    $hasError: hasError,
    $hasMarkLabels: hasMarkLabels,
    $hasThumbValue: showThumbValue,
    $isDisabled: isDisabled,
    $size: size,
    $trackHeight: tokens.track,
  } as const;
  const sharedInputProps = {
    'aria-describedby': describedBy,
    'aria-disabled': isDisabled || undefined,
    'aria-invalid': hasError || undefined,
    disabled: isDisabled,
    max,
    min,
    name,
    step,
    type: 'range',
  } as const;
  const getInputLabel = (index: 0 | 1): string | undefined => {
    if (variant === 'single') return accessibilityLabel ?? label;
    const baseLabel = accessibilityLabel ?? label;
    return baseLabel ? `${baseLabel} ${index === 0 ? 'minimum' : 'maximum'}` : undefined;
  };
  const getThumbPosition = (percent: number): string => {
    const offset = sliderTokens.interactionTarget / 2;
    const slope = sliderTokens.interactionTarget / 100;
    return `calc(${percent}% + ${offset - slope * percent}px)`;
  };

  return (
    <StyledTrackArea
      {...trackStyleProps}
      onPointerDown={onTrackPointerDown}
      role={variant === 'range' ? 'group' : undefined}
      aria-labelledby={variant === 'range' ? labelId : undefined}
    >
      <TrackLine {...trackStyleProps} ref={trackRef}>
        <TrackFill
          $color={color}
          $hasError={hasError}
          $isDisabled={isDisabled}
          style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
        />
        {visibleMarks.map((mark) => {
          const markPercent = getPercent(mark.value, min, max);
          return (
            <React.Fragment key={`${mark.value}-${mark.label ?? ''}`}>
              <MarkDot $isDisabled={isDisabled} style={{ left: `${markPercent}%` }} />
              {mark.label ? (
                <MarkLabel $trackHeight={tokens.track} style={{ left: `${markPercent}%` }}>
                  {mark.label}
                </MarkLabel>
              ) : null}
            </React.Fragment>
          );
        })}
      </TrackLine>

      {showThumbValue && variant === 'range' ? (
        <ThumbValueLabel aria-hidden style={{ left: getThumbPosition(startPercent) }}>
          {valueFormatter(rangeValue[0])}
        </ThumbValueLabel>
      ) : null}
      {showThumbValue ? (
        <ThumbValueLabel aria-hidden style={{ left: getThumbPosition(endPercent) }}>
          {valueFormatter(endValue)}
        </ThumbValueLabel>
      ) : null}

      <NativeRangeInput
        {...sharedInputProps}
        {...trackStyleProps}
        $isActive={activeThumb === 0}
        $pressedThumbSize={tokens.pressedThumb}
        $thumbSize={tokens.thumb}
        aria-label={getInputLabel(0)}
        aria-valuemax={variant === 'range' ? rangeValue[1] : max}
        aria-valuemin={min}
        aria-valuenow={variant === 'range' ? rangeValue[0] : endValue}
        aria-valuetext={valueFormatter(variant === 'range' ? rangeValue[0] : endValue)}
        id={inputId}
        max={variant === 'range' ? rangeValue[1] : max}
        onChange={onInputChange(0)}
        onKeyDown={onInputKeyDown(0)}
        onKeyUp={(event) => sliderKeyboardKeys.has(event.key) && onCommit()}
        onPointerDown={() => onThumbPointerDown(0)}
        onPointerUp={onThumbPointerUp}
        ref={startInputRef}
        value={variant === 'range' ? rangeValue[0] : endValue}
      />
      {variant === 'range' ? (
        <NativeRangeInput
          {...sharedInputProps}
          {...trackStyleProps}
          $isActive={activeThumb === 1}
          $pressedThumbSize={tokens.pressedThumb}
          $thumbSize={tokens.thumb}
          aria-label={getInputLabel(1)}
          aria-valuemax={max}
          aria-valuemin={rangeValue[0]}
          aria-valuenow={rangeValue[1]}
          aria-valuetext={valueFormatter(rangeValue[1])}
          id={`${inputId}-end`}
          min={rangeValue[0]}
          onChange={onInputChange(1)}
          onKeyDown={onInputKeyDown(1)}
          onKeyUp={(event) => sliderKeyboardKeys.has(event.key) && onCommit()}
          onPointerDown={() => onThumbPointerDown(1)}
          onPointerUp={onThumbPointerUp}
          ref={endInputRef}
          value={rangeValue[1]}
        />
      ) : null}
    </StyledTrackArea>
  );
};

export { SliderControls };
