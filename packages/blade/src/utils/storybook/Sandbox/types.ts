import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Platform } from '~utils/platform';

type SandboxStackBlitzProps = {
  children?: string;
  editorHeight?: number | string;
  padding?: BaseBoxProps['padding'];
  showConsole?: boolean;
  /**
   * Ignore children and use this if you want to pass a file structure instead of single file code
   */
  files?: Record<string, string>;
  /**
   * Comma separated names of files to keep open in sandbox.
   *
   * E.g. App.tsx,index.tsx,Example.tsx
   */
  openFile?: string;
  /**
   * hides the URL bar in preview
   *
   * @default true
   */
  hideNavigation?: boolean;
  /**
   * Renders link in react native stories to open storybook on web
   *
   * (Its workaround since sandpack doesn't work on native)
   */
  uri?: Platform.Select<{
    web: never;
    native: string;
  }>;
};

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

export type { SandboxProps, SandboxStackBlitzProps, RecipeSandboxProps };
