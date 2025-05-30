import type { DataAnalyticsAttribute } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseInputProps } from '~components/Input/BaseInput/BaseInput';
import type { MotionMetaProp } from '~components/BaseMotion';

/**
 * Props for the InputGroup component.
 */
type InputGroupProps = {
  /**
   * Label for the entire input group.
   */
  label?: string;
  /**
   * Position of the label relative to the group.
   *
   * @default 'top'
   */
  labelPosition?: BaseInputProps['labelPosition'];
  /**
   * Controls the size of the input group and its child inputs.
   *
   * @default 'medium'
   */
  size?: BaseInputProps['size'];
  /**
   * Help text displayed at the bottom of the group.
   */
  helpText?: string;
  /**
   * Error message that appears when validationState is 'error'.
   */
  errorText?: string;
  /**
   * Success message that appears when validationState is 'success'.
   */
  successText?: string;
  /**
   * Current validation state of the input group.
   *
   * @default 'none'
   */
  validationState?: BaseInputProps['validationState'];
  /**
   * Disables all inputs within the group.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Should be InputRow components or other valid inputs.
   */
  children: React.ReactNode;
  /**
   * Test ID for automation
   */
  testID?: string;
} & DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;

/**
 * Props for the InputRow component.
 */
type InputRowProps = {
  /**
   * CSS grid template columns value (e.g., "1fr 2fr" or "200px 1fr").
   * Controls how space is distributed between child inputs.
   */
  gridTemplateColumns?: string;
  /**
   * Input components to render in this row.
   */
  children: React.ReactNode;
  /**
   * Test ID for automation
   */
  testID?: string;
  /**
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Position of the row within the group.
   *
   * @default 'only'
   * @private
   */
  _rowPosition?: 'only' | 'first' | 'middle' | 'last';
  /**
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Total number of rows in the group.
   * @private
   * @default 1
   */
  _totalRows?: number;
};

type InputGroupContextType = Pick<InputGroupProps, 'isDisabled' | 'size'>;

export type { InputGroupProps, InputGroupContextType, InputRowProps };
