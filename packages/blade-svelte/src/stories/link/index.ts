import { LINK_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Link',
  description:
    'Blade\'s Link: an anchor that goes somewhere, or (`variant="button"`) a button that acts and reads as a link. Only the anchor underlines, on hover and focus.',
  argTypes: {
    color: { control: 'select', options: LINK_AXES.color },
    size: { control: 'select', options: LINK_AXES.size },
    withIcon: { control: 'boolean', description: 'icon: a leading glyph' },
    withTrailingIcon: { control: 'boolean', description: 'trailingIcon: a trailing glyph' },
    isDisabled: { control: 'boolean' },
    newTab: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        color: 'primary',
        size: 'medium',
        withIcon: false,
        withTrailingIcon: true,
        isDisabled: false,
        newTab: true,
      },
    },
    LinkOrButton: {
      description:
        'The anchor inline in a sentence, wrapping with it; the button form beside it, and an icon-only link named by accessibilityLabel.',
      argTypes: {},
    },
    Matrix: {
      description: 'Every colour and size, generated from LINK_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
