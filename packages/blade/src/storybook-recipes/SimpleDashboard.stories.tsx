import { RecipeSandbox } from '~utils/storybook/Sandbox/SandpackEditor';
import parameters from '~utils/storybook/recipeParameters';

import type { Meta } from '@storybook/react-vite';

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
