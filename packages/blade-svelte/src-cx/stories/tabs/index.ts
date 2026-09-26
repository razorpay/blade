import { TABS_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Tabs',
  description:
    'Tab ↔ panel over the createTabs rune: one tab always picked, one tab stop, arrows that move and (by default) pick, wrapping past the ends and skipping disabled tabs.',
  argTypes: {
    layout: { control: 'select', options: TABS_AXES.layout },
    size: { control: 'select', options: TABS_AXES.size },
    activation: { control: 'select', options: ['automatic', 'manual'] },
  },
  stories: {
    Basic: {
      args: { layout: 'fill', size: 'medium', activation: 'automatic' },
    },
  },
};

export default meta;
