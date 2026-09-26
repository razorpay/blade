import { ICON_BUTTON_AXES, icons } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Icon button',
  description:
    'A button whose whole content is one glyph. Same press behaviour as Button (runes/button/press.svelte.ts); the accessible name is required because the glyph is decorative.',
  argTypes: {
    glyph: { control: 'select', options: Object.keys(icons) },
    variant: { control: 'select', options: ICON_BUTTON_AXES.variant },
    size: { control: 'select', options: ICON_BUTTON_AXES.size },
    accessibilityLabel: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        glyph: 'close',
        variant: 'plain',
        size: 'medium',
        accessibilityLabel: 'Close',
        isDisabled: false,
        isLoading: false,
      },
    },
    Matrix: {
      description: 'Every variant and size, generated from ICON_BUTTON_AXES.',
      argTypes: {},
    },
    Async: {
      description:
        'An `onClick` that returns a promise keeps the button busy until it settles: the glyph becomes a spinner and further presses are swallowed.',
      argTypes: {},
    },
  },
};

export default meta;
