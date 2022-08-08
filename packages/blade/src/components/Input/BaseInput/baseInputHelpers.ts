/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * <TextInput
  label="Enter Name"
  labelPosition="left"
  placeholder="Enter your name"
  icon={UserIcon}
  showClearButton
  helpText="Enter first name and last name. Eg: Kamlesh Chandnani"
  errorText="Name cannot be blank"
  successText="Name validated"
  validationState={inputValue.length < 10 ? 'error' : 'success'}
/>
 */

import React from 'react';
import type { FormLabelTextProps } from '~components/Form/FormLabelText';
import type { FormHintTextProps } from '~components/Form/FormHintText';

export type HandleOnChange = ({
  inputName,
  inputValue,
}: {
  inputName?: string;
  inputValue?: string;
}) => void;

export type OnChange = ({ name, value }: { name?: string; value?: string }) => void;

type InputLabelProps = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Desktop only prop. on Mobile by default the label will be on top
   */
  labelPosition?: FormLabelTextProps['position'];
  /**
   * Displays `(optional)` when `optional` is passed or `*` when `required` is passed
   */
  neccessityIndicator?: FormLabelTextProps['neccessityIndicator'];
};

type InputValidationProps = {
  /**
   * Help text for the input
   */
  helpText?: string;
  /**
   * Error text for the input
   *
   * Renders when `validationState` is set to 'error'
   */
  errorText?: string;
  /**
   * success text for the input
   *
   * Renders when `validationState` is set to 'success'
   */
  successText?: string;
  /**
   * If `error`, the input is marked as invalid,
   * and `invalid` attribute will be added
   *
   * If `success`, the input is marked as invalid,
   *
   */
  validationState?: 'success' | 'error' | 'none';
};

export type BaseInputProps = InputLabelProps &
  InputValidationProps & {
    /**
     * Placeholder text to be displayed inside the input field
     */
    placeholder?: string;
    /**
     * Type of Input Field to be rendered.
     *
     * @default text
     */
    type?: 'text' | 'telephone' | 'email' | 'url' | 'numeric' | 'search';
    /**
     * Used to set the default value of input field when it's uncontrolled
     */
    defaultValue?: string;
    /**
     * The name of the input field.
     *
     * Useful in form submissions
     */
    name?: string;
    /**
     * The callback function to be invoked when the value of the input field changes
     */
    onChange?: OnChange;
    /**
     * Used to turn the input field to controlled so user can control the value
     */
    value?: string;
    /**
     * Used to disable the input field
     */
    isDisabled?: boolean;
    /**
     * If true, the input is marked as required, and `required` attribute will be added
     */
    isRequired?: boolean;
  };

export const useInput = ({
  value,
  defaultValue,
  onChange,
}: Pick<BaseInputProps, 'value' | 'defaultValue' | 'onChange'>) => {
  if (value && defaultValue) {
    throw new Error(
      `[Blade Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
  }

  const handleOnChange: HandleOnChange = React.useCallback(
    ({ inputName, inputValue }) => {
      onChange?.({ name: inputName, value: inputValue });
    },
    [onChange],
  );

  return { handleOnChange };
};

export const getHintType = ({
  _validationState,
  _helpText,
}: {
  _validationState: BaseInputProps['validationState'];
  _helpText: BaseInputProps['helpText'];
}): FormHintTextProps['state'] => {
  if (_validationState === 'error') {
    return 'error';
  }

  if (_validationState === 'success') {
    return 'success';
  }

  if (_helpText) {
    return 'help';
  }

  return 'help';
};
