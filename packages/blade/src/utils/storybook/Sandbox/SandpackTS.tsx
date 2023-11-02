// @ts-nocheck

import type { SandpackSetup, SandpackPredefinedTemplate } from '@codesandbox/sandpack-react';
import {
  SandpackConsumer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import { CodeEditor } from './CodeEditor';

export const SandpackTypescript: React.FC<{
  customSetup: SandpackSetup;
  files: Record<string, string>;
  template: SandpackPredefinedTemplate;
}> = ({ customSetup, files, template }) => {
  return (
    <SandpackProvider template={template} files={files} customSetup={customSetup}>
      <SandpackThemeProvider>
        <SandpackLayout>
          <SandpackConsumer>
            {(state) => <CodeEditor activePath={state?.activePath} />}
          </SandpackConsumer>
          <SandpackPreview />
        </SandpackLayout>
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
