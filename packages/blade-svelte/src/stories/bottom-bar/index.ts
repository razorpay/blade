import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'BottomBar',
  description:
    "A bar for the bottom edge, from Blade DSL's Bottom Bar (Figma): the surface, top border, upward shadow and padding, with the device's safe area below. It doesn't position itself: the consumer fixes it through `class`.",
  stories: {
    Basic: {
      description:
        'Bottom navigation in the bar, placed by the consumer: here `absolute inset-x-0 bottom-0` inside a phone-sized frame (an app would use `fixed`).',
      argTypes: {},
    },
  },
};

export default meta;
