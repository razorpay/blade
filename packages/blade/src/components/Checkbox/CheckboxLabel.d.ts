/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InputProps } from './useCheckbox';

export * from './CheckboxLabel.web';

export type CheckboxLabelProps = {
  children: React.ReactNode;
  /**
   * Pass only on react-native
   */
  inputProps: Partial<Extract<InputProps, { onPress: any }>>;
};
