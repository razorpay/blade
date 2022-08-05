import React from 'react';
import { FormHintText } from './FormHintText';
import Box from '~components/Box';

type FormHintProps = {
  /**
   * If set to `error`, the form group will render the errorText,
   */
  state?: 'error' | 'success' | 'help';
  /**
   * Help text for the group
   */
  helpText?: string;
  /**
   * Error text for the group
   *
   * Renders when `state` is set to 'error'
   */
  errorText?: string;
  /**
   * Success text for the group
   *
   * Renders when `state` is set to 'success'
   */
  successText?: string;
  /**
   * Sets the id on errorText.
   * Needed for accessibility reasons.
   */
  errorTextId?: string;
  /**
   * Sets the id on helpText.
   * Needed for accessibility reasons.
   */
  helpTextId?: string;
  /**
   * Sets the id on successText.
   * Needed for accessibility reasons.
   */
  successTextId?: string;
};

const FormHint = ({
  state,
  errorText,
  errorTextId,
  helpText,
  helpTextId,
  successText,
  successTextId,
}: FormHintProps): React.ReactElement => {
  const showError = state === 'error' && errorText;
  const showSuccess = state === 'success' && successText;
  const showHelp = !showError && helpText;

  return (
    <>
      {showHelp && (
        <>
          <Box marginTop="spacing.1" />
          <FormHintText id={helpTextId} variant="help">
            {helpText}
          </FormHintText>
        </>
      )}
      {showError && (
        <>
          <Box marginTop="spacing.1" />
          <FormHintText id={errorTextId} variant="error">
            {errorText}
          </FormHintText>
        </>
      )}

      {showSuccess && (
        <>
          <Box marginTop="spacing.1" />
          <FormHintText id={successTextId} variant="success">
            {successText}
          </FormHintText>
        </>
      )}
    </>
  );
};

export { FormHint };
