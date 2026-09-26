import { MODAL_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Modal',
  description:
    'Modal component over the dialog model (packages/blade/runes/modal) on the layer stack: placement and size come from its styles.',
  argTypes: {
    placement: { control: 'select', options: MODAL_AXES.placement },
    size: { control: 'select', options: MODAL_AXES.size },
    isDismissible: {
      control: 'boolean',
      description: 'Lets the backdrop, Escape and back close it',
    },
    closeLabel: {
      control: 'text',
      description: 'Names the close button; empty removes it',
    },
    title: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        placement: 'center',
        size: 'default',
        isDismissible: true,
        closeLabel: 'Close',
        title: 'Remove this card?',
      },
    },
    BottomSheet: {
      name: 'Bottom sheet',
      description:
        "Blade's BottomSheet is Modal with `bottomSheetLook` — `<BottomSheet>` fixes it: anchored to the bottom with a handle, dragged down to dismiss (a fling, or past half its height). onDismiss reports source 'drag'. `adaptive` makes it a modal on desktop: centred, or with `placement: 'bottom'` a handle-less panel on the same edge.",
      argTypes: {
        isDismissible: {
          control: 'boolean',
          description: 'Off: the sheet resists the drag and settles back',
        },
        adaptive: {
          control: 'boolean',
          description: 'A modal above the desktop breakpoint',
        },
        placement: {
          control: 'select',
          options: ['center', 'bottom'],
          description: 'The adaptive modal on desktop; ignored otherwise',
        },
      },
      args: { isDismissible: true, adaptive: false, placement: 'center' },
    },
    Stacked: {
      name: 'Stacked modals',
      description:
        'Escape and back reach only the top layer; the modal beneath goes inert until it is on top again.',
      argTypes: {},
    },
    Imperative: {
      name: 'openModal',
      description:
        'Opened from code, not markup: ask and wait for an answer, stack a second modal from inside the first, and open a lazily imported component — the modal is up at once, with a shimmer until the component arrives.',
      argTypes: {},
    },
  },
};

export default meta;
