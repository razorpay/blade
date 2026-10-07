import { DROPDOWN_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Dropdown',
  description:
    'Pick a value from a floating list: a select field by default, or any trigger of your own. A single pick closes it; with isMultiple, rows lead with a checkbox and the list stays open. Same core and look as Menu.',
  argTypes: {
    size: { control: 'select', options: DROPDOWN_AXES.size },
    isDisabled: { control: 'boolean' },
    isDeselectable: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description: 'A select field: one pick, which shows in the field and closes the list.',
      args: { size: 'medium', isDisabled: false, isDeselectable: false },
    },
    Multiple: {
      description: 'isMultiple: every pick toggles a row and the list stays open; the footer applies or clears.',
      argTypes: {},
    },
    WithSearch: {
      description: 'A header with search: focus stays in the field while the arrows move over the matches; sections step aside while you type.',
      argTypes: {},
    },
    WithButton: {
      description: 'Any trigger: the snippet gets the picked rows’ titles.',
      argTypes: {},
    },
    States: {
      description: 'Loading, and a search that finds nothing.',
      argTypes: {},
    },
  },
};

export default meta;
