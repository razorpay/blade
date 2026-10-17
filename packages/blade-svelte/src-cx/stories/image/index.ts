import { IMAGE_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Image',
  description:
    'A picture that can be late or missing: a URL, SVG markup or the promise of either, with a stand-in when it cannot load. Icon is for themed glyphs; this is for logos.',
  argTypes: {
    shape: { control: 'select', options: IMAGE_AXES.shape },
    fit: { control: 'select', options: IMAGE_AXES.fit },
    alt: { control: 'text' },
  },
  stories: {
    Basic: { args: { shape: 'rounded', fit: 'contain', alt: 'HDFC Bank' } },
  },
};

export default meta;
