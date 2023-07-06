import type { Meta } from '@storybook/react';
import { CodeEditor } from './CodeEditor';

export default {
  title: 'Components/CodeEditor',
  component: CodeEditor,
} as Meta<{}>;

export const CodeEditorDefault = (): React.ReactElement => {
  return <CodeEditor />;
};
