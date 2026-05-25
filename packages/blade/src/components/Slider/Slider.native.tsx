import React from 'react';
import RNSlider from '@react-native-community/slider';
import type { SliderProps } from './types';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { useFormId } from '~components/Form/useFormId';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';

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
  _ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const { labelId, helpTextId, errorTextId, successTextId } = useFormId('slider');

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number>(
    defaultValue !== undefined ? defaultValue : min,
  );
  const currentValue = isControlled && value !== undefined ? value : internalValue;
  const clampedValue = Math.min(Math.max(currentValue, min), max);

  const handleChange = React.useCallback(
    (newValue: number) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.({ value: newValue, name });
    },
    [isControlled, onChange, name],
  );

  const handleChangeEnd = React.useCallback(
    (newValue: number) => {
      onChangeEnd?.({ value: newValue, name });
    },
    [onChangeEnd, name],
  );

  const hasLabel = Boolean(label);
  const hasError = validationState === 'error';
  const hasSuccess = validationState === 'success';
  const hintType = hasError ? 'error' : hasSuccess ? 'success' : 'help';

  const minimumTrackTintColor = isDisabled
    ? (getIn(theme.colors, 'interactive.background.gray.disabled') as string)
    : (getIn(theme.colors, 'interactive.background.primary.default') as string);

  const maximumTrackTintColor = getIn(theme.colors, 'surface.background.gray.moderate') as string;

  const thumbTintColor = isDisabled
    ? (getIn(theme.colors, 'interactive.background.gray.disabled') as string)
    : (getIn(theme.colors, 'interactive.background.primary.default') as string);

  return (
    <BaseBox
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.Slider, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {hasLabel ? (
        <FormLabel
          as="span"
          necessityIndicator={necessityIndicator}
          position={labelPosition}
          id={labelId}
          size={size}
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
        >
          {label ?? ''}
        </FormLabel>
      ) : null}

      <RNSlider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={clampedValue}
        disabled={isDisabled}
        onValueChange={handleChange}
        onSlidingComplete={handleChangeEnd}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        accessibilityLabel={accessibilityLabel ?? label}
      />

      <BaseBox display="flex" flexDirection="row" justifyContent="space-between">
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
  );
};

const Slider = assignWithoutSideEffects(React.forwardRef(_Slider), {
  displayName: 'Slider',
});

export { Slider };
