import { BREADCRUMB_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Breadcrumb',
  description:
    "The user's location as a trail of links, from Blade DSL's Breadcrumb (Figma): subtle links between slashes, or intense pills between chevrons. The current page is text, marked aria-current.",
  argTypes: {
    size: { control: 'select', options: BREADCRUMB_AXES.size },
    color: { control: 'select', options: BREADCRUMB_AXES.color },
    emphasis: { control: 'select', options: BREADCRUMB_AXES.emphasis },
    showLastSeparator: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: { size: 'medium', color: 'primary', emphasis: 'subtle', showLastSeparator: false },
    },
    Matrix: {
      description: 'Every size and colour, subtle, and the intense pills (white over a dark surface).',
      argTypes: {},
    },
  },
};

export default meta;
