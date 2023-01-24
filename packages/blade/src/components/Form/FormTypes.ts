import type { KeyboardEvent } from 'react';

export type FormInputHandleOnEvent = ({
  name,
  value,
}: {
  name?: string;
  value?: React.ChangeEvent<HTMLInputElement> | string;
}) => void;

export type FormInputOnEvent = ({ name, value }: { name?: string; value?: string }) => void;

export type FormInputHandleOnKeyDownEvent = ({
  name,
  key,
  code,
  event,
}: FormInputOnKeyDownEvent) => void;

export type FormInputOnKeyDownEvent = {
  name?: string;
  key?: string;
  code?: string;
  event: KeyboardEvent<HTMLInputElement>;
};

export type FormInputOnClickEvent = {
  name?: string;
  value?: React.MouseEvent<HTMLInputElement> | string;
};

export type FormInputHandleOnClickEvent = ({ name, value }: FormInputOnClickEvent) => void;

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
