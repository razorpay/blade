import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'VirtualWindow',
  description:
    "A scrolling window that mounts only the rows in view, for lists too long to render whole (VirtualOptionList is built on it). Rows may differ in height: each is measured once mounted and remembered by key.",
  stories: {
    Basic: {
      description: 'Ten thousand rows of mixed height in a 320px window.',
      argTypes: {},
    },
  },
};

export default meta;
