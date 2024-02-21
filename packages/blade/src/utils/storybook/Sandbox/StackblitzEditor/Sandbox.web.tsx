import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import sdk from '@stackblitz/sdk';
import dedent from 'dedent';
import { DocsContext } from '@storybook/addon-docs';

import type { Project } from '@stackblitz/sdk';
import styled from 'styled-components';
import {
  getIndexTSX,
  getVitePackageJSON,
  indexHTML,
  logger,
  tsConfigJSON,
  viteConfigTS,
  getBladeVersionFromBranch,
} from '../baseCode';
import type { SandboxStackBlitzProps } from '../types';
import BaseBox from '~components/Box/BaseBox';

const searchParams = new URLSearchParams(window.top?.location.search);
const getVersionParam = (): string | null => {
  const VERSION_BRANCH_PARAM = 'version_branch';
  return searchParams.get(VERSION_BRANCH_PARAM);
};

if (getVersionParam()) {
  // eslint-disable-next-line @typescript-eslint/no--promises
  getBladeVersionFromBranch(getVersionParam());
}

const useStackblitzSetup = ({
  code,
  editorHeight,
  showConsole,
}: {
  code: SandboxStackBlitzProps['children'];
  editorHeight: SandboxStackBlitzProps['editorHeight'];
  showConsole: SandboxStackBlitzProps['showConsole'];
}): void => {
  const docsContext = React.useContext(DocsContext);

  // @ts-expect-error docsContext.store exists
  const colorScheme = docsContext?.store?.globals?.globals?.colorScheme ?? 'light';
  // @ts-expect-error docsContext.store exists
  const brandColor = docsContext?.store?.globals?.globals?.brandColor;

  const getStackblitzProject = React.useCallback(
    (bladeVersionOverride?: string): Project => {
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
          'index.tsx': getIndexTSX({
            themeTokenName: 'bladeTheme',
            colorScheme,
            brandColor,
            showConsole,
          }),
          'App.tsx': dedent(code),
          'Logger.tsx': logger,
          'vite.config.ts': viteConfigTS,
          'tsconfig.json': tsConfigJSON,
          'package.json': getVitePackageJSON(bladeVersionOverride),
          '.npmrc': `auto-install-peers = false`,
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorScheme, brandColor],
  );

  const loadStackblitzProject = (bladeVersionOverride?: string): void => {
    sdk
      .embedProject('sb-embed', getStackblitzProject(bladeVersionOverride), {
        height: editorHeight,
        openFile: 'App.tsx',
        terminalHeight: 0,
        hideDevTools: true,
        hideNavigation: true,
        hideExplorer: true,
        theme: 'light',
        showSidebar: false,
      })
      .catch((err) => {
        console.error(err);
      });
  };
  React.useEffect(() => {
    if (getVersionParam()) {
      getBladeVersionFromBranch(getVersionParam())
        .then((bladeVersionOverride) => {
          console.log({ bladeVersionOverride });
          return loadStackblitzProject(bladeVersionOverride);
        })
        .catch(() => {
          console.log("Couldn't load version from given branch. Falling back to default version");
          loadStackblitzProject();
        });

      return;
    }

    loadStackblitzProject();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme, brandColor]);
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
  padding = ['spacing.5', 'spacing.0', 'spacing.8'],
}: SandboxStackBlitzProps): JSX.Element => {
  useStackblitzSetup({
    code: children,
    editorHeight,
    showConsole,
  });

  return (
    <StyledEmbed
      padding={padding}
      // Stackblitz is unable to handle string types of height correctly so we set them on styled-components
      editorHeight={typeof editorHeight !== 'number' ? editorHeight : undefined}
    >
      <div id="sb-embed" />
    </StyledEmbed>
  );
};
