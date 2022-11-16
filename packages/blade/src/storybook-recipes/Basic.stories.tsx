import { Sandpack } from '@codesandbox/sandpack-react';
import type { ComponentStory } from '@storybook/react';

// Hack to import files outside of base directory
const baseDirContext = require.context('../../../../examples/basic/', false, /.json/);
const values = baseDirContext('./package.json');

function RecipeSandbox({ files }: { files: Record<string, string> }): JSX.Element {
  return (
    <Sandpack
      template="react-ts"
      files={files}
      customSetup={{
        dependencies: {
          ...values.dependencies,
          '@razorpay/blade': '*',
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
  title: 'Recipes/Basic',
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
})(require.context('!!raw-loader!../../../../examples/basic/src', true, /.tsx/));

export const Default: ComponentStory<typeof Sandpack> = () => <RecipeSandbox files={allFiles} />;
