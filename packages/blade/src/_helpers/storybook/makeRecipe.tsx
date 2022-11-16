import { Sandpack } from '@codesandbox/sandpack-react';
import type { Meta } from '@storybook/react';
import React from 'react';

type ProjectFilesType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packageJson: Record<string, any>;
  files: Record<string, string>;
};

interface WebpackContexts {
  exampleSrcContext: __WebpackModuleApi.RequireContext;
  exampleBaseContext: __WebpackModuleApi.RequireContext;
}

const getProjectFiles = (contexts: WebpackContexts): ProjectFilesType => {
  const { exampleSrcContext, exampleBaseContext } = contexts;
  const keys = exampleSrcContext.keys();
  const values = keys.map(exampleSrcContext);
  const allFiles: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
  for (const index in keys) {
    const filePath = keys[index];
    if (filePath.includes('package.json')) {
      continue;
    }
    // @ts-expect-error: too lazy to fix ts issues here
    // eslint-disable-next-line no-await-in-loop
    allFiles[filePath.replace('.', '')] = values[index].default;
  }

  const packageJson = exampleBaseContext('./package.json');

  return {
    packageJson,
    files: allFiles,
  };
};

interface MakeRecipeProps extends WebpackContexts {
  recipeTitle: string;
}

export const makeRecipe = (props: MakeRecipeProps): { meta: Meta; Example: () => JSX.Element } => {
  const { recipeTitle, ...contexts } = props;
  const { packageJson, files } = getProjectFiles(contexts);

  const Example = (): JSX.Element => {
    return (
      <Sandpack
        template="react-ts"
        files={files}
        customSetup={{
          dependencies: {
            ...packageJson.dependencies,
            '@razorpay/blade': '*',
          },
        }}
        options={{
          showConsole: true,
          showConsoleButton: true,
        }}
      />
    );
  };

  return {
    meta: {
      title: `Recipes/${recipeTitle}`,
      component: Sandpack,
      parameters: {
        previewTabs: {
          'storybook/docs/panel': {
            hidden: true,
          },
        },
      },
    },
    Example,
  };
};
