import { DRAWER_AXES } from '../../components/drawer';
import { MODAL_AXES } from '../../components/modal';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Modal',
  description:
    "Blade's Modal: the centred dialog over the dialog model on the layer stack. BottomSheet, Drawer, Popover and Menu are their own components over the same runes.",
  argTypes: {
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
        size: 'small',
        isDismissible: true,
        closeLabel: 'Close',
        title: 'Remove this card?',
        withChrome: false,
        leading: 'none',
      },
      argTypes: {
        leading: {
          control: 'select',
          options: ['none', 'icon', 'snippet'],
          description:
            "ModalHeader's `leading`: an icon (a glyph on the title line) or a snippet (an asset in the 32px slot)",
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
        "Blade's BottomSheet: anchored to the bottom with a handle, dragged down to dismiss (a fling, or past half its height). onDismiss reports source 'drag'.",
      argTypes: {
        isDismissible: {
          control: 'boolean',
          description: 'Off: the sheet resists the drag; a fling reports it and it settles back',
        },
        isDraggable: {
          control: 'boolean',
          description: 'Dragged down to dismiss; the handle shows only while on',
        },
      },
      args: { isDismissible: true, isDraggable: true },
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
        'Blade\'s Drawer: full height, docked to the right edge (or, with `side="left"`, the left), sliding in from it. Every other prop is the modal\'s.',
      argTypes: {
        isDismissible: {
          control: 'boolean',
          description: 'Lets the backdrop, Escape and back close it',
        },
        side: {
          control: 'select',
          options: DRAWER_AXES.side,
          description: 'The edge it docks to',
        },
        pace: { control: 'select', options: DRAWER_AXES.pace },
        isDraggable: {
          control: 'boolean',
          description: 'Dragged toward its edge, by the header, to dismiss',
        },
      },
      args: { isDismissible: true, side: 'right', pace: 'default', isDraggable: false },
    },
    Popover: {
      name: 'Popover',
      description:
        "Blade's Popover: a non-modal panel by its `trigger` with an arrow toward it — a title with a leading icon, the body and a footer — placed and flipped like a Tooltip, rendered in the overlay host. A click toggles it and shows a close button; Escape or a press outside closes. Click only: nothing opens on hover, which has no touch counterpart.",
      argTypes: {
        placement: {
          control: 'select',
          options: ['top', 'top-start', 'bottom-start', 'bottom', 'bottom-end', 'right', 'left'],
        },
        title: { control: 'text' },
        withTooltip: {
          control: 'boolean',
          description: 'A tooltip inside the popover: Escape closes the tooltip first',
        },
      },
      args: {
        placement: 'top',
        title: 'Convenience fee',
        withTooltip: false,
      },
    },
    Menu: {
      name: 'Menu',
      description:
        "Blade's Menu look, with an ActionList inside: a dialog panel by its trigger, no close button; the list's onPick closes it. Arrows open it from the trigger and move over the rows, typing jumps to a match, Enter or a click chooses.",
      argTypes: {
        placement: {
          control: 'select',
          options: ['bottom-end', 'bottom-start', 'top-end', 'right'],
        },
      },
      args: { placement: 'bottom-end' },
    },
    Placed: {
      name: 'Placed by classes',
      description:
        "`classes.root` replaces where the panel sits in the host — its alignment and gutter — over the positioned layer; the panel keeps its look and size. `classes.panel` replaces the panel's look and size; a function rewrites every class.",
      argTypes: {
        placement: { control: 'select', options: ['top-end', 'bottom-start', 'top-start'] },
      },
      args: { placement: 'top-end' },
    },
    Stacked: {
      name: 'Stacked modals',
      description:
        'Escape and back reach only the top layer; the modal beneath goes inert until it is on top again.',
      argTypes: {},
    },
  },
};

export default meta;
