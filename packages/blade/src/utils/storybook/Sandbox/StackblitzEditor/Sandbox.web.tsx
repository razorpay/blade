import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import sdk from '@stackblitz/sdk';
import dedent from 'dedent';
import { DocsContext } from '@storybook/addon-docs';

import type { Project, VM } from '@stackblitz/sdk';
import styled from 'styled-components';
import {
  getIndexTSX,
  indexHTML,
  logger,
  viteConfigTS,
  vitePackageJSON,
  featuresJS,
  tsConfigJSON,
} from '../baseCode';
import type { SandboxStackBlitzProps } from '../types';
import useEarlyFetch from './useEarlyFetch';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { BoxIcon } from '~components/Icons';

const StyledForkButton = styled.button`
  background-color: hsl(0 0% 91%);
  height: 100%;
  width: 100%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 0px 0px 0px 4px;

  & > span {
    font-size: 12px;
  }

  &:hover {
    background-color: hsl(0 0% 86%);
  }
`;

const ForkButton = ({ onClick }: { onClick: () => void }): React.ReactElement => {
  return (
    <StyledForkButton onClick={onClick}>
      <BoxIcon size="small" />
      <span>
        Fork on <b>StackBlitz</b>
      </span>
    </StyledForkButton>
  );
};

const lockFilePath = `${window.location.origin}/docs-yarn-lock.yaml`;
let lockFileContentGlobal = '';

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
}): {
  embedProject: (lockFileContent?: string) => Promise<VM | null>;
  openProject: (lockFileContent: string) => void;
} => {
  const docsContext = React.useContext(DocsContext);

  // @ts-expect-error docsContext.store exists
  const colorScheme = docsContext?.store?.globals?.globals?.colorScheme ?? 'light';
  // @ts-expect-error docsContext.store exists
  const brandColor = docsContext?.store?.globals?.globals?.brandColor;

  const fileExtension = 'tsx';
  const filesObj = files ?? {};

  const getStackblitzProject = React.useCallback(
    (lockFileContent?: string): Project => {
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
          [`index.${fileExtension}`]: getIndexTSX({
            themeTokenName: 'bladeTheme',
            colorScheme,
            brandColor,
            showConsole,
          }),
          [`App.${fileExtension}`]: code ? dedent(code) : '',
          [`Logger.${fileExtension}`]: logger,
          'features.js': featuresJS,
          'package.json': vitePackageJSON,
          'vite.config.ts': viteConfigTS,
          'tsconfig.json': tsConfigJSON,
          ...(lockFileContent ? { 'yarn.lock': lockFileContent } : {}),
          '.npmrc': `auto-install-peers = false`,
          ...filesObj,
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorScheme, brandColor],
  );

  const config = {
    height: editorHeight,
    openFile,
    terminalHeight: 0,
    hideDevTools: true,
    hideNavigation,
    hideExplorer: true,
    theme: 'light',
    showSidebar: false,
  } as const;

  const embedProject = async (lockFileContent?: string): Promise<VM | null> => {
    if (!sandboxRef.current) {
      return null;
    }

    try {
      const sb = await sdk.embedProject(
        sandboxRef.current,
        getStackblitzProject(lockFileContent),
        config,
      );

      return sb;
    } catch (err: unknown) {
      console.log('[stackblitz sandbox]: Error while embedding project', err);
      return null;
    }
  };

  const openProject = (lockFileContent: string): void => {
    if (sandboxRef.current) {
      sdk.openProject(getStackblitzProject(lockFileContent), {
        openFile: config.openFile,
      });
    }
  };

  return { embedProject, openProject };
};

const StyledEmbed = styled(BaseBox)<{ editorHeight: SandboxStackBlitzProps['editorHeight'] }>(
  (props) => `
  position: relative;
  & > .sb-iframe  {
    border: 1px solid #efefef !important;
    border-radius: 4px;
    height: ${props.editorHeight}
  }
`,
);

const lockFileFetchFn = async (): Promise<string> => {
  if (lockFileContentGlobal) {
    return lockFileContentGlobal;
  }

  const res = await fetch(lockFilePath);
  if (res.status !== 200) {
    return '';
  }

  lockFileContentGlobal = await res.text();

  return lockFileContentGlobal;
};

export const Sandbox = ({
  children,
  editorHeight = 500,
  showConsole = false,
  files,
  openFile = 'App.tsx',
  padding = ['spacing.5', 'spacing.0', 'spacing.8'],
  hideNavigation = true,
}: SandboxStackBlitzProps): JSX.Element => {
  const sandboxRef = React.useRef<HTMLDivElement>(null);

  const { openProject, embedProject } = useStackblitzSetup({
    code: children,
    editorHeight,
    showConsole,
    files,
    openFile,
    sandboxRef,
    hideNavigation,
  });

  useEarlyFetch(lockFileFetchFn, '', {
    onSuccess: async (result) => {
      await embedProject(result);
    },
    onError: async () => {
      console.warn(
        '[stackblitz sandbox]: Failed to load optimized sandbox. Falling back to slower editor version.',
      );
      await embedProject('');
    },
  });

  return (
    <StyledEmbed
      padding={padding}
      // Stackblitz is unable to handle string types of height correctly so we set them on styled-components
      editorHeight={typeof editorHeight === 'number' ? `${editorHeight}px` : editorHeight}
    >
      <div className="sb-iframe" ref={sandboxRef} />
      <Box
        position="absolute"
        bottom={editorHeight === '100vh' ? '4px' : '36px'}
        left="spacing.0"
        display="inline-block"
        height="32px"
      >
        <ForkButton onClick={() => openProject(lockFileContentGlobal)} />
      </Box>
    </StyledEmbed>
  );
};
