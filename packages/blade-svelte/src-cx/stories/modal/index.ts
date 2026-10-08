import { DRAWER_AXES, MODAL_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Modal',
  description:
    'Modal component over the dialog model (packages/blade/runes/modal) on the layer stack: variant and size come from its styles.',
  argTypes: {
    variant: { control: 'select', options: MODAL_AXES.variant },
    size: { control: 'select', options: MODAL_AXES.size },
    isDismissible: {
      control: 'boolean',
      description: 'Whether a dismissal closes it by itself, and whether the close button shows',
    },
    closeLabel: {
      control: 'text',
      description: "The close button's accessible name",
    },
    title: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'modal',
        size: 'small',
        isDismissible: true,
        closeLabel: 'Close',
        title: 'Remove this card?',
        withChrome: false,
        leading: 'none',
        showBackButton: false,
      },
      argTypes: {
        showBackButton: {
          control: 'boolean',
          description: 'A back button first in the header; pressing it fires `onBackButtonClick`, not a dismissal',
        },
        leading: {
          control: 'select',
          options: ['none', 'icon', 'snippet'],
          description:
            'Fills `leading`: an icon (a glyph on the title line) or a snippet (an asset in the 32px slot)',
        },
        withChrome: {
          control: 'boolean',
          description:
            'Fills the `chrome` snippet: an illustration hanging off the top edge, unclipped',
        },
      },
    },
    BottomSheet: {
      name: 'Bottom sheet',
      description:
        "Blade's BottomSheet is Modal in its `sheet` variant: anchored to the bottom with a handle, dragged down to dismiss (a fling, or past half its height). onDismiss reports source 'drag'. `variant` picks sheet or modal (centred); the app decides which.",
      argTypes: {
        isDismissible: {
          control: 'boolean',
          description: 'Off: the sheet resists the drag; a fling reports it and it settles back',
        },
        variant: {
          control: 'select',
          options: ['sheet', 'modal'],
        },
        isDraggable: {
          control: 'boolean',
          description: 'Dragged down to dismiss; the handle shows only while on',
        },
      },
      args: { isDismissible: true, variant: 'sheet', isDraggable: true },
    },
    BottomSheetSteps: {
      name: 'Back button',
      description:
        'A two-step sheet: `showBackButton` on step 2, and `onBackButtonClick` returns to step 1. The back button is not a dismissal.',
      argTypes: {},
    },
    Drawer: {
      name: 'Drawer',
      description:
        "Blade's Drawer is Modal in its `drawer` variant: full height, docked to the right edge (or, with `left-drawer`, the left), sliding in from it. Every other prop is the modal's.",
      argTypes: {
        isDismissible: {
          control: 'boolean',
          description: 'Lets the backdrop, Escape and back close it',
        },
        variant: {
          control: 'select',
          options: DRAWER_AXES.variant,
          description: 'The edge it docks to',
        },
        pace: { control: 'select', options: DRAWER_AXES.pace },
        isDraggable: {
          control: 'boolean',
          description: 'Dragged toward its edge, by the header, to dismiss',
        },
      },
      args: { isDismissible: true, variant: 'drawer', pace: 'default', isDraggable: false },
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
