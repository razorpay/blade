import { EMPTY_STATE_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'EmptyState',
  description:
    'The centred stack a screen shows instead of content: media on a tinted disc, a title, a message and actions. Style-only: no behaviour model behind it.',
  argTypes: {
    color: { control: 'select', options: EMPTY_STATE_AXES.color },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        color: 'negative',
        title: 'Payment failed',
        message: 'Any amount deducted will be refunded in 5–7 days.',
      },
    },
  },
};

export default meta;
