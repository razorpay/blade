import React from 'react';
import styled, { css } from 'styled-components';
import type { SliderProps } from './types';
import { sliderThumbSize, sliderTrackHeight } from './sliderTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography/Text';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { makeMotionTime } from '~utils/makeMotionTime';
import getIn from '~utils/lodashButBetter/get';
import { useId } from '~utils/useId';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type StyledSliderInputProps = {
  $size: NonNullable<SliderProps['size']>;
  $fillPercent: number;
  $isDisabled: boolean;
  $trackColor: string;
  $fillColor: string;
  $thumbColor: string;
  $thumbColorDisabled: string;
  $thumbSize: number;
  $trackHeight: number;
  $transitionDuration: string;
  $transitionEasing: string;
};

const StyledSliderInput = styled.input<StyledSliderInputProps>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background: transparent;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  outline: none;
  margin: 0;
  padding: 0;

  &::-webkit-slider-runnable-track {
    height: ${({ $trackHeight }) => makeSize($trackHeight)};
    border-radius: 9999px;
    background: ${({ $trackColor, $fillColor, $fillPercent }) =>
      `linear-gradient(to right, ${$fillColor} 0%, ${$fillColor} ${$fillPercent}%, ${$trackColor} ${$fillPercent}%, ${$trackColor} 100%)`};
    transition-property: background;
    transition-duration: ${({ $transitionDuration }) => $transitionDuration};
    transition-timing-function: ${({ $transitionEasing }) => $transitionEasing};
  }

  &::-moz-range-track {
    height: ${({ $trackHeight }) => makeSize($trackHeight)};
    border-radius: 9999px;
    background: ${({ $trackColor }) => $trackColor};
  }

  &::-moz-range-progress {
    height: ${({ $trackHeight }) => makeSize($trackHeight)};
    border-radius: 9999px;
    background: ${({ $fillColor }) => $fillColor};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${({ $thumbSize }) => makeSize($thumbSize)};
    height: ${({ $thumbSize }) => makeSize($thumbSize)};
    border-radius: 50%;
    background: ${({ $thumbColor, $isDisabled, $thumbColorDisabled }) =>
      $isDisabled ? $thumbColorDisabled : $thumbColor};
    margin-top: ${({ $thumbSize, $trackHeight }) => makeSize(-($thumbSize - $trackHeight) / 2)};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition-property: background, transform;
    transition-duration: ${({ $transitionDuration }) => $transitionDuration};
    transition-timing-function: ${({ $transitionEasing }) => $transitionEasing};

    ${({ $isDisabled }) =>
      !$isDisabled &&
      css`
        &:hover {
          transform: scale(1.1);
        }
        &:active {
          transform: scale(1.05);
        }
      `}
  }

  &::-moz-range-thumb {
    border: none;
    width: ${({ $thumbSize }) => makeSize($thumbSize)};
    height: ${({ $thumbSize }) => makeSize($thumbSize)};
    border-radius: 50%;
    background: ${({ $thumbColor, $isDisabled, $thumbColorDisabled }) =>
      $isDisabled ? $thumbColorDisabled : $thumbColor};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible::-webkit-slider-thumb {
    outline: 2px solid ${({ $fillColor }) => $fillColor};
    outline-offset: 2px;
  }

  &:focus-visible::-moz-range-thumb {
    outline: 2px solid ${({ $fillColor }) => $fillColor};
    outline-offset: 2px;
  }
`;

const _Slider: React.ForwardRefRenderFunction<BladeElementRef, SliderProps> = (
  {
    label,
    accessibilityLabel,
    value,
    defaultValue = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    isDisabled = false,
    size = 'medium',
    name,
    showValue = true,
    testID,
    ...rest
  },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const id = useId('slider');

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const clampedValue = Math.min(Math.max(currentValue, min), max);
  const fillPercent = ((clampedValue - min) / (max - min)) * 100;

  const trackColor = getIn(theme, 'colors.surface.background.gray.moderate') as string;
  const fillColor = getIn(theme, 'colors.surface.background.primary.intense') as string;
  const thumbColor = getIn(theme, 'colors.surface.background.primary.intense') as string;
  const thumbColorDisabled = getIn(theme, 'colors.surface.background.gray.moderate') as string;
  const fillColorDisabled = getIn(theme, 'colors.surface.background.gray.moderate') as string;

  const transitionDuration = String(makeMotionTime(getIn(theme, 'motion.duration.2xquick')));
  const transitionEasing = getIn(theme, 'motion.easing.standard') as string;

  const trackHeight = sliderTrackHeight[size];
  const thumbSize = sliderThumbSize[size];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = Number(event.target.value);
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.({ value: newValue, event });
  };

  return (
    <BaseBox
      ref={ref as never}
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.Slider, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {(label || showValue) && (
        <BaseBox
          display="flex"
          flexDirection="row"
          justifyContent={label ? 'space-between' : 'flex-end'}
          marginBottom="spacing.3"
        >
          {label && (
            <BaseBox as="label" htmlFor={id}>
              <Text variant="body" size="small" color="surface.text.gray.subtle">
                {label}
              </Text>
            </BaseBox>
          )}
          {showValue && (
            <Text variant="body" size="small" color="surface.text.gray.subtle">
              {clampedValue}
            </Text>
          )}
        </BaseBox>
      )}

      <BaseBox position="relative" display="flex" alignItems="center" paddingY="spacing.2">
        <StyledSliderInput
          id={id}
          ref={ref as React.Ref<HTMLInputElement>}
          type="range"
          name={name}
          value={clampedValue}
          min={min}
          max={max}
          step={step}
          disabled={isDisabled}
          onChange={handleChange}
          aria-label={accessibilityLabel ?? label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          aria-valuetext={String(clampedValue)}
          aria-disabled={isDisabled}
          $size={size}
          $fillPercent={fillPercent}
          $isDisabled={isDisabled}
          $trackColor={isDisabled ? fillColorDisabled : trackColor}
          $fillColor={isDisabled ? fillColorDisabled : fillColor}
          $thumbColor={thumbColor}
          $thumbColorDisabled={thumbColorDisabled}
          $thumbSize={thumbSize}
          $trackHeight={trackHeight}
          $transitionDuration={transitionDuration}
          $transitionEasing={String(transitionEasing)}
        />
      </BaseBox>

      <BaseBox
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        marginTop="spacing.1"
      >
        <Text variant="body" size="xsmall" color="surface.text.gray.muted">
          {min}
        </Text>
        <Text variant="body" size="xsmall" color="surface.text.gray.muted">
          {max}
        </Text>
      </BaseBox>
    </BaseBox>
  );
};

const Slider = assignWithoutSideEffects(React.forwardRef(_Slider), {
  displayName: 'Slider',
});

export { Slider };
