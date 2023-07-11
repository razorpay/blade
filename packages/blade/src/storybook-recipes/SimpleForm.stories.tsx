import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~utils/storybook/Sandbox';
import parameters from '~utils/storybook/recipeParameters';

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
  parameters,
} as Meta;
