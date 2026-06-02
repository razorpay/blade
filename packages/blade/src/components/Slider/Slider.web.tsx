import React from 'react';
import { StyledSliderInput } from './StyledSlider.web';
import type { SliderProps } from './types';
import { useFormId } from '~components/Form/useFormId';
import { FormHint } from '~components/Form';
import { FormLabel } from '~components/Form/FormLabel';
import BaseBox from '~components/Box/BaseBox';
import { useControllableState } from '~utils/useControllable';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const Slider = ({
  value,
  onChange,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  label,
  labelPosition = 'top',
  helpText,
  errorText,
  validationState = 'none',
  isDisabled = false,
  isRequired = false,
  name,
  accessibilityLabel,
  size = 'medium',
  testID,
  ...rest
}: SliderProps): React.ReactElement => {
  if (__DEV__) {
    if (!label && !accessibilityLabel) {
      throwBladeError({
        message:
          'Slider requires either a `label` or an `accessibilityLabel` prop for accessibility.',
        moduleName: 'Slider',
      });
    }
  }

  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue,
    onChange: (v) => v,
  });

  const { inputId, labelId, errorTextId, helpTextId } = useFormId('slider');

  const hasError = validationState === 'error';
  const hasHelpText = Boolean(helpText);
  const hasErrorText = hasError && Boolean(errorText);

  // Compute fill percentage inline (SSR-safe — pure math, no DOM access).
  // Guard min === max to avoid divide-by-zero.
  const fillPct = min === max ? 0 : ((currentValue - min) / (max - min)) * 100;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (isDisabled) return;
    const newValue = Number(event.target.value);
    setCurrentValue(() => newValue);
    onChange?.({ value: newValue, name, event });
  };

  const a11yProps = makeAccessible({
    ...(label
      ? { labelledBy: labelId }
      : { label: accessibilityLabel }),
    valueMin: min,
    valueMax: max,
    valueNow: currentValue,
    required: isRequired,
    invalid: hasError,
    disabled: isDisabled,
    ...(hasErrorText ? { errorMessage: errorTextId } : {}),
    ...(hasHelpText ? { describedBy: helpTextId } : {}),
  });

  const isHorizontalLayout = labelPosition === 'left';

  return (
    <BaseBox
      display="flex"
      flexDirection={isHorizontalLayout ? 'row' : 'column'}
      alignItems={isHorizontalLayout ? 'center' : 'flex-start'}
      gap="spacing.3"
      {...metaAttribute({ name: MetaConstants.Slider, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {label ? (
        <FormLabel
          as="label"
          htmlFor={inputId}
          id={labelId}
          position={labelPosition}
          necessityIndicator={isRequired ? 'required' : 'none'}
        >
          {label}
        </FormLabel>
      ) : null}

      <BaseBox display="flex" flexDirection="column" flex="1" width="100%">
        <StyledSliderInput
          // Only set id when a label is present — the id/htmlFor pair enables
          // clicking the label to focus the input. With accessibilityLabel only,
          // there is no <label> element so id is unnecessary and would cause an
          // SSR hydration mismatch (Blade's useId generates undefined on the server).
          id={label ? inputId : undefined}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          name={name}
          disabled={isDisabled}
          onChange={handleChange}
          $size={size}
          $isDisabled={isDisabled}
          $hasError={hasError}
          style={{ '--slider-fill-pct': `${fillPct}%` } as React.CSSProperties}
          {...a11yProps}
        />

        {hasHelpText || hasErrorText ? (
          <FormHint
            type={hasError ? 'error' : 'help'}
            helpText={helpText}
            errorText={errorText}
            errorTextId={errorTextId}
            helpTextId={helpTextId}
          />
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

Slider.displayName = 'Slider';

export { Slider };
