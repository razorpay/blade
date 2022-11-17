import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~src/_helpers/storybook/Sandbox';

export function BladeForm(): JSX.Element {
  return (
    <RecipeSandbox
      title="Blade Form"
      codesandboxId="blade-form-7holu5"
      activeFile="/src/Form.tsx"
    />
  );
}

export default {
  title: 'Recipes/Blade Form',
  component: BladeForm,
} as Meta;
