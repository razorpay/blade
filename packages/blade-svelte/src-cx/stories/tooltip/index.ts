import type { StoryMeta } from '../types';

const PLACEMENTS = ['top', 'bottom', 'left', 'right'].flatMap((side) => [
  side,
  `${side}-start`,
  `${side}-end`,
]);

const meta: StoryMeta = {
  title: 'Tooltip',
  description:
    'Tooltip component over the tooltip model (packages/blade/runes/tooltip): hover with intent, keyboard focus or a tap opens it; the bubble is measured, flipped and clamped inside the LayerHost.',
  argTypes: {
    placement: { control: 'select', options: PLACEMENTS },
    content: { control: 'text' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        placement: 'top',
        content: 'Charged by your bank, not by the merchant',
        isDisabled: false,
      },
    },
    Edges: {
      description:
        'Triggers at the corners of a framed LayerHost: the bubble flips to the side with room and clamps inside the frame, the arrow stays on the trigger.',
      argTypes: {
        placement: { control: 'select', options: PLACEMENTS },
      },
      args: { placement: 'top' },
    },
  },
};

export default meta;
