import React from 'react';
import styled from 'styled-components';
import type { SliderProps } from './types';
import { sliderThumbSize, sliderTrackHeight } from './sliderTokens';
import { useFormId } from '~components/Form/useFormId';
import { FormHint, FormLabel } from '~components/Form';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography/Text';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils/makeSize';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import clamp from '~utils/lodashButBetter/clamp';

type StyledRangeInputProps = {
  trackHeight: number;
  thumbSize: number;
  filledPercent: number;
  trackColor: string;
  filledColor: string;
  thumbColor: string;
  thumbBorderColor: string;
  isDisabled?: boolean;
};

const StyledRangeInput = styled.input<StyledRangeInputProps>(
  ({
    trackHeight,
    thumbSize,
    filledPercent,
    trackColor,
    filledColor,
    thumbColor,
    thumbBorderColor,
    isDisabled,
  }) => {
    const thumbOffset = makeSize(thumbSize);
    const trackHeightPx = makeSize(trackHeight);
    const thumbBorderRadius = makeSize(thumbSize / 2);
    const cursor = isDisabled ? 'not-allowed' : 'pointer';

    return {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: '100%',
      height: thumbOffset,
      background: 'transparent',
      outline: 'none',
      cursor,
      display: 'block',
      margin: 0,
      padding: 0,

      // Track
      '&::-webkit-slider-runnable-track': {
        height: trackHeightPx,
        borderRadius: makeSize(trackHeight / 2),
        background: `linear-gradient(to right, ${filledColor} ${filledPercent}%, ${trackColor} ${filledPercent}%)`,
        cursor,
      },
      '&::-moz-range-track': {
        height: trackHeightPx,
        borderRadius: makeSize(trackHeight / 2),
        background: trackColor,
        cursor,
      },
      '&::-moz-range-progress': {
        height: trackHeightPx,
        borderRadius: makeSize(trackHeight / 2),
        background: filledColor,
      },

      // Thumb
      '&::-webkit-slider-thumb': {
        WebkitAppearance: 'none',
        appearance: 'none',
        width: thumbOffset,
        height: thumbOffset,
        borderRadius: thumbBorderRadius,
        background: thumbColor,
        border: `2px solid ${thumbBorderColor}`,
        cursor,
        marginTop: `calc(-${thumbOffset} / 2 + ${trackHeightPx} / 2)`,
        boxSizing: 'border-box',
      },
      '&::-moz-range-thumb': {
        width: thumbOffset,
        height: thumbOffset,
        borderRadius: thumbBorderRadius,
        background: thumbColor,
        border: `2px solid ${thumbBorderColor}`,
        cursor,
        boxSizing: 'border-box',
      },

      // Focus ring
      '&:focus-visible::-webkit-slider-thumb': {
        outline: `2px solid ${thumbBorderColor}`,
        outlineOffset: '2px',
      },
      '&:focus-visible::-moz-range-thumb': {
        outline: `2px solid ${thumbBorderColor}`,
        outlineOffset: '2px',
      },
    };
  },
);

const _Slider: React.ForwardRefRenderFunction<BladeElementRef, SliderProps> = (
  {
    label,
    labelPosition = 'top',
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    name,
    isDisabled = false,
    size = 'medium',
    showValue = true,
    accessibilityLabel,
    helpText,
    errorText,
    successText,
    validationState = 'none',
    testID,
    ...rest
  },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const { inputId, errorTextId, helpTextId, successTextId, labelId } = useFormId('slider');

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number>(
    defaultValue !== undefined ? defaultValue : min,
  );
  const currentValue = isControlled ? clamp(value, min, max) : internalValue;
  const filledPercent = ((currentValue - min) / (max - min)) * 100;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.({ value: newValue, name });
    },
    [isControlled, onChange, name],
  );

  const trackHeight = sliderTrackHeight[size];
  const thumbSize = sliderThumbSize[size];

  const isError = validationState === 'error';

  const trackColor = isDisabled
    ? (getIn(theme, 'colors.interactive.background.gray.disabled') as string)
    : (getIn(theme, 'colors.interactive.background.gray.default') as string);

  const filledColor = isDisabled
    ? (getIn(theme, 'colors.interactive.background.primary.faded') as string)
    : isError
    ? (getIn(theme, 'colors.feedback.background.negative.intense') as string)
    : (getIn(theme, 'colors.interactive.background.primary.default') as string);

  const thumbColor = getIn(theme, 'colors.interactive.background.staticWhite.default') as string;
  const thumbBorderColor = isDisabled
    ? (getIn(theme, 'colors.interactive.background.primary.faded') as string)
    : isError
    ? (getIn(theme, 'colors.feedback.background.negative.intense') as string)
    : (getIn(theme, 'colors.interactive.background.primary.default') as string);

  const hintType: 'error' | 'help' | 'success' =
    validationState === 'error' ? 'error' : validationState === 'success' ? 'success' : 'help';

  const describedByIds = [
    helpText && validationState === 'none' ? helpTextId : null,
    errorText && validationState === 'error' ? errorTextId : null,
    successText && validationState === 'success' ? successTextId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseBox
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.Slider, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox display="flex" flexDirection="column" width="100%">
        {label || showValue ? (
          <BaseBox
            display="flex"
            flexDirection="row"
            justifyContent={label ? 'space-between' : 'flex-end'}
            alignItems="center"
            marginBottom="spacing.3"
          >
            {label ? (
              <FormLabel
                as="label"
                htmlFor={inputId}
                id={labelId}
                position={labelPosition}
                size="medium"
              >
                {label}
              </FormLabel>
            ) : null}
            {showValue ? (
              <Text variant="body" size="small" color="surface.text.gray.subtle">
                {currentValue}
              </Text>
            ) : null}
          </BaseBox>
        ) : null}

        <StyledRangeInput
          ref={ref as React.Ref<HTMLInputElement>}
          id={inputId}
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={isDisabled}
          trackHeight={trackHeight}
          thumbSize={thumbSize}
          filledPercent={filledPercent}
          trackColor={trackColor}
          filledColor={filledColor}
          thumbColor={thumbColor}
          thumbBorderColor={thumbBorderColor}
          isDisabled={isDisabled}
          aria-label={!label ? accessibilityLabel ?? undefined : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={describedByIds || undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={isDisabled || undefined}
        />

        <FormHint
          type={hintType}
          helpText={helpText}
          errorText={errorText}
          successText={successText}
          errorTextId={errorTextId}
          helpTextId={helpTextId}
          successTextId={successTextId}
          size="medium"
        />
      </BaseBox>
    </BaseBox>
  );
};

const Slider = assignWithoutSideEffects(React.forwardRef(_Slider), {
  displayName: 'Slider',
});

export { Slider };
