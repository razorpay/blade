import { TABS_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Tabs',
  description:
    "Blade's Tabs, composed: TabItems in the `tabList` snippet (Blade's TabList), TabPanels as children. One tab always picked, one tab stop, arrows that move and (by default) pick, wrapping past the ends and skipping disabled tabs; the indicator slides to the pick.",
  argTypes: {
    variant: { control: 'select', options: TABS_AXES.variant },
    size: { control: 'select', options: TABS_AXES.size },
    orientation: { control: 'select', options: TABS_AXES.orientation },
    isFullWidthTabItem: { control: 'boolean' },
    activation: { control: 'select', options: ['automatic', 'manual'] },
    isLazy: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'bordered',
        size: 'medium',
        orientation: 'horizontal',
        isFullWidthTabItem: false,
        activation: 'automatic',
        isLazy: false,
      },
    },
  },
};

export default meta;
