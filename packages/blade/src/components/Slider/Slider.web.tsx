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

type InternalChangeHandler = (args: {
  name?: string;
  value: SliderValue;
  event?: React.SyntheticEvent<HTMLInputElement>;
}) => void;

type InternalCommitHandler = (args: {
  name?: string;
  value: SliderValue;
}) => void;

const _Slider: React.ForwardRefRenderFunction<BladeElementRef, SliderProps> = (props, ref) => {
  const {
    accessibilityLabel,
    color = 'information',
    defaultValue,
    errorText,
    helpText,
    isDisabled = false,
    isRequired = false,
    label,
    labelPosition = 'top',
    marks,
    max = 100,
    maxLabel,
    min = 0,
    minLabel,
    name,
    necessityIndicator = 'required',
    onChange,
    onChangeEnd,
    showMarks = false,
    showMinMax = false,
    showThumbValue = false,
    showValue = true,
    size = 'medium',
    step = 1,
    successText,
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
  if (__DEV__) {
    if (!label && !accessibilityLabel) {
      throwBladeError({
        message: 'Either `label` or `accessibilityLabel` must be provided.',
        moduleName: 'Slider',
      });
    }
    if (marks && !showMarks) {
      throwBladeError({
        message:
          '`marks` was provided but `showMarks` is false. Set `showMarks={true}` to display marks.',
        moduleName: 'Slider',
      });
    }
  }

  // initialValue is computed only on mount. Stale values are acceptable here
  // because this is the uncontrolled default; subsequent renders use
  // controllableValue which reads from the controlled `value` prop or
  // the internal state that was seeded by this initial value.
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
  const onChangeValue = onChange as InternalChangeHandler | undefined;
  const onChangeEndValue = onChangeEnd as InternalCommitHandler | undefined;
  const latestValueRef = React.useRef<SliderValue>(initialValue);
  const latestEventRef = React.useRef<React.SyntheticEvent<HTMLInputElement> | undefined>(undefined);
  const [controllableValue, setControllableValue] = useControllableState<SliderValue>({
    value: value as SliderValue | undefined,
    defaultValue: initialValue,
    onChange: (nextValue) =>
      onChangeValue?.({ name, value: nextValue, event: latestEventRef.current }),
    shouldUpdate: (previous, next) => !isSameValue(previous, next),
  });
  const currentValue = React.useMemo(
    () => normalizeValue(controllableValue, variant, min, max, step),
    [controllableValue, variant, min, max, step],
  );
  latestValueRef.current = currentValue;

  const { inputId, errorTextId, helpTextId, labelId, successTextId } = useFormId('slider');
  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const pointerStartedOnThumbRef = React.useRef(false);
  const [activeThumb, setActiveThumb] = React.useState<0 | 1>(0);
  const hasError = validationState === 'error';
  const hasSuccess = validationState === 'success';
  const rangeValue: SliderRangeValue = React.useMemo(
    () => (typeof currentValue === 'number' ? [min, currentValue] : currentValue),
    [currentValue, min],
  );
  const rangeValueRef = React.useRef(rangeValue);
  rangeValueRef.current = rangeValue;
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
  const describedByParts: string[] = [];
  if (helpText) describedByParts.push(helpTextId);
  if (hasError && errorText) describedByParts.push(errorTextId);
  if (hasSuccess && successText) describedByParts.push(successTextId);
  const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;
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

      const currentRange = rangeValueRef.current;
      updateValue(
        index === 0
          ? [Math.min(next, currentRange[1]), currentRange[1]]
          : [currentRange[0], Math.max(next, currentRange[0])],
      );
    },
    [max, min, step, updateValue, variant],
  );

  const handleInputChange = React.useCallback(
    (index: 0 | 1) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      latestEventRef.current = event;
      updateThumbValue(index, Number(event.currentTarget.value));
    },
    [isDisabled, updateThumbValue],
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
      latestEventRef.current = event;
      updateThumbValue(index, next);
    },
    [step, updateThumbValue],
  );

  const handleInputKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (sliderKeyboardKeys.has(event.key)) {
        commitValue();
      }
    },
    [commitValue],
  );

  const handleTrackPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
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
    },
    [commitValue, isDisabled, max, min, rangeValue, step, updateValue, variant],
  );

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
      {labelPosition === 'left' ? (
        <BaseBox display="flex" flexDirection="row" alignItems="center" width="100%">
          <SliderHeader
            displayValue={displayValue}
            inputId={inputId}
            isRequired={isRequired}
            label={label}
            labelId={labelId}
            labelPosition={labelPosition}
            necessityIndicator={necessityIndicator}
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
            isRequired={isRequired}
            label={label}
            labelId={labelId}
            max={max}
            min={min}
            name={name}
            onInputChange={handleInputChange}
            onInputKeyDown={handleInputKeyDown}
            onInputKeyUp={handleInputKeyUp}
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
        </BaseBox>
      ) : (
        <>
          <SliderHeader
            displayValue={displayValue}
            inputId={inputId}
            isRequired={isRequired}
            label={label}
            labelId={labelId}
            labelPosition={labelPosition}
            necessityIndicator={necessityIndicator}
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
            isRequired={isRequired}
            label={label}
            labelId={labelId}
            max={max}
            min={min}
            name={name}
            onInputChange={handleInputChange}
            onInputKeyDown={handleInputKeyDown}
            onInputKeyUp={handleInputKeyUp}
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
        </>
      )}
      <SliderFooter
        errorText={errorText}
        errorTextId={errorTextId}
        hasError={hasError}
        hasSuccess={hasSuccess}
        helpText={helpText}
        helpTextId={helpTextId}
        successText={successText}
        successTextId={successTextId}
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
