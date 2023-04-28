export type Imports = Record<string, string[]>;

export type TransformFunctionReturnType = {
  component: string;
  imports: Imports;
};
