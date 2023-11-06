import React from 'react';
import sdk from '@stackblitz/sdk';

import type { Project } from '@stackblitz/sdk';
import styled from 'styled-components';

const INDEX_HTML = `
<div id="root"></div>
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
  template: 'create-react-app',
  files: {
    'public/index.html': INDEX_HTML,
    'src/index.js': INDEX_JS,
  },
  dependencies: {
    react: '*',
    'react-dom': '*',
    '@types/react': '*',
    '@types/react-dom': '*',
    '@razorpay/blade': '*',
    'styled-components': '*',
  },
};

const StyledEmbed = styled.div`
  & iframe {
    border: none !important;
  }
`;

export const SandboxSB = (): JSX.Element => {
  React.useEffect(() => {
    void sdk.embedProject('sb-embed', javascriptProject, {
      height: 400,
      openFile: 'index.js',
      terminalHeight: 50,
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
