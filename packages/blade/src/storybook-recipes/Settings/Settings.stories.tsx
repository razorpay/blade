import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~utils/storybook/Sandbox/SandpackEditor';
import parameters from '~utils/storybook/recipeParameters';
import App from './App';

export function SimpleForm(): JSX.Element {
  return <App />;
}

export default {
  title: 'Recipes/Settings',
  component: SimpleForm,
  parameters,
} as Meta;
