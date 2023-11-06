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
// import dedent from 'dedent';
import React from 'react';

const getLanguageOfFile = (filePath: string): 'html' | 'javascript' | 'typescript' | 'css' => {
  const extensionDotIndex = filePath.lastIndexOf('.');
  const extension = filePath.slice(extensionDotIndex + 1);

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'typescript';
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

const getReactTypes = async (): Promise<string> => {
  const reactTypes = await fetch('https://unpkg.com/@types/react@18.2.35/index.d.ts').then((res) =>
    res.text(),
  );
  return reactTypes;
};

const MonacoEditor = (): React.ReactElement => {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const monaco = useMonaco();

  const language = getLanguageOfFile(sandpack.activeFile);

  const editorOptions = React.useMemo(() => {
    return {
      minimap: { enabled: false },
      fontFamily: 'Menlo, monospace',
      lineHeight: 28,
      fontSize: 14,
    };
  }, []);

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
          options={editorOptions}
          onMount={async (editor, monacoEd) => {
            console.log('setting new model!!');
            const newModel = monacoEd.editor.createModel(
              code,
              'typescript',
              monacoEd.Uri.parse('file:///App.tsx'),
            );
            editor.setModel(newModel);

            // Define JSX language configuration
            monacoEd.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: false,
              noSyntaxValidation: false,
            });

            // Set up JSX language features
            monacoEd.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: false,
              noSyntaxValidation: false,
            });

            const reactTypes = await getReactTypes();
            console.log({ reactTypes });

            monacoEd.languages.typescript.typescriptDefaults.addExtraLib(
              reactTypes,
              'node_modules/@types/react/index.d.ts',
            );
          }}
          beforeMount={() => {
            if (monaco) {
              console.log('setting ts ');
              // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              //   target: monaco.languages.typescript.ScriptTarget.Latest,
              //   allowNonTsExtensions: true,
              //   moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              //   module: monaco.languages.typescript.ModuleKind.CommonJS,
              //   noEmit: true,
              //   esModuleInterop: true,
              //   jsx: monaco.languages.typescript.JsxEmit.React,
              //   reactNamespace: 'React',
              //   allowJs: true,
              //   typeRoots: ['node_modules/@types'],
              // });

              // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              //   noSemanticValidation: false,
              //   noSyntaxValidation: false,
              // });

              // monaco.languages.typescript.typescriptDefaults.addExtraLib(
              //   '<<react-definition-file>>',
              //   `file:///node_modules/@react/types/index.d.ts`,
              // );

              // Register JSX language support
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.Latest,
                allowNonTsExtensions: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.CommonJS,
                noEmit: true,
                esModuleInterop: true,
                jsx: monaco.languages.typescript.JsxEmit.React,
                reactNamespace: 'React',
                allowJs: true,
                typeRoots: ['node_modules/@types'],
              });

              // Define JSX language configuration
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false,
              });

              // Set up JSX language features
              monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false,
              });
            }
          }}
        />
      </div>
    </SandpackStack>
  );
};

export const SandboxMonaco = (): React.ReactElement => {
  return (
    <SandpackProvider
      template="react-ts"
      files={{
        '/App.tsx': {
          code: `
          
          import React from 'react';

          type Val = 'hi';

          const val: Val = 'yooo';

          export default function App(): React.ReactElement {
            return <h1>Hello World</h1>
          }

          `,
        },
      }}
    >
      <SandpackLayout>
        <MonacoEditor />
        <SandpackPreview style={{ height: '100vh' }} />
      </SandpackLayout>
    </SandpackProvider>
  );
};
