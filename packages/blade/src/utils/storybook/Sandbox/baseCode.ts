/* eslint-disable @typescript-eslint/no-explicit-any */
import dedent from 'dedent';
// @ts-expect-error We don't resolve JSON files right now. didn't want to change TS config for single JSON
import packageJson from '../../../../package.json'; // eslint-disable-line

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

export const tsConfigJSON = JSON.stringify(
  {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,

      /* Bundler mode */
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',

      /* Linting */
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
    },
    include: ['src'],
  },
  null,
  4,
);

type Dependencies = {
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export const getReactScriptsJSDependencies = (): Dependencies => {
  return {
    dependencies: {
      react: '^18',
      'react-dom': '^18',
      'react-scripts': '4.0.3',
      '@razorpay/blade': getBladeVersion(),
      'styled-components': packageJson.peerDependencies['styled-components'],
      '@emotion/react': '11.11.1',
      '@table-library/react-table-library': '4.1.7',
    },
  };
};

const getViteReactTSDependencies = (): Dependencies => {
  return {
    dependencies: {
      react: '^18',
      'react-dom': '^18',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      '@razorpay/blade': getBladeVersion(),
      'styled-components': packageJson.peerDependencies['styled-components'],
      '@emotion/react': '11.11.1',
      '@table-library/react-table-library': '4.1.7',
    },
    devDependencies: {
      vite: '4.5.0',
      '@vitejs/plugin-react': '4.1.1',
    },
  };
};

export const vitePackageJSON = JSON.stringify(
  {
    scripts: {
      dev: 'vite',
      build: 'vite build',
    },
    stackblitz: {
      startCommand: 'yarn install && yarn dev',
      installDependencies: false,
    },
    ...getViteReactTSDependencies(),
  },
  null,
  4,
);

export const viteConfigTS = dedent`
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`;

export const indexHTML = dedent`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="https://raw.githubusercontent.com/razorpay/blade/1e77f0b35172654037a431a916b3190b545fd232/branding/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blade Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
`;

export const logger = dedent`
import { Box, Button, IconButton, SlashIcon } from '@razorpay/blade/components';
import React from 'react';

const overrideConsoleLog = () => {
  const actualConsoleLog = console.log;
  const customConsole = {
    log: function (message: any) {
      const logMessage = document.createElement('p');
      logMessage.style.fontSize = '14px';
      logMessage.textContent = '> ' + JSON.stringify(message, null, 4);

      const newConsole = document.querySelector('#log-console');
      if (!newConsole) {
        return;
      }

      newConsole.appendChild(logMessage);
      newConsole.scrollTop = newConsole.scrollHeight;
    },
  };

  // Override the global console.log with the custom implementation
  window.console.log = (...args) => {
    customConsole.log(...args);
    actualConsoleLog(...args);
  };
};

overrideConsoleLog();

export const Logger = () => {
  const [showLogger, setShowLogger] = React.useState(true);
  const consoleRef = React.useRef();

  return (
    <>
      <Box
        position="fixed"
        bottom="spacing.0"
        left="spacing.0"
        width="100%"
        textAlign="right"
      >
        <Button
          variant="tertiary"
          size="small"
          onClick={() => {
            setShowLogger(!showLogger);
          }}
        >
          Toggle Console
        </Button>
        <Box
          position="absolute"
          bottom="spacing.0"
          right="spacing.0"
          padding="spacing.3"
          margin="spacing.4"
          elevation="midRaised"
          borderRadius="round"
          backgroundColor="surface.background.level3.lowContrast"
          borderColor="surface.border.normal.lowContrast"
          display={showLogger ? 'inline-block' : 'none'}
        >
          <IconButton
            onClick={() => {
              if (consoleRef.current) {
                consoleRef.current.innerHTML = '';
              }
            }}
            icon={SlashIcon}
            size="medium"
            accessibilityLabel="Clear Console"
          />
        </Box>
        <Box
          padding={['spacing.4', 'spacing.7']}
          overflow="auto"
          height="30vh"
          elevation="highRaised"
          backgroundColor="surface.background.level2.lowContrast"
          id="log-console"
          ref={consoleRef}
          display={showLogger ? 'block' : 'none'}
          textAlign="left"
          borderTopWidth="thin"
          borderTopColor="surface.border.normal.lowContrast"
        />
      </Box>
    </>
  );
};
`;

export const getIndexTSX = ({
  themeTokenName,
  brandColor,
  colorScheme,
  showConsole,
}: {
  // we read these values from storybook context where they are typed as any
  themeTokenName: any;
  brandColor: any;
  colorScheme: any;
  showConsole?: boolean;
}): string => dedent`
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";

import { BladeProvider, Box } from "@razorpay/blade/components";
import { ${themeTokenName}, createTheme } from "@razorpay/blade/tokens";

import App from "./App";
${showConsole ? 'import { Logger } from "./Logger";' : ''}
import '@razorpay/blade/fonts.css';


const GlobalStyles = createGlobalStyle\`
  * { 
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Lato', sans-serif;
  }
\`;

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root is null");
}
const root = createRoot(rootElement);

const getTheme = () => {
  if(${Boolean(brandColor)}){
    return createTheme({
      brandColor: "${brandColor}",
    });
  }
  return ${themeTokenName};
}

root.render(
  <StrictMode>
    <BladeProvider themeTokens={getTheme()} colorScheme="${colorScheme}">
      <GlobalStyles />
      <Box 
        backgroundColor="surface.background.level1.lowContrast"
        minHeight="100vh"
        padding={['spacing.4', 'spacing.7']}
        display="flex"
        flexDirection="column"
      >
        <App />
        ${showConsole ? '<Logger />' : ''}
      </Box>
    </BladeProvider>
  </StrictMode>
);

console.clear(); // There could be some codesandbox warnings, clearing them here on init
`;
