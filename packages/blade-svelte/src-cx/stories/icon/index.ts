import { ICON_AXES, icons } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Icon',
  description:
    'An icon is data — SVG markup or a URL — that a host renders and sizes. The glyph set ships with it (packages/blade/components/icons).',
  argTypes: {
    glyph: { control: 'select', options: Object.keys(icons) },
    size: { control: 'select', options: ICON_AXES.size },
    color: { control: 'select', options: ICON_AXES.color },
    accessibilityLabel: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        glyph: 'chevronDown',
        size: 'medium',
        color: 'inherit',
        accessibilityLabel: '',
      },
    },
    Gallery: {
      description: 'Every glyph in the set, by export name.',
      argTypes: {},
    },
    Matrix: {
      description: 'Every size and colour, generated from ICON_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
