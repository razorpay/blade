import { DIVIDER_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Divider',
  description:
    "A separator line (an hr). Style-only: no behaviour model behind it; spacing around it is the caller's class.",
  argTypes: {
    orientation: { control: 'select', options: DIVIDER_AXES.orientation },
    line: { control: 'select', options: DIVIDER_AXES.line },
  },
  stories: {
    Basic: { args: { orientation: 'horizontal', line: 'solid' } },
  },
};

export default meta;
