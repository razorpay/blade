import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~src/_helpers/storybook/Sandbox';
import parameters from '~src/_helpers/storybook/recipeParameters';

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
