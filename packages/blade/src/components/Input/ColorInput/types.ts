import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseInputProps } from '~components/Input/BaseInput';
import type { FormInputOnEvent } from '~components/Form';
import type { DataAnalyticsAttribute } from '~utils/types';

type ColorInputValue = {
  hex: string;
  opacity: number;
};

type ColorInputCommonProps = Pick<
  BaseInputProps,
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
> & {
  value?: ColorInputValue;
  defaultValue?: ColorInputValue;
  onChange?: (value: ColorInputValue & { name?: string }) => void;
  onFocus?: FormInputOnEvent;
  onBlur?: FormInputOnEvent;
  /**
   * Whether to show the opacity input
   * @default true
   */
  showOpacity?: boolean;
};

type ColorInputPropsWithLabel = ColorInputCommonProps &
  StyledPropsBlade & {
    label: string;
    accessibilityLabel?: string;
  };

type ColorInputPropsWithA11yLabel = ColorInputCommonProps &
  StyledPropsBlade & {
    label?: undefined;
    accessibilityLabel: string;
  };

type ColorInputProps = ColorInputPropsWithLabel | ColorInputPropsWithA11yLabel;

export type { ColorInputProps, ColorInputValue };
