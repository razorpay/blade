import React from 'react';
import sdk from '@stackblitz/sdk';

import type { Project } from '@stackblitz/sdk';
import styled from 'styled-components';

const INDEX_HTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
`;

const INDEX_JS = `
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { BladeProvider, Button } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';

const App = () => {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <Button>Blade Button!!</Button>
    </BladeProvider>
  )
}

const root = ReactDOMClient.createRoot(document.querySelector('#root'));
root.render(<App />);
`;

const javascriptProject: Project = {
  title: 'Dynamically Generated Project',
  description: 'Simple example using the EngineBlock "javascript" template.',
  template: 'node',
  files: {
    '.vscode/settings.json': JSON.stringify(
      {
        'editor.fontFamily': 'Menlo, monospace, Cascadia Code, Consolas, Liberation Mono',
        'editor.fontSize': 13,
        'editor.lineHeight': 2,
        'editor.lineNumbers': 'off',
        'editor.renderLineHighlight': 'none',
        'editor.renderIndentGuides': false,
      },
      null,
      4,
    ),
    'index.html': INDEX_HTML,
    'index.tsx': INDEX_JS,
    'vite.config.ts': `import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    
    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
    })
    `,
    'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
}
    `,
    'package.json': JSON.stringify(
      {
        scripts: {
          dev: 'vite',
          build: 'vite build',
        },
        dependencies: {
          react: '*',
          'react-dom': '*',
          '@types/react': '*',
          '@types/react-dom': '*',
          '@razorpay/blade': '*',
          'styled-components': '*',
        },
        devDependencies: {
          vite: '*',
          '@vitejs/plugin-react': '*',
        },
      },
      null,
      4,
    ),
  },
};

const StyledEmbed = styled.div`
  & iframe {
    border: 1px solid #efefef !important;
    border-radius: 4px;
  }
`;

export const SandboxSB = (): JSX.Element => {
  React.useEffect(() => {
    void sdk.embedProject('sb-embed', javascriptProject, {
      height: 500,
      openFile: 'index.tsx',
      terminalHeight: 0,
      hideDevTools: true,
      hideNavigation: true,
      hideExplorer: true,
      theme: 'light',
      showSidebar: false,
    });
  }, []);

  return (
    <StyledEmbed>
      <div id="sb-embed" />
    </StyledEmbed>
  );
};
