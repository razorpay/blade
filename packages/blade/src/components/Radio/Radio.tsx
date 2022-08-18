/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useRadio } from './useRadio';
import { RadioIcon } from './RadioIcon';
import { useRadioGroupContext } from './RadioGroup/RadioContext';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import Box from '~components/Box';
import { SelectorTitle } from '~components/Form/Selector/SelectorTitle';
import { CheckboxInput as RadioInput } from '~components/Checkbox/CheckboxInput';
import { SelectorSupportText } from '~components/Form/Selector/SelectorSupportText';
import { getPlatformType } from '~utils';

type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

type RadioProps = {
  /**
   * If `true`, The Radio will be checked. This also makes the Radio controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the Radio will be initially checked. This also makes the Radio uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Radio` changes.
   */
  onChange?: OnChange;
  /**
   * Sets the label text of the Radio
   */
  children: string;
  /**
   * Help text for the Radio
   */
  helpText?: string;
  /**
   * The name of the input field in a Radio
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the Radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the Radio input is marked as required,
   * and `required` attribute will be added
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `error`, the Radio input is marked as invalid,
   * and `invalid` attribute will be added
   */
  validationState?: 'error' | 'none';
};

const Radio = ({
  defaultChecked,
  isChecked,
  isDisabled,
  isRequired,
  name,
  value,
  onChange,
  children,
  helpText,
  validationState,
}: RadioProps): React.ReactElement => {
  const groupProps = useRadioGroupContext();

  const _validationState = validationState ?? groupProps?.validationState;
  const _hasError = _validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _name = groupProps?.name ?? name;
  const _isChecked = groupProps?.state?.isChecked(value!) ?? isChecked;
  const showHelpText = !_hasError && helpText;
  const isReactNative = getPlatformType() === 'react-native';

  const handleChange: OnChange = ({ isChecked, event, value }) => {
    if (isChecked) {
      groupProps?.state?.setValue(value!);
    } else {
      groupProps?.state?.removeValue();
    }

    onChange?.({ isChecked, event, value });
  };

  const { state, ids, inputProps } = useRadio({
    defaultChecked,
    isChecked: _isChecked,
    hasError: _hasError,
    isDisabled: _isDisabled,
    isRequired,
    name: _name,
    value,
    onChange: handleChange,
  });

  return (
    <SelectorLabel inputProps={isReactNative ? inputProps : {}}>
      <RadioInput
        isChecked={state.isChecked}
        isDisabled={isDisabled}
        isNegative={_hasError} // TODO: rename to hasError
        inputProps={inputProps}
      />
      <RadioIcon isChecked={state.isChecked} isDisabled={_isDisabled} isNegative={_hasError} />
      <Box>
        <SelectorTitle>{children}</SelectorTitle>
        {showHelpText && <SelectorSupportText id={ids?.helpTextId}>{helpText}</SelectorSupportText>}
      </Box>
    </SelectorLabel>
  );
};

export { Radio, RadioProps };
