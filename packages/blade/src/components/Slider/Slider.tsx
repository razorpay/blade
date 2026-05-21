import React from 'react';
import type { SliderProps } from './types';
import { sliderTokens } from './sliderTokens';
import { Text } from '~components/Typography/Text';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';
import clamp from '~utils/lodashButBetter/clamp';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _Slider: React.ForwardRefRenderFunction<BladeElementRef, SliderProps> = (
  {
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue = 0,
    onChange,
    isDisabled = false,
    label,
    showValue = false,
    accessibilityLabel,
    testID,
    ...rest
  },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState<number>(
    clamp(defaultValue, min, max),
  );
  const currentValue = isControlled ? clamp(value, min, max) : internalValue;

  const fillPercent = ((currentValue - min) / (max - min)) * 100;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.({ value: next });
    },
    [isControlled, onChange],
  );

  const trackColor = isDisabled
    ? theme.colors.surface.border.gray.subtle
    : theme.colors.surface.border.primary.normal;

  const thumbColor = isDisabled
    ? theme.colors.surface.border.gray.subtle
    : theme.colors.surface.border.primary.normal;

  const trackBackground = `linear-gradient(to right, ${trackColor} ${fillPercent}%, ${theme.colors.surface.border.gray.subtle} ${fillPercent}%)`;

  return (
    <BaseBox
      ref={ref as React.Ref<HTMLDivElement>}
      {...metaAttribute({ testID, name: MetaConstants.Slider })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {(label || showValue) && (
        <BaseBox display="flex" justifyContent="space-between" marginBottom="spacing.2">
          {label && (
            <Text size="small" color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}>
              {label}
            </Text>
          )}
          {showValue && (
            <Text size="small" color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}>
              {currentValue}
            </Text>
          )}
        </BaseBox>
      )}
      <BaseBox position="relative" display="flex" alignItems="center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={isDisabled}
          {...makeAccessible({ label: accessibilityLabel })}
          style={{
            width: '100%',
            height: `${sliderTokens.trackHeight}px`,
            borderRadius: `${sliderTokens.trackBorderRadius}px`,
            appearance: 'none',
            background: trackBackground,
            outline: 'none',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
          }}
        />
        <style>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: ${sliderTokens.thumbSize}px;
            height: ${sliderTokens.thumbSize}px;
            border-radius: ${sliderTokens.thumbBorderRadius}px;
            border: ${sliderTokens.thumbBorderWidth}px solid ${thumbColor};
            background: white;
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
          }
          input[type='range']::-moz-range-thumb {
            width: ${sliderTokens.thumbSize}px;
            height: ${sliderTokens.thumbSize}px;
            border-radius: ${sliderTokens.thumbBorderRadius}px;
            border: ${sliderTokens.thumbBorderWidth}px solid ${thumbColor};
            background: white;
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
          }
        `}</style>
      </BaseBox>
    </BaseBox>
  );
};

const Slider = assignWithoutSideEffects(React.forwardRef(_Slider), {
  displayName: 'Slider',
});

export { Slider };
export type { SliderProps };
