import React from 'react';
import styled from 'styled-components';
import type { CodeViewerProps } from '@codesandbox/sandpack-react';
import {
  Sandpack,
  SandpackCodeViewer,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react';
import { DocsContext } from '@storybook/addon-docs';
import dedent from 'dedent';
import type { RecipeSandboxProps, SandboxProps } from './types';
// @ts-expect-error We don't resolve JSON files right now. didn't want to change TS config for single JSON
import packageJson from '../../../../package.json'; // eslint-disable-line
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

const getBladeVersion = (): string => {
  // We don't publish codesandbox ci on master so version is not present
  const isMaster = process.env.GITHUB_REF === 'refs/heads/master';
  const sha = process.env.GITHUB_SHA;
  if (sha && !isMaster) {
    const shortSha = sha.slice(0, 8);
    return `https://pkg.csb.dev/razorpay/blade/commit/${shortSha}/@razorpay/blade`;
  }

  return '*';
};

const bladeVersion = getBladeVersion();

const useSandpackSetup = ({
  code,
  language = 'tsx',
}: {
  code: string;
  language: SandboxProps['language'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any => {
  const docsContext = React.useContext(DocsContext);

  // @ts-expect-error docsContext.store exists
  const themeTokenName = docsContext?.store?.globals?.globals?.themeTokenName ?? 'paymentTheme';
  // @ts-expect-error docsContext.store exists
  const colorScheme = docsContext?.store?.globals?.globals?.colorScheme ?? 'light';

  return {
    template: 'react-ts',
    files: {
      '/index.tsx': dedent`import { StrictMode } from "react";
            import { createRoot } from "react-dom/client";
            import { createGlobalStyle } from "styled-components";
  
            import { BladeProvider, Box, Theme } from "@razorpay/blade/components";
            import { ${themeTokenName} } from "@razorpay/blade/tokens";
            import "@fontsource/lato/400.css";
            import "@fontsource/lato/700.css";
            
            import App from "./App";
  
            const GlobalStyles = createGlobalStyle\`
              * { 
                box-sizing: border-box;
              }
              body {
                margin: 0;
                padding: 0;
              }
            \`;
            
            const rootElement = document.getElementById("root");
            
            if (!rootElement) {
              throw new Error("root is null");
            }
            const root = createRoot(rootElement);

            root.render(
              <StrictMode>
                <BladeProvider themeTokens={${themeTokenName}} colorScheme="${colorScheme}">
                  <GlobalStyles />
                  <Box 
                    backgroundColor="surface.background.level1.lowContrast"
                    minHeight="100vh"
                    padding={['spacing.4', 'spacing.7']}
                  >
                    <App />
                  </Box>
                </BladeProvider>
              </StrictMode>
            );

            console.clear(); // There could be some codesandbox warnings, clearing them here on init
            `,
      [`/App.${language}`]: dedent(code),
    },
    customSetup: {
      dependencies: {
        react: packageJson.peerDependencies.react,
        'react-dom': packageJson.peerDependencies['react-dom'],
        'react-scripts': '4.0.3',
        '@razorpay/blade': bladeVersion,
        '@fontsource/lato': '4.5.10',
        'styled-components': packageJson.peerDependencies['styled-components'],
      },
    },
  };
};

const CodeLineHighlighterContainer = styled(BaseBox)((_props) => ({
  '& .highlight': {
    backgroundColor: '#fffbdd',
    borderRadius: '2px',
    padding: '2px',
  },
  '& pre': {
    padding: '0px',
  },
  borderRadius: '4px',
  overflow: 'auto',
}));

const SandboxHighlighter = ({
  children,
  ...sandpackCodeViewerProps
}: { children: string } & CodeViewerProps): JSX.Element => {
  return (
    <CodeLineHighlighterContainer>
      <SandpackProvider
        template="vanilla-ts"
        files={{
          '/src/index.ts': dedent(children),
        }}
      >
        <SandpackCodeViewer showLineNumbers {...sandpackCodeViewerProps} />
      </SandpackProvider>
    </CodeLineHighlighterContainer>
  );
};

const SandboxProvider = ({
  code,
  children,
  language = 'tsx',
  border = '1px solid #EFEFEF',
}: Omit<SandboxProps, 'children'> & {
  code: string;
  children: React.ReactNode;
  border?: string;
}): JSX.Element => {
  const sandboxSetup = useSandpackSetup({ language, code });
  return (
    <CodeLineHighlighterContainer border={castWebType(border)}>
      <SandpackProvider {...sandboxSetup}>{children}</SandpackProvider>
    </CodeLineHighlighterContainer>
  );
};

function Sandbox({
  children,
  language = 'tsx',
  showConsole = false,
  editorHeight = 300,
  editorWidthPercentage = 50,
  padding = ['spacing.5', 'spacing.0', 'spacing.8'],
}: SandboxProps): JSX.Element {
  const sandpackSetup = useSandpackSetup({ language, code: children });

  return (
    <BaseBox padding={padding}>
      <Sandpack
        {...sandpackSetup}
        options={{
          showInlineErrors: true,
          showConsoleButton: true,
          showConsole,
          editorHeight,
          editorWidthPercentage,
        }}
      />
    </BaseBox>
  );
}

/**
 * Direct Embed of the Codesandbox as iframe. To be used in recipes.
 *
 * Use `Sandbox` component instead for embedding example of particular component.
 */
const RecipeSandbox = (props: RecipeSandboxProps): JSX.Element => {
  const activeFile = props.activeFile ? encodeURIComponent(props.activeFile) : '%2Fsrc%2FApp.tsx';
  const editorWidth = props.editorWidthPercentage ? props.editorWidthPercentage : 50;

  return (
    <iframe
      src={`https://codesandbox.io/embed/${props.codesandboxId}?fontsize=14&module=${activeFile}&theme=light&eslint=1&editorsize=${editorWidth}&view=${props.view}`}
      style={{
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
      title={props.title}
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    />
  );
};

const VerticalSandbox = ({
  code,
  minHeight = undefined,
}: {
  code: string;
  minHeight?: string;
}): JSX.Element => {
  const [showCode, setShowCode] = React.useState(false);

  return (
    <SandboxProvider code={code} border={castWebType('none')}>
      <Box
        display="flex"
        flexDirection="column"
        paddingY="spacing.2"
        maxHeight={castWebType('100vh')}
      >
        <BaseBox
          backgroundColor="surface.background.level1.lowContrast"
          border={castWebType('1px solid #EFEFEF')}
          flex="1"
        >
          <SandpackPreview style={{ width: '100%', minHeight }} />
        </BaseBox>
        <Box display="flex" justifyContent="flex-end">
          <Button
            alignSelf="flex-end"
            variant="tertiary"
            size="small"
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide' : 'Show'} Code
          </Button>
        </Box>
        {showCode ? (
          <BaseBox
            overflow={castWebType('auto')}
            border={castWebType('1px solid #EFEFEF')}
            maxHeight="100%"
          >
            <SandpackCodeEditor />
          </BaseBox>
        ) : null}
      </Box>
    </SandboxProvider>
  );
};

export { Sandbox, VerticalSandbox, SandboxProvider, SandboxHighlighter, RecipeSandbox };
