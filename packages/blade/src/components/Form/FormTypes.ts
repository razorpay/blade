export type FormInputHandleOnEvent = ({
  name,
  value,
}: {
  name?: string;
  value?: React.ChangeEvent<HTMLInputElement> | string;
}) => void;

export type FormInputOnEvent = ({ name, value }: { name?: string; value?: string }) => void;

export type FormInputValidationProps = {
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
   * If `success`, the input is marked as valid,
   *
   */
  validationState?: 'success' | 'error' | 'none';
};
