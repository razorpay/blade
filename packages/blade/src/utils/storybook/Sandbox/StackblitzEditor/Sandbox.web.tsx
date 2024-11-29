import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import sdk from '@stackblitz/sdk';
import dedent from 'dedent';
import { DocsContext } from '@storybook/addon-docs';

import type { Project } from '@stackblitz/sdk';
import styled from 'styled-components';
import { getIndexTSX, getViteReactTSDependencies, indexHTML, logger } from '../baseCode';
import type { SandboxStackBlitzProps } from '../types';
import BaseBox from '~components/Box/BaseBox';

const useStackblitzSetup = ({
  code,
  files,
  editorHeight,
  showConsole,
  sandboxRef,
  openFile,
  hideNavigation,
}: {
  files: SandboxStackBlitzProps['files'];
  hideNavigation: SandboxStackBlitzProps['hideNavigation'];
  code: SandboxStackBlitzProps['children'];
  openFile: SandboxStackBlitzProps['openFile'];
  editorHeight: SandboxStackBlitzProps['editorHeight'];
  showConsole: SandboxStackBlitzProps['showConsole'];
  sandboxRef: React.RefObject<HTMLDivElement>;
}): Project => {
  const docsContext = React.useContext(DocsContext);

  // @ts-expect-error docsContext.store exists
  const colorScheme = docsContext?.store?.globals?.globals?.colorScheme ?? 'light';
  // @ts-expect-error docsContext.store exists
  const brandColor = docsContext?.store?.globals?.globals?.brandColor;

  const stackblitzProject: Project = React.useMemo(() => {
    return {
      title: 'Blade Example by Razorpay',
      description: "Example of Razorpay's Design System, Blade",
      template: 'javascript',
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
        'index.js': getIndexTSX({
          themeTokenName: 'bladeTheme',
          colorScheme,
          brandColor,
          showConsole,
        }),
        'App.js': code ? `import React from 'react';\n${dedent(code)}` : '',
        'Logger.js': logger,
        '.npmrc': `auto-install-peers = false`,
        ...files,
      },
      dependencies: getViteReactTSDependencies().dependencies,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme, brandColor]);

  React.useEffect(() => {
    if (sandboxRef.current) {
      sdk
        .embedProject(sandboxRef.current, stackblitzProject, {
          height: editorHeight,
          openFile,
          terminalHeight: 0,
          hideDevTools: true,
          hideNavigation,
          hideExplorer: true,
          theme: 'light',
          showSidebar: false,
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme, brandColor]);

  return stackblitzProject;
};

const StyledEmbed = styled(BaseBox)<{ editorHeight: SandboxStackBlitzProps['editorHeight'] }>(
  (props) => `
  & iframe {
    border: 1px solid #efefef !important;
    border-radius: 4px;
    height: ${props.editorHeight}
  }
`,
);

export const Sandbox = ({
  children,
  editorHeight = 500,
  showConsole = false,
  files,
  openFile = 'App.js',
  padding = ['spacing.5', 'spacing.0', 'spacing.8'],
  hideNavigation = true,
}: SandboxStackBlitzProps): JSX.Element => {
  const sandboxRef = React.useRef<HTMLDivElement>(null);

  useStackblitzSetup({
    code: children,
    editorHeight,
    showConsole,
    files,
    openFile,
    sandboxRef,
    hideNavigation,
  });

  return (
    <StyledEmbed
      padding={padding}
      // Stackblitz is unable to handle string types of height correctly so we set them on styled-components
      editorHeight={typeof editorHeight !== 'number' ? editorHeight : undefined}
    >
      <div ref={sandboxRef} />
    </StyledEmbed>
  );
};
