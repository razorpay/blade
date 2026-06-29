import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseInputProps } from '~components/Input/BaseInput';
import type { FormInputOnEvent } from '~components/Form';
import type { DataAnalyticsAttribute } from '~utils/types';

type ColorInputValue = {
  hex: string;
  /** Integer percentage 0–100 */
  opacity: number;
};

type ColorInputOnChange = ({ name, value }: { name?: string; value: ColorInputValue }) => void;

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
    onFocus?: FormInputOnEvent;
    onBlur?: FormInputOnEvent;
    /**
     * Whether to show the opacity input
     * @default true
     */
    showOpacity?: boolean;
  };

type ColorInputProps = ColorInputCommonProps;

export type { ColorInputProps, ColorInputValue, ColorInputOnChange };
