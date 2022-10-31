import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { DocsContext } from '@storybook/addon-docs';
import dedent from 'dedent';

function Sandbox({ children }: { children: string }): JSX.Element {
  const {
    // @ts-expect-error globals is available but the typings in storybook are properly defined hence, ignoring it
    globals: { themeTokenName, colorScheme },
  } = React.useContext(DocsContext);

  return (
    <Sandpack
      template="react-ts"
      files={{
        '/index.tsx': dedent`import { StrictMode } from "react";
          import * as ReactDOMClient from "react-dom/client";
          import styled from "styled-components";

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
          )
          
          const rootElement = document.getElementById("root");
          
          if (!rootElement) {
            throw new Error("root is null");
          }
          
          const root = ReactDOMClient.createRoot(rootElement);
          
          root.render(
            <StrictMode>
              <BladeProvider themeTokens={${themeTokenName}} colorScheme="${colorScheme}">
                <BackgroundBox>
                  <App />
                </BackgroundBox>
              </BladeProvider>
            </StrictMode>
          );
          `,
        '/App.tsx': dedent(children),
      }}
      customSetup={{
        dependencies: {
          react: '18.0.0',
          'react-dom': '18.0.0',
          'react-scripts': '4.0.3',
          '@razorpay/blade': '3.4.1',
          '@babel/runtime-corejs3': '7.19.6',
          '@fontsource/lato': '4.5.10',
          'styled-components': '5.3.6',
        },
      }}
      options={{
        showInlineErrors: true,
        showConsoleButton: true,
      }}
    />
  );
}

export default Sandbox;
