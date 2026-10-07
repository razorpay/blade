import { SEGMENTED_CONTROL_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'SegmentedControl',
  description:
    'One form field that picks a value from a few segments drawn as a joined pill: a radiogroup of radio buttons over the radio-group model, roving with the navigable-list base. The pick is a thumb that slides between segments, drawn by its styles.',
  argTypes: {
    size: { control: 'select', options: SEGMENTED_CONTROL_AXES.size },
    color: {
      control: 'select',
      options: SEGMENTED_CONTROL_AXES.color,
      description: 'white: over a brand-colour pane',
    },
    label: { control: 'text' },
    helpText: { control: 'text' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description:
        'Controlled through bind:value; arrows move focus and the pick, wrapping at the ends and skipping the disabled segment.',
      args: {
        size: 'medium',
        color: 'neutral',
        label: 'EMI tenure',
        helpText: '',
        isDisabled: false,
      },
    },
    IconOnly: {
      name: 'Icon only',
      description:
        'Segments with a leading icon and no label are named by accessibilityLabel. The last control shows a leading asset and a trailing Counter: the segment spaces leading item, label and trailing item 8px apart.',
      argTypes: {},
    },
    InForm: {
      name: 'In a form',
      description:
        'A required control: the form blocks submission until a segment is picked and collects the value under the control name.',
      argTypes: {},
    },
  },
};

export default meta;
