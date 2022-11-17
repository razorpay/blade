import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { DocsContext } from '@storybook/addon-docs';
import dedent from 'dedent';
// @ts-expect-error We don't resolve JSON files right now. didn't want to change TS config for single JSON
import packageJson from '../../../../package.json'; // eslint-disable-line
import Box from '~components/Box';

export type SandboxProps = {
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

export default Sandbox;
