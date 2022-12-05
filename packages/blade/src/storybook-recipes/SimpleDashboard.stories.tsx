import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~src/_helpers/storybook/Sandbox';
import parameters from '~src/_helpers/storybook/recipeParameters';

export function SimpleDashboard(): JSX.Element {
  return (
    <RecipeSandbox
      title="Blade Dashboard"
      codesandboxId="blade-dashboard-uyijy3"
      activeFile="/src/Dashboard.tsx"
      view="preview"
    />
  );
}

export default {
  title: 'Recipes/Simple Dashboard',
  component: SimpleDashboard,
  parameters,
} as Meta;
