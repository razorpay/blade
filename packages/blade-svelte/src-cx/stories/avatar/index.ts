import { AVATAR_AXES, AVATAR_GROUP_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Avatar',
  description:
    "A person or an entity at a glance, from Blade DSL's Avatar (Figma): their image, else their initials, else a glyph; a circle for a person, a square for a business. With onClick or href it's a button or a link. AvatarGroup stacks them.",
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: AVATAR_AXES.size },
    variant: { control: 'select', options: AVATAR_AXES.variant },
    color: { control: 'select', options: AVATAR_AXES.color },
    isSelected: { control: 'boolean' },
    withImage: { control: 'boolean' },
    isInteractive: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        name: 'Nitin Kumar',
        size: 'large',
        variant: 'circle',
        color: 'neutral',
        isSelected: false,
        withImage: false,
        isInteractive: true,
      },
    },
    Matrix: {
      description: 'Every size, in both shapes; the colours; image, initials and glyph; the indicator and trusted-badge addons.',
      argTypes: {},
    },
    Group: {
      description: "AvatarGroup: the group's size wins; density sets the overlap; maxCount folds the rest into \"+N\".",
      argTypes: {
        size: { control: 'select', options: AVATAR_GROUP_AXES.size },
        density: { control: 'select', options: AVATAR_GROUP_AXES.density },
        maxCount: { control: 'number' },
      },
      args: { size: 'medium', density: 'compact', maxCount: 4 },
    },
  },
};

export default meta;
