import type { Meta } from '@storybook/react';
import { RecipeSandbox } from '~utils/storybook/Sandbox/SandpackEditor';
import parameters from '~utils/storybook/recipeParameters';

export function TopNavDashboard(): JSX.Element {
  return (
    <RecipeSandbox
      title="TopNav Dashboard"
      codesandboxId="blade-topnav-example-fvcs4p"
      activeFile="/src/TopNavExample.tsx"
      view="preview"
    />
  );
}

export default {
  title: 'Recipes/TopNav Dashboard',
  component: TopNavDashboard,
  parameters,
} as Meta;
