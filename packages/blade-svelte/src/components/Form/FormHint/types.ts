export type FormHintProps = {
  /**
   * Type of hint to display
   */
  type: 'help' | 'error' | 'success';

  /**
   * Help text for the field
   */
  helpText?: string;

  /**
   * Error text (shown when type is 'error')
   */
  errorText?: string;

  /**
   * Success text (shown when type is 'success')
   */
  successText?: string;

  /**
   * ID for help text (for accessibility)
   */
  helpTextId?: string;

  /**
   * ID for error text (for accessibility)
   */
  errorTextId?: string;

  /**
   * ID for success text (for accessibility)
   */
  successTextId?: string;

  /**
   * Size of the hint
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
};

