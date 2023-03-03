import React from 'react';
import styled from 'styled-components';
import { Sandpack, SandpackCodeViewer, SandpackProvider } from '@codesandbox/sandpack-react';
import { DocsContext } from '@storybook/addon-docs';
import dedent from 'dedent';
// @ts-expect-error We don't resolve JSON files right now. didn't want to change TS config for single JSON
import packageJson from '../../../../package.json'; // eslint-disable-line
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';

type SandboxProps = {
  children: string;
  language?: 'ts' | 'tsx';
  showConsole?: boolean;
  editorHeight?: number;
  editorWidthPercentage?: number;
  padding?: BaseBoxProps['padding'];
};

const getBladeVersion = (): string => {
  // We don't publish codesandbox ci on master so version is not present
  const isMaster = process.env.GITHUB_REF === 'refs/heads/master';
  const sha = process.env.GITHUB_SHA;
  if (sha && !isMaster) {
    const shortSha = sha.slice(0, 8);
    return `https://pkg.csb.dev/razorpay/blade/commit/${shortSha}/@razorpay/blade`;
  }

  return 'https://pkg.csb.dev/razorpay/blade/commit/b1b0f883/@razorpay/blade';
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
  const {
    // @ts-expect-error globals is available but the typings in storybook are properly defined hence, ignoring it
    globals: { themeTokenName, colorScheme },
  } = React.useContext(DocsContext);

  return {
    template: 'react-ts',
    files: {
      '/index.tsx': dedent`import { StrictMode } from "react";
            import ReactDOM from "react-dom";
            import styled, { createGlobalStyle } from "styled-components";
  
            import { BladeProvider, Theme } from "@razorpay/blade/components";
            import { ${themeTokenName} } from "@razorpay/blade/tokens";
            import "@fontsource/lato/400.css";
            import "@fontsource/lato/700.css";
            
            import App from "./App";
  
            const BackgroundBox = styled.div(
              ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.colors.surface.background.level1.lowContrast,
                minHeight: '100vh',
                padding: '12px 24px'
              })
            );

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
                        
            ReactDOM.render(
              <StrictMode>
                <BladeProvider themeTokens={${themeTokenName}} colorScheme="${colorScheme}">
                  <GlobalStyles />
                  <BackgroundBox>
                    <App />
                  </BackgroundBox>
                </BladeProvider>
              </StrictMode>,
              rootElement
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
    backgroundColor: '#ff03',
    borderRadius: '2px',
    padding: '2px',
  },
  '& pre': {
    padding: '0px',
  },
}));

const SandboxViewer = ({ children }: { children: string }): JSX.Element => {
  return (
    <CodeLineHighlighterContainer>
      <SandpackProvider>
        <SandpackCodeViewer code={dedent(children)} showLineNumbers />
      </SandpackProvider>
    </CodeLineHighlighterContainer>
  );
};

const SandboxProvider = ({
  code,
  children,
  language = 'tsx',
}: Omit<SandboxProps, 'children'> & { code: string; children: React.ReactNode }): JSX.Element => {
  const sandboxSetup = useSandpackSetup({ language, code });
  return (
    <CodeLineHighlighterContainer>
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

export { Sandbox, SandboxProvider, SandboxViewer, SandboxProps, RecipeSandbox, RecipeSandboxProps };
