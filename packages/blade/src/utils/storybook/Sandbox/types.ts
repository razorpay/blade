import type { BaseBoxProps } from '~components/Box/BaseBox';

type SandboxProps = {
  children: string;
  language?: 'ts' | 'tsx';
  showConsole?: boolean;
  editorHeight?: number | string;
  editorWidthPercentage?: number;
  padding?: BaseBoxProps['padding'];
  /**
   * Renders link in react native stories to open storybook on web
   *
   * (Its workaround since sandpack doesn't work on native)
   */
  uri?: string;
};

type RecipeSandboxProps = {
  title: string;
  /**
   * ID of the sandbox.
   *
   *
   * E.g. For this URL https://codesandbox.io/s/blade-form-7holu5?file=/src/App.tsx,
   *
   * The id will be - `blade-form-7holu5`
   *
   */
  codesandboxId: string;
  /** E.g. `/src/Form.tsx`  */
  activeFile?: `/${string}`;
  editorWidthPercentage?: number;
  view?: 'preview' | 'editor';
};

export { SandboxProps, RecipeSandboxProps };
