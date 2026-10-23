import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Carousel',
  description:
    'A plain CSS scroll-snap row with dots and previous/next buttons, laid out as in Blade: swipe, wheel and keys scroll it like anything else, and activeSlide follows where it rests. autoPlay (a slide every 6s) holds under hover and focus and never runs under reduced motion.',
  argTypes: {
    autoPlay: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
    showNavigationButtons: { control: 'boolean' },
    navigationButtonPosition: { control: 'select', options: ['bottom', 'side', 'side-overlap'] },
    navigationButtonVariant: { control: 'select', options: ['filled', 'stroked'] },
  },
  stories: {
    Basic: {
      args: {
        autoPlay: true,
        showIndicators: true,
        showNavigationButtons: true,
        navigationButtonPosition: 'bottom',
        navigationButtonVariant: 'filled',
      },
    },
  },
};

export default meta;
