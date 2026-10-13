import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Carousel',
  description:
    'A native scroll-snap row with dots: swipe, wheel and keys scroll it like anything else, and the index follows where it rests. autoAdvance holds under hover and focus and never runs under reduced motion.',
  argTypes: {
    autoAdvance: { control: 'number', description: 'ms; 0 is off' },
  },
  stories: {
    Basic: { args: { autoAdvance: 3000 } },
  },
};

export default meta;
