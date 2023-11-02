// @ts-nocheck
import type {
  SandpackSetup,
  SandpackPredefinedTemplate,
  SandpackFiles,
} from '@codesandbox/sandpack-react';
import {
  SandpackConsumer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import { CodeEditor } from './CodeEditor';

export const SandpackTypescript: React.FC<{
  customSetup?: SandpackSetup;
  template: SandpackPredefinedTemplate;
  files: SandpackFiles;
}> = ({ customSetup, template, files }) => {
  return (
    <SandpackProvider template={template} files={files} customSetup={customSetup}>
      <SandpackThemeProvider>
        <SandpackLayout>
          <SandpackConsumer>
            {(state) => <CodeEditor activeFile={state?.activeFile} />}
          </SandpackConsumer>
          <SandpackPreview />
        </SandpackLayout>
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
