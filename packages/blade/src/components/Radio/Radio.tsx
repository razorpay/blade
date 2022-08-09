/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import type { OnChange } from './useRadio';
import { useRadio } from './useRadio';
import { RadioIcon } from './RadioIcon/RadioIcon';
import { useRadioGroupContext } from './RadioGroup/RadioContext';
import { FormHintText } from '~components/Form/FormHintText';
import Box from '~components/Box';
import { CheckboxLabel as RadioLabel } from '~components/Checkbox/CheckboxLabel';
import { CheckboxInput as RadioInput } from '~components/Checkbox/CheckboxInput';
import { CheckboxLabelText as RadioLabelText } from '~components/Checkbox/CheckboxLabelText';

type RadioProps = {
  /**
   * Sets the label text of the Radio
   */
  children: string;
  /**
   * Help text for the Radio
   */
  helpText?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * If `true`, the Radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
};

const Radio = ({ value, children, helpText, isDisabled }: RadioProps): React.ReactElement => {
  const groupProps = useRadioGroupContext();
  const isInsideGroup = !isEmpty(groupProps);

  if (!isInsideGroup) {
    throw new Error('[Blade Radio]: Cannot use <Radio /> outside of <RadioGroup />');
  }

  const isChecked = groupProps?.state?.isChecked(value);
  const defaultChecked =
    groupProps?.defaultValue === undefined ? undefined : groupProps?.defaultValue === value;
  const validationState = groupProps?.validationState;
  const hasError = validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const name = groupProps?.name;
  const showHelpText = !hasError && helpText;

  const handleChange: OnChange = ({ isChecked, value }) => {
    if (isChecked) {
      groupProps?.state?.setValue(value!);
    } else {
      groupProps?.state?.removeValue();
    }
  };

  const { state, ids, inputProps } = useRadio({
    defaultChecked,
    isChecked,
    hasError,
    isDisabled: _isDisabled,
    isRequired: groupProps.neccessityIndicator === 'required',
    name,
    value,
    onChange: handleChange,
  });

  return (
    <RadioLabel inputProps={state.isReactNative ? inputProps : {}}>
      <RadioInput
        isChecked={state.isChecked}
        isDisabled={_isDisabled}
        isNegative={hasError}
        inputProps={inputProps}
      />
      <RadioIcon isChecked={state.isChecked} isDisabled={_isDisabled} isNegative={hasError} />
      <Box>
        <RadioLabelText>{children}</RadioLabelText>
        {showHelpText && (
          <FormHintText id={ids?.helpTextId} variant="help">
            {helpText}
          </FormHintText>
        )}
      </Box>
    </RadioLabel>
  );
};

export { Radio, RadioProps };
