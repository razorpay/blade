import React from 'react';
import styled, { css } from 'styled-components';
import type { SliderProps } from './types';
import { sliderThumbSize, sliderTrackHeight } from './sliderTokens';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { useFormId } from '~components/Form/useFormId';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeSize } from '~utils/makeSize';
import { makeAccessible } from '~utils/makeAccessible';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';

type StyledRangeInputProps = {
  theme: Theme;
  filledPercent: number;
  isDisabled?: boolean;
  size: NonNullable<SliderProps['size']>;
};

const StyledRangeInput = styled.input<StyledRangeInputProps>(
  ({ theme, filledPercent, isDisabled, size }) => {
    const thumbSize = makeSize(sliderThumbSize[size]);
    const trackHeight = makeSize(sliderTrackHeight[size]);
    const trackFilledColor = isDisabled
      ? getIn(theme.colors, 'interactive.background.gray.disabled')
      : getIn(theme.colors, 'interactive.background.primary.default');
    const trackUnfilledColor = getIn(theme.colors, 'surface.background.gray.moderate');
    const thumbColor = isDisabled
      ? getIn(theme.colors, 'interactive.background.gray.disabled')
      : getIn(theme.colors, 'interactive.background.primary.default');

    const trackBackground = `linear-gradient(to right, ${trackFilledColor} ${filledPercent}%, ${trackUnfilledColor} ${filledPercent}%)`;

    return css`
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: ${trackHeight};
      background: ${trackBackground};
      border-radius: ${theme.border.radius.round}px;
      outline: none;
      cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
      opacity: ${isDisabled ? 0.5 : 1};

      &:focus-visible {
        ${getFocusRingStyles({ theme })};
        border-radius: ${theme.border.radius.round}px;
      }

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: ${thumbSize};
        height: ${thumbSize};
        border-radius: ${theme.border.radius.round}px;
        background: ${thumbColor};
        cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
        box-shadow: ${theme.elevation.lowRaised};
        border: none;
      }

      /* Firefox */
      &::-moz-range-thumb {
        width: ${thumbSize};
        height: ${thumbSize};
        border-radius: ${theme.border.radius.round}px;
        background: ${thumbColor};
        cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
        box-shadow: ${theme.elevation.lowRaised};
        border: none;
      }

      &:not(:disabled)::-webkit-slider-thumb:hover {
        background: ${getIn(theme.colors, 'interactive.background.primary.highlighted')};
      }

      &:not(:disabled)::-moz-range-thumb:hover {
        background: ${getIn(theme.colors, 'interactive.background.primary.highlighted')};
      }
    `;
  },
);

const _Slider = (
  {
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    isDisabled = false,
    name,
    accessibilityLabel,
    showTooltip = false,
    label,
    labelPosition = 'top',
    necessityIndicator = 'none',
    labelSuffix,
    labelTrailing,
    helpText,
    errorText,
    successText,
    validationState = 'none',
    size = 'medium',
    testID,
    ...rest
  }: SliderProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const { inputId, labelId, helpTextId, errorTextId, successTextId } = useFormId('slider');

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number>(
    defaultValue !== undefined ? defaultValue : min,
  );

  const currentValue = isControlled && value !== undefined ? value : internalValue;
  const clampedValue = Math.min(Math.max(currentValue, min), max);
  const filledPercent = ((clampedValue - min) / (max - min)) * 100;

  const [showThumbTooltip, setShowThumbTooltip] = React.useState(false);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.({ value: newValue, name });
    },
    [isControlled, onChange, name],
  );

  const handlePointerDown = React.useCallback(() => {
    if (showTooltip) setShowThumbTooltip(true);
  }, [showTooltip]);

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLInputElement>) => {
      if (showTooltip) setShowThumbTooltip(false);
      const newValue = Number((event.target as HTMLInputElement).value);
      onChangeEnd?.({ value: newValue, name });
    },
    [showTooltip, onChangeEnd, name],
  );

  const hasLabel = Boolean(label);
  const hasError = validationState === 'error';
  const hasSuccess = validationState === 'success';
  const hintType = hasError ? 'error' : hasSuccess ? 'success' : 'help';

  const accessibilityDescribedBy = [
    hasError && errorTextId,
    !hasError && helpText && helpTextId,
    !hasError && hasSuccess && successTextId,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseBox
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.Slider, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        display="flex"
        flexDirection={labelPosition === 'left' ? 'row' : 'column'}
        alignItems={labelPosition === 'left' ? 'flex-start' : 'stretch'}
      >
        {hasLabel ? (
          <FormLabel
            as="label"
            necessityIndicator={necessityIndicator}
            position={labelPosition}
            id={labelId}
            htmlFor={inputId}
            size={size}
            labelSuffix={labelSuffix}
            labelTrailing={labelTrailing}
          >
            {label ?? ''}
          </FormLabel>
        ) : null}

        <BaseBox flex={1}>
          <BaseBox position="relative" width="100%">
            {showTooltip && showThumbTooltip ? (
              <BaseBox
                position="absolute"
                left={`${filledPercent}%`}
                bottom="100%"
                style={{ transform: 'translateX(-50%)', marginBottom: theme.spacing[2] }}
                backgroundColor="surface.background.gray.intense"
                padding="spacing.2"
                borderRadius="small"
              >
                <Text variant="body" size="small" color="surface.text.staticWhite.normal">
                  {clampedValue}
                </Text>
              </BaseBox>
            ) : null}

            <StyledRangeInput
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              type="range"
              min={min}
              max={max}
              step={step}
              value={isControlled ? clampedValue : undefined}
              defaultValue={isControlled ? undefined : clampedValue}
              disabled={isDisabled}
              name={name}
              filledPercent={filledPercent}
              isDisabled={isDisabled}
              size={size}
              onChange={handleChange}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              {...(accessibilityLabel || label
                ? makeAccessible({
                    label: accessibilityLabel ?? label,
                    valueNow: clampedValue,
                    valueMin: min,
                    valueMax: max,
                    valueText: String(clampedValue),
                    ...(hasError ? { invalid: true } : {}),
                    ...(accessibilityDescribedBy ? { describedBy: accessibilityDescribedBy } : {}),
                  })
                : {})}
            />
          </BaseBox>

          <BaseBox display="flex" justifyContent="space-between" marginTop="spacing.2">
            <Text variant="body" size="small" color="surface.text.gray.muted">
              {min}
            </Text>
            <Text variant="body" size="small" color="surface.text.gray.muted">
              {max}
            </Text>
          </BaseBox>

          <FormHint
            type={hintType}
            helpText={helpText}
            errorText={errorText}
            successText={successText}
            helpTextId={helpTextId}
            errorTextId={errorTextId}
            successTextId={successTextId}
            size={size}
          />
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

const Slider = assignWithoutSideEffects(React.forwardRef(_Slider), {
  displayName: 'Slider',
});

export { Slider };
