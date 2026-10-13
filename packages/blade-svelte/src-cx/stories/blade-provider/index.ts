import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'BladeProvider',
  description:
    "Defaults for component axes, not theme tokens: an overall `size` every sized control snaps to, and per-component style props. A prop wins, then the nearest provider's entry for the component, then its overall size, then Blade's default.",
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    checkout: {
      control: 'boolean',
      description: "Checkout's defaults: neutral buttons, small checkboxes, filled cardGroups",
    },
    modalVariant: {
      control: 'select',
      options: ['modal', 'sheet'],
      description: "Modal's variant",
    },
  },
  stories: {
    Basic: {
      args: { size: 'large', checkout: true, modalVariant: 'sheet' },
    },
  },
};

export default meta;
