import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~src/_helpers/storybook/Sandbox';

export function SimpleForm(): JSX.Element {
  return (
    <RecipeSandbox
      title="Blade Form"
      codesandboxId="blade-form-7holu5"
      activeFile="/src/Form.tsx"
    />
  );
}

export default {
  title: 'Recipes/Simple Form',
  component: SimpleForm,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    // Running visual tests of recipes can give false negatives because this is not exactly a story
    // E.g. the code can change, or codesandbox might be in the loading state
    chromatic: { disableSnapshot: true },
  },
} as Meta;
