/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import type { OnChange } from './useRadio';
import { useRadio } from './useRadio';
import { RadioIcon } from './RadioIcon';
import { useRadioGroupContext } from './RadioGroup/RadioContext';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import Box from '~components/Box';
import { SelectorTitle } from '~components/Form/Selector/SelectorTitle';
import { CheckboxInput as RadioInput } from '~components/Checkbox/CheckboxInput';
import { SelectorSupportText } from '~components/Form/Selector/SelectorSupportText';
import { getPlatformType } from '~utils';

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
  const isReactNative = getPlatformType() === 'react-native';

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
    <SelectorLabel inputProps={isReactNative ? inputProps : {}}>
      <RadioInput
        isChecked={state.isChecked}
        isDisabled={isDisabled}
        isNegative={hasError} // TODO: rename to hasError
        inputProps={inputProps}
      />
      <RadioIcon isChecked={state.isChecked} isDisabled={_isDisabled} isNegative={hasError} />
      <Box>
        <SelectorTitle>{children}</SelectorTitle>
        {showHelpText && <SelectorSupportText id={ids?.helpTextId}>{helpText}</SelectorSupportText>}
      </Box>
    </SelectorLabel>
  );
};

export { Radio, RadioProps };
