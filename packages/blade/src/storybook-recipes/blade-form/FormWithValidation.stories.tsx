import { Sandpack } from '@codesandbox/sandpack-react';
import type { ComponentStory } from '@storybook/react';
// @ts-expect-error We don't resolve JSON files right now. didn't want to change TS config for single JSON
import packageJson from './example/package.json'; // eslint-disable-line

function RecipeSandbox({ files }: { files: Record<string, string> }): JSX.Element {
  return (
    <Sandpack
      template="react-ts"
      files={files}
      customSetup={{
        dependencies: {
          react: packageJson.dependencies.react,
          'react-dom': packageJson.dependencies['react-dom'],
          'react-scripts': packageJson.dependencies['react-scripts'],
          '@razorpay/blade': '*',
          '@fontsource/lato': '4.5.10',
          'styled-components': packageJson.dependencies['styled-components'],
        },
      }}
      options={{
        showConsole: true,
        showConsoleButton: true,
      }}
    />
  );
}

export default {
  title: 'Recipes/FormWithValidation',
  component: Sandpack,
};

const allFiles = ((ctx) => {
  const keys = ctx.keys();
  const values = keys.map(ctx);
  return keys.reduce((o, k, i) => {
    // @ts-expect-error: too lazy to figure out types here
    o[k.replace('.', '')] = values[i].default;
    return o;
  }, {});
})(require.context('!!raw-loader!./example/src', true, /.tsx/));

export const FormWithValidation: ComponentStory<typeof Sandpack> = () => (
  <RecipeSandbox files={allFiles} />
);
