import type { Meta } from '@storybook/react';
import storyRouterDecorator from 'storybook-react-router';
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
  decorators: [storyRouterDecorator(undefined, { initialEntries: ['/settings'] })] as unknown,
} as Meta;
