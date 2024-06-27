import storyRouterDecorator from 'storybook-react-router';
import { Minimal } from './TopNav.stories';

export const TopNav = Minimal;

export default {
  title: 'Components/KitchenSink/TopNav',
  component: TopNav,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
  decorators: [storyRouterDecorator(undefined, { initialEntries: ['/home'] })] as unknown,
};
