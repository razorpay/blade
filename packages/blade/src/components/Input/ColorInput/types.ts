import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseInputProps } from '~components/Input/BaseInput';
import type { DataAnalyticsAttribute } from '~utils/types';

type ColorInputValue = {
  /**
   * 6-character uppercase hex string with '#' prefix.
   * @example '#FF5733'
   */
  hex: string;
  /** Integer percentage 0–100 */
  opacity: number;
};

type ColorInputOnChange = ({ name, value }: { name?: string; value: ColorInputValue }) => void;

type ColorInputOnFocusBlur = ({ name, value }: { name?: string; value: ColorInputValue }) => void;

type ColorInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'size'
  | 'labelPosition'
  | 'name'
  | 'validationState'
  | 'errorText'
  | 'successText'
  | 'helpText'
  | 'necessityIndicator'
  | 'isRequired'
  | 'isDisabled'
  | 'autoFocus'
  | 'testID'
  | keyof DataAnalyticsAttribute
> &
  StyledPropsBlade & {
    value?: ColorInputValue;
    defaultValue?: ColorInputValue;
    onChange?: ColorInputOnChange;
    onFocus?: ColorInputOnFocusBlur;
    onBlur?: ColorInputOnFocusBlur;
    /**
     * Whether to show the opacity input
     * @default true
     */
    showOpacity?: boolean;
  };

type ColorInputProps = ColorInputCommonProps;

export type { ColorInputProps, ColorInputValue, ColorInputOnFocusBlur };
