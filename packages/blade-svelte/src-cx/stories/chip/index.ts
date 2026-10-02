import { CHIP_GROUP_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Chip',
  description:
    "Blade's Chip and ChipGroup: native radios (single) or checkboxes (multiple) drawn as chips, over the headless choice list.",
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: CHIP_GROUP_AXES.size },
    color: { control: 'select', options: CHIP_GROUP_AXES.color },
    necessityIndicator: { control: 'select', options: ['none', 'required', 'optional'] },
    isDisabled: { control: 'boolean' },
    helpText: { control: 'text' },
    validationState: { control: 'select', options: ['none', 'error'] },
    errorText: { control: 'text' },
  },
  stories: {
    Single: {
      name: 'Single selection',
      description: 'One pick: the chips are radios, so the arrows move the pick.',
      args: {
        label: 'Select Business type:',
        size: 'small',
        color: 'primary',
        necessityIndicator: 'none',
        isDisabled: false,
        helpText: '',
        validationState: 'none',
        errorText: 'Pick a business type',
      },
    },
    Multiple: {
      name: 'Multi selection',
      description: 'selectionType="multiple": each chip toggles, and the value is an array.',
      argTypes: {
        size: { control: 'select', options: CHIP_GROUP_AXES.size },
        color: { control: 'select', options: CHIP_GROUP_AXES.color },
      },
      args: { size: 'small', color: 'primary' },
    },
    Sizes: {
      name: 'Sizes and colours',
      description: 'Every size in every colour: picked, at rest and disabled.',
      argTypes: {},
    },
    Icons: {
      name: 'With icons',
      description: 'An icon ahead of the label, or an icon alone.',
      argTypes: {},
    },
    InForm: {
      name: 'In a form',
      description: 'A required group: the form blocks submission until a chip is picked.',
      argTypes: {},
    },
  },
};

export default meta;
