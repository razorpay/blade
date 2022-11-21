import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { DocsContext } from '@storybook/addon-docs';
import dedent from 'dedent';
// @ts-expect-error We don't resolve JSON files right now. didn't want to change TS config for single JSON
import packageJson from '../../../../package.json'; // eslint-disable-line
import Box from '~components/Box';

type SandboxProps = {
  children: string;
  language?: 'ts' | 'tsx';
  showConsole?: boolean;
  editorHeight?: number;
  editorWidthPercentage?: number;
};

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

function Sandbox({
  children,
  language = 'tsx',
  showConsole = false,
  editorHeight = 300,
  editorWidthPercentage = 50,
}: SandboxProps): JSX.Element {
  const {
    // @ts-expect-error globals is available but the typings in storybook are properly defined hence, ignoring it
    globals: { themeTokenName, colorScheme },
  } = React.useContext(DocsContext);

  return (
    <Box>
      <br />
      <Sandpack
        template="react-ts"
        files={{
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
          [`/App.${language}`]: dedent(children),
        }}
        customSetup={{
          dependencies: {
            react: packageJson.peerDependencies.react,
            'react-dom': packageJson.peerDependencies['react-dom'],
            'react-scripts': '4.0.3',
            '@razorpay/blade': bladeVersion,
            '@fontsource/lato': '4.5.10',
            'styled-components': packageJson.peerDependencies['styled-components'],
          },
        }}
        options={{
          showInlineErrors: true,
          showConsoleButton: true,
          showConsole,
          editorHeight,
          editorWidthPercentage,
        }}
      />
      <br />
      <br />
    </Box>
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
      src={`https://codesandbox.io/embed/${props.codesandboxId}?fontsize=14&module=${activeFile}&theme=light&eslint=1&editorsize=${editorWidth}`}
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

export { Sandbox, SandboxProps, RecipeSandbox, RecipeSandboxProps };
