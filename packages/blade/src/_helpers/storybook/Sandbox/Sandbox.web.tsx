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
};

function Sandbox({ children, language = 'tsx' }: SandboxProps): JSX.Element {
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
                height: '100vh',
                width: '100vw',
                padding: '12px'
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
            `,
          [`/App.${language}`]: dedent(children),
        }}
        customSetup={{
          dependencies: {
            react: packageJson.peerDependencies.react,
            'react-dom': packageJson.peerDependencies['react-dom'],
            'react-scripts': '4.0.3',
            '@razorpay/blade': '*',
            '@fontsource/lato': '4.5.10',
            'styled-components': packageJson.peerDependencies['styled-components'],
          },
        }}
        options={{
          showInlineErrors: true,
          showConsoleButton: true,
        }}
      />
      <br />
      <br />
    </Box>
  );
}

export default Sandbox;
