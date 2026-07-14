import React from 'react';
import type { SliderProps, SliderRangeValue, SliderValue } from './types';
import {
  getGeneratedMarks,
  getPercent,
  isSameValue,
  normalizeValue,
  snapValue,
} from './sliderUtils';
import { getKeyboardValue, sliderKeyboardKeys } from './sliderKeyboard';
import { SliderControls } from './SliderControls.web';
import { SliderFooter, SliderHeader } from './SliderLabels.web';
import BaseBox from '~components/Box/BaseBox';
import { useFormId } from '~components/Form/useFormId';
import { useControllableState } from '~utils/useControllable';
import { throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { getInnerMotionRef, getOuterMotionRef } from '~utils/getMotionRefs';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { mergeRefs } from '~utils/useMergeRefs';

const _Slider: React.ForwardRefRenderFunction<BladeElementRef, SliderProps> = (props, ref) => {
  const {
    accessibilityLabel,
    color = 'information',
    defaultValue,
    errorText,
    helpText,
    isDisabled = false,
    label,
    marks,
    max = 100,
    maxLabel,
    min = 0,
    minLabel,
    name,
    onChange,
    onChangeEnd,
    showMarks = false,
    showMinMax = false,
    showThumbValue = false,
    showValue = true,
    size = 'medium',
    step = 1,
    testID,
    validationState = 'none',
    value,
    valueFormatter = String,
    valueText,
    variant = 'single',
    _motionMeta,
    ...rest
  } = props;

  if (max <= min) {
    throwBladeError({ message: '`max` must be greater than `min`.', moduleName: 'Slider' });
  }
  if (step <= 0) {
    throwBladeError({ message: '`step` must be greater than zero.', moduleName: 'Slider' });
  }

  const initialValue = React.useMemo(
    () =>
      normalizeValue(
        (defaultValue as SliderValue | undefined) ?? (variant === 'range' ? [min, max] : min),
        variant,
        min,
        max,
        step,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const onChangeValue = onChange as
    | ((args: { name?: string; value: SliderValue }) => void)
    | undefined;
  const onChangeEndValue = onChangeEnd as
    | ((args: { name?: string; value: SliderValue }) => void)
    | undefined;
  const [controllableValue, setControllableValue] = useControllableState<SliderValue>({
    value: value as SliderValue | undefined,
    defaultValue: initialValue,
    onChange: (nextValue) => onChangeValue?.({ name, value: nextValue }),
    shouldUpdate: (previous, next) => !isSameValue(previous, next),
  });
  const currentValue = normalizeValue(controllableValue, variant, min, max, step);
  const latestValueRef = React.useRef(currentValue);

  const { inputId, errorTextId, helpTextId, labelId } = useFormId('slider');
  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const pointerStartedOnThumbRef = React.useRef(false);
  const [activeThumb, setActiveThumb] = React.useState<0 | 1>(0);
  const hasError = validationState === 'error';
  const rangeValue: SliderRangeValue = React.useMemo(
    () => (typeof currentValue === 'number' ? [min, currentValue] : currentValue),
    [currentValue, min],
  );
  const startValue = variant === 'range' ? rangeValue[0] : min;
  const endValue = typeof currentValue === 'number' ? currentValue : rangeValue[1];
  const startPercent = getPercent(startValue, min, max);
  const endPercent = getPercent(endValue, min, max);
  const generatedMarks = React.useMemo(() => marks ?? getGeneratedMarks(min, max, step), [
    marks,
    min,
    max,
    step,
  ]);
  const visibleMarks = React.useMemo(
    () =>
      showMarks ? generatedMarks.filter((mark) => mark.value >= min && mark.value <= max) : [],
    [generatedMarks, min, max, showMarks],
  );
  const describedBy = hasError && errorText ? errorTextId : helpText ? helpTextId : undefined;
  const displayValue =
    valueText ??
    (variant === 'range'
      ? `${valueFormatter(rangeValue[0])} - ${valueFormatter(rangeValue[1])}`
      : valueFormatter(endValue));

  const updateValue = React.useCallback(
    (nextValue: SliderValue): SliderValue => {
      const normalized = normalizeValue(nextValue, variant, min, max, step);
      latestValueRef.current = normalized;
      setControllableValue(() => normalized);
      return normalized;
    },
    [max, min, setControllableValue, step, variant],
  );

  const commitValue = React.useCallback(() => {
    onChangeEndValue?.({ name, value: latestValueRef.current });
  }, [name, onChangeEndValue]);

  const updateThumbValue = React.useCallback(
    (index: 0 | 1, nextValue: number): void => {
      const next = snapValue(nextValue, min, max, step);
      if (variant === 'single') {
        updateValue(next);
        return;
      }

      updateValue(
        index === 0
          ? [Math.min(next, rangeValue[1]), rangeValue[1]]
          : [rangeValue[0], Math.max(next, rangeValue[0])],
      );
    },
    [max, min, rangeValue, step, updateValue, variant],
  );

  const handleInputChange = React.useCallback(
    (index: 0 | 1) => (event: React.ChangeEvent<HTMLInputElement>) =>
      updateThumbValue(index, Number(event.currentTarget.value)),
    [updateThumbValue],
  );

  const handleInputKeyDown = React.useCallback(
    (index: 0 | 1) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!sliderKeyboardKeys.has(event.key)) return;
      const next = getKeyboardValue({
        current: Number(event.currentTarget.value),
        inputMax: Number(event.currentTarget.max),
        inputMin: Number(event.currentTarget.min),
        key: event.key,
        step,
      });
      if (next === undefined) return;
      event.preventDefault();
      updateThumbValue(index, next);
    },
    [step, updateThumbValue],
  );

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (isDisabled || event.target !== event.currentTarget || !trackRef.current) return;
    pointerStartedOnThumbRef.current = false;
    const bounds = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    const next = snapValue(min + ratio * (max - min), min, max, step);

    if (variant === 'single') {
      updateValue(next);
      startInputRef.current?.focus();
    } else {
      const nextThumb = Math.abs(next - rangeValue[0]) <= Math.abs(next - rangeValue[1]) ? 0 : 1;
      setActiveThumb(nextThumb);
      updateValue(
        nextThumb === 0
          ? [Math.min(next, rangeValue[1]), rangeValue[1]]
          : [rangeValue[0], Math.max(next, rangeValue[0])],
      );
      (nextThumb === 0 ? startInputRef : endInputRef).current?.focus();
    }
    commitValue();
  };

  const handleThumbPointerDown = React.useCallback((index: 0 | 1) => {
    pointerStartedOnThumbRef.current = true;
    setActiveThumb(index);
  }, []);

  const handleThumbPointerUp = React.useCallback(() => {
    if (pointerStartedOnThumbRef.current) {
      commitValue();
    }
  }, [commitValue]);

  return (
    <BaseBox
      ref={getOuterMotionRef({ _motionMeta, ref })}
      display="flex"
      flexDirection="column"
      width="100%"
      {...metaAttribute({ testID, name: MetaConstants.Slider })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <SliderHeader
        displayValue={displayValue}
        inputId={inputId}
        label={label}
        labelId={labelId}
        showValue={showValue}
        size={size}
        variant={variant}
      />
      <SliderControls
        accessibilityLabel={accessibilityLabel}
        activeThumb={activeThumb}
        color={color}
        describedBy={describedBy}
        endInputRef={endInputRef}
        endPercent={endPercent}
        endValue={endValue}
        hasError={hasError}
        inputId={inputId}
        isDisabled={isDisabled}
        label={label}
        labelId={labelId}
        max={max}
        min={min}
        name={name}
        onCommit={commitValue}
        onInputChange={handleInputChange}
        onInputKeyDown={handleInputKeyDown}
        onThumbPointerDown={handleThumbPointerDown}
        onThumbPointerUp={handleThumbPointerUp}
        onTrackPointerDown={handleTrackPointerDown}
        rangeValue={rangeValue}
        showThumbValue={showThumbValue}
        size={size}
        startInputRef={mergeRefs(getInnerMotionRef({ _motionMeta, ref }), startInputRef)}
        startPercent={startPercent}
        step={step}
        trackRef={trackRef}
        valueFormatter={valueFormatter}
        variant={variant}
        visibleMarks={visibleMarks}
      />
      <SliderFooter
        errorText={errorText}
        errorTextId={errorTextId}
        hasError={hasError}
        helpText={helpText}
        helpTextId={helpTextId}
        maxText={maxLabel ?? valueFormatter(max)}
        minText={minLabel ?? valueFormatter(min)}
        showMinMax={showMinMax}
        size={size}
      />
    </BaseBox>
  );
};

const Slider = assignWithoutSideEffects(React.forwardRef(_Slider), { displayName: 'Slider' });

export { Slider };
