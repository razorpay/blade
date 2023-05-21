import type { TestID } from '~src/_helpers/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type SelectorLabelProps = {
  children: React.ReactNode;
  /**
   * Pass only on react-native
   */
  inputProps: any; // Partial<Extract<InputProps, { onPress: any }>>;
  componentName?: string;
  isInline?: boolean;
} & TestID;

type SelectorInputHoverVariants = {
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
  hoverStyles: SelectorInputHoverVariants;
};

export { SelectorLabelProps, HoverProps, SelectorInputHoverVariants };
