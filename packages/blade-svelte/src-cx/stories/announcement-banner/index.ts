import { ANNOUNCEMENT_BANNER_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'AnnouncementBanner',
  description:
    "A one-line message across the top of a page or section, from Blade DSL's Announcement Banner (Figma): an optional icon, centred or left-aligned, cut off with an ellipsis when it doesn't fit.",
  argTypes: {
    alignment: { control: 'select', options: ANNOUNCEMENT_BANNER_AXES.alignment },
    withIcon: { control: 'boolean' },
    content: { control: 'text' },
  },
  stories: {
    Basic: {
      args: { alignment: 'center', withIcon: true, content: 'Zero setup fees on UPI payments this month' },
    },
    WithLink: {
      description: 'The message can carry an inline Link.',
      argTypes: {},
    },
  },
};

export default meta;
