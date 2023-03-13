import type { TestID } from '~src/_helpers/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SelectorLabelProps = {
  children: React.ReactNode;
  /**
   * Pass only on react-native
   */
  inputProps: any; // Partial<Extract<InputProps, { onPress: any }>>;
  componentName?: string;
} & TestID;
