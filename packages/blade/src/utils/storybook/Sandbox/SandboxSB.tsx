import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import sdk from '@stackblitz/sdk';
import dedent from 'dedent';
import { DocsContext } from '@storybook/addon-docs';

import type { Project } from '@stackblitz/sdk';
import styled from 'styled-components';
import { getIndexTSX, indexHTML, tsConfigJSON, viteConfigTS, vitePackageJSON } from './baseCode';
import type { SandboxStackBlitzProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const useStackblitzSetup = ({
  code,
  editorHeight,
}: {
  code: SandboxStackBlitzProps['children'];
  editorHeight: SandboxStackBlitzProps['editorHeight'];
}): Project => {
  const docsContext = React.useContext(DocsContext);

  const themeTokenName = docsContext?.globals?.themeTokenName ?? 'paymentTheme';
  const colorScheme = docsContext?.globals?.colorScheme ?? 'light';
  const brandColor = docsContext?.globals?.brandColor;

  const stackblitzProject: Project = React.useMemo(() => {
    return {
      title: 'Blade Example by Razorpay',
      description: "Example of Razorpay's Design System, Blade",
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
        'index.html': indexHTML,
        'index.tsx': getIndexTSX({ themeTokenName, colorScheme, brandColor }),
        'App.tsx': dedent(code),
        'vite.config.ts': viteConfigTS,
        'tsconfig.json': tsConfigJSON,
        'package.json': vitePackageJSON,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeTokenName, colorScheme, brandColor]);

  React.useEffect(() => {
    void sdk.embedProject('sb-embed', stackblitzProject, {
      height: editorHeight,
      openFile: 'App.tsx',
      terminalHeight: 10,
      hideDevTools: true,
      hideNavigation: true,
      hideExplorer: true,
      theme: 'light',
      showSidebar: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeTokenName, colorScheme, brandColor]);

  return stackblitzProject;
};

const StyledEmbed = styled(BaseBox)`
  & iframe {
    border: 1px solid #efefef !important;
    border-radius: 4px;
  }
`;

export const Sandbox = ({
  children,
  editorHeight = 350,
  padding = ['spacing.5', 'spacing.0', 'spacing.8'],
}: SandboxStackBlitzProps): JSX.Element => {
  useStackblitzSetup({
    code: children,
    editorHeight,
  });

  return (
    <StyledEmbed padding={padding}>
      <div id="sb-embed" />
    </StyledEmbed>
  );
};
