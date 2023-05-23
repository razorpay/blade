import type { TestID } from '~src/_helpers/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type SelectorLabelProps = {
  children: React.ReactNode;
  /**
   * Pass only on react-native
   */
  inputProps: any; // Partial<Extract<InputProps, { onPress: any }>>;
  componentName?: string;
  /**
   * Changes the label to use `display: inline-block`
   */
  isInline?: boolean;
} & TestID;

type SelectorInputProps = HoverProps & {
  id?: string;
  inputProps: any;
  tabIndex?: number;
  accessibilityLabel?: string;
};

type SelectorInputHoverTokens = {
  default: {
    background: {
      checked: string;
      unchecked: string;
    };
    border?: {
      checked: string;
      unchecked: string;
    };
  };
};

type HoverProps = {
  isChecked?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  hoverTokens: SelectorInputHoverTokens;
};

export { SelectorLabelProps, SelectorInputProps, HoverProps, SelectorInputHoverTokens };
