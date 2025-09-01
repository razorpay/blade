import React from 'react';
import type { TimePickerProps } from './types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { DataAnalyticsAttribute } from '~utils/types';
import { TimeInput } from './TimeInput.web';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { TimeSelector } from './TimeSelector';

const _BaseTimePicker = ({
  value,
  defaultValue,
  onChange,
  onApply,
  isOpen,
  defaultIsOpen,
  onOpenChange,
  label,
  labelPosition = 'top',
  accessibilityLabel,
  errorText,
  helpText,
  isDisabled,
  isRequired,
  successText,
  validationState,
  size = 'medium',
  autoFocus,
  necessityIndicator,
  name,
  placeholder,
  showFooterActions = true,
  timeFormat = '12h',
  minuteStep = 1,
  labelSuffix,
  labelTrailing,

  ...props
}: TimePickerProps & StyledPropsBlade & DataAnalyticsAttribute): React.ReactElement => {
  // add default value for uncontrolled
  return (
    <>
      <TimeInput
        time={value}
        onChange={onChange}
        label={label}
        helpText={helpText}
        errorText={errorText}
        successText={successText}
        validationState={validationState}
        isDisabled={isDisabled}
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        autoFocus={autoFocus}
        name={name}
        placeholder={placeholder}
        size={size}
        labelPosition={labelPosition}
        labelSuffix={labelSuffix}
        labelTrailing={labelTrailing}
        timeFormat={timeFormat}
        {...props}
      />
      <TimeSelector
        time={value}
        defaultValue={defaultValue}
        onChange={onChange}
        size={size}
        timeFormat={timeFormat}
        isOpen={isOpen}
        defaultIsOpen={defaultIsOpen}
        onOpenChange={onOpenChange}
        minuteStep={minuteStep}
        showFooterActions={showFooterActions}
        onApply={onApply}
        // setControlledValue={setControlledValue}
        {...props}
      />
    </>
  );
};

const BaseTimePicker = assignWithoutSideEffects(_BaseTimePicker, {
  displayName: 'BaseTimePicker',
  componentId: 'BaseTimePicker',
});
export { BaseTimePicker };
