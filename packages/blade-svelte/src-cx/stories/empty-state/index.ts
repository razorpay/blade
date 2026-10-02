import { EMPTY_STATE_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'EmptyState',
  description:
    "Blade's EmptyState: the centred stack a screen shows instead of content — an asset, a title, a description and actions. Style-only: no behaviour model behind it.",
  argTypes: {
    size: { control: 'select', options: EMPTY_STATE_AXES.size },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        size: 'medium',
        title: 'No payment links found',
        description: 'Create your first payment link to start accepting payments.',
      },
    },
    Sizes: {
      description: 'small, medium, large and xlarge: the asset cap, the gaps and the type grow together.',
      argTypes: {},
    },
  },
};

export default meta;
