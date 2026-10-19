import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Carousel',
  description:
    'A plain CSS scroll-snap row with dots: swipe, wheel and keys scroll it like anything else, and activeSlide follows where it rests. autoPlay (a slide every 6s) holds under hover and focus and never runs under reduced motion.',
  argTypes: {
    autoPlay: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
  },
  stories: {
    Basic: { args: { autoPlay: true, showIndicators: true } },
  },
};

export default meta;
