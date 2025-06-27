import type { Meta } from '@storybook/react';
import storyRouterDecorator from 'storybook-react-router';
import App from './App';
import parameters from '~utils/storybook/recipeParameters';

export function SimpleForm(): JSX.Element {
  return <App />;
}

export default {
  title: 'Recipes/Settings',
  component: SimpleForm,
  parameters,
  decorators: [storyRouterDecorator(undefined, { initialEntries: ['/settings'] })] as unknown,
} as Meta;
