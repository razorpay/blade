import { ICON_AXES } from '../../index';
import * as glyphs from '../../icons/glyphs';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Icon',
  description:
    'An icon is an SVG import (`InfoIcon` from `@razorpay/blade-svelte/icons`, or the app’s own) that a host sizes and tints. With `bladeIconFontPlugin` it is a glyph of a font holding exactly the icons the app imports; without, its URL drawn as a mask. Single colour only; anything with its own colours is an Image.',
  argTypes: {
    source: { control: 'select', options: Object.keys(glyphs) },
    size: { control: 'select', options: ICON_AXES.size },
    color: { control: 'select', options: ICON_AXES.color },
    accessibilityLabel: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        source: 'ChevronDownIcon',
        size: 'medium',
        color: 'inherit',
        accessibilityLabel: '',
      },
    },
    Gallery: {
      description: 'Every predefined glyph, by export name. Type to filter.',
      argTypes: {},
    },
    Matrix: {
      description: 'Every size and colour, generated from ICON_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
