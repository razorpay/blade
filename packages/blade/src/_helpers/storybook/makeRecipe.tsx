import type { Meta } from '@storybook/react';
import React from 'react';
import { RecipeSandbox } from './Sandbox';

type ProjectFilesType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packageJson: Record<string, any> | null;
  files: Record<string, string> | null;
};

interface WebpackContexts {
  exampleSrcContext: __WebpackModuleApi.RequireContext | null;
  exampleBaseContext: __WebpackModuleApi.RequireContext | null;
}

const getProjectFiles = (contexts: WebpackContexts): ProjectFilesType => {
  const { exampleSrcContext, exampleBaseContext } = contexts;
  if (!exampleSrcContext || !exampleBaseContext) {
    return {
      packageJson: null,
      files: null,
    };
  }
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

export const makeRecipe = (
  props: MakeRecipeProps,
): { meta: Meta; Example: () => JSX.Element | null } => {
  const { recipeTitle, ...contexts } = props;
  const { packageJson, files } = getProjectFiles(contexts);

  const Example = (): JSX.Element | null => {
    return <RecipeSandbox files={files} dependencies={packageJson?.dependencies} />;
  };

  return {
    meta: {
      title: `Recipes/${recipeTitle}`,
      component: Example,
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
