import { ICON_BUTTON_AXES } from '../../index';
import * as glyphs from '../../icons/glyphs';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Icon button',
  description:
    'A button whose whole content is one glyph. Same press behaviour as Button (runes/button/press.svelte.ts); the accessible name is required because the glyph is decorative.',
  argTypes: {
    icon: { control: 'select', options: Object.keys(glyphs) },
    emphasis: { control: 'select', options: ICON_BUTTON_AXES.emphasis },
    isHighlighted: { control: 'boolean' },
    size: { control: 'select', options: ICON_BUTTON_AXES.size },
    accessibilityLabel: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        icon: 'CloseIcon',
        emphasis: 'intense',
        isHighlighted: false,
        size: 'medium',
        accessibilityLabel: 'Close',
        isDisabled: false,
        isLoading: false,
      },
    },
    Matrix: {
      description:
        'Every emphasis and size, bare and highlighted, generated from ICON_BUTTON_AXES. subtle sits on a dark surface.',
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
