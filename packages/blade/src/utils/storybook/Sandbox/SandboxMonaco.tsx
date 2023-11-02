import {
  SandpackProvider,
  SandpackPreview,
  useActiveCode,
  SandpackLayout,
  SandpackStack,
  FileTabs,
  useSandpack,
} from '@codesandbox/sandpack-react';

import Editor, { useMonaco } from '@monaco-editor/react';
import React from 'react';

const getLanguageOfFile = (filePath: string): 'html' | 'javascript' | 'css' => {
  const extensionDotIndex = filePath.lastIndexOf('.');
  const extension = filePath.slice(extensionDotIndex + 1);

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'javascript';
    case 'vue':
    case 'html':
      return 'html';
    case 'css':
    case 'scss':
    case 'less':
      return 'css';
    default:
      return 'javascript';
  }
};

const MonacoEditor = (): React.ReactElement => {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const monaco = useMonaco();

  const language = getLanguageOfFile(sandpack.activeFile);

  return (
    <SandpackStack style={{ height: '100vh', margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8, background: '#fff' }}>
        <Editor
          width="100%"
          height="100%"
          language={language}
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontFamily: 'Menlo, monospace',
            lineHeight: 28,
            fontSize: 14,
          }}
          beforeMount={() => {
            monaco?.editor.defineTheme('extended-theme', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                {
                  token: 'identifier',
                  foreground: '#ff0000',
                },
                {
                  token: 'identifier.function',
                  foreground: '#ff0000',
                },
                {
                  token: 'type',
                  foreground: '#ff0000',
                },
              ],
              colors: {},
            });
            monaco?.editor.setTheme('extended-theme');
            console.log('setting theme');
          }}
        />
      </div>
    </SandpackStack>
  );
};

export const SandboxMonaco = (): React.ReactElement => {
  return (
    <SandpackProvider template="react-ts">
      <SandpackLayout>
        <MonacoEditor />
        <SandpackPreview style={{ height: '100vh' }} />
      </SandpackLayout>
    </SandpackProvider>
  );
};
