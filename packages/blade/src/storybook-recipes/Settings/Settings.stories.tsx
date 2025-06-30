import type { Meta } from '@storybook/react';
import storyRouterDecorator from 'storybook-react-router';
// eslint-disable-next-line blade/no-cross-platform-imports
import App from './App.web';
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
