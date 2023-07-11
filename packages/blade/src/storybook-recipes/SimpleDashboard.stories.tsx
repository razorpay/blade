import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~utils/storybook/Sandbox';
import parameters from '~utils/storybook/recipeParameters';

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
