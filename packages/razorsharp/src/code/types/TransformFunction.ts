import type { BladeProps } from './Blade';

export type Imports = Record<string, string[]>;

export type TransformFunctionReturnType = {
  component: string;
  imports: Imports;
};

export type ServerFunctionReturnType = {
  componentName: string;
  props: BladeProps;
  children?: (ServerFunctionReturnType | string)[];
};
