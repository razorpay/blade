import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { ToastStackGeometry } from '../../runes/toast/stack-layout';
import { PHONE_MEDIA } from '../shared/breakpoint';
import { INTENTS, type Intent } from '../shared/intent';
import type { IconSource } from '../../runes/icon/source';
import { resolveButton } from '../button/styles';
import { resolveIconButton } from '../icon-button/styles';
import { alertOctagon, alertTriangle, checkCircle, info } from '../icons';

/**
 * The parts of a toast. Enter/exit ride the root's `data-state="open" |
 * "closed"` as CSS transitions, as the modal's do; a leaving toast stays
 * mounted for its longest computed transition. The edge it slides from is
 * the stack's (`ToastStackClasses.slide`).
 */
export interface ToastClasses {
  /** One per toast. */
  root: string;
  /** `alert` interrupts a screen reader: the looks that are failures. */
  role: 'status' | 'alert';
  icon: string;
  /** Blade's glyph for the colour when `icon` names none. */
  defaultIcon: IconSource;
  /** Wraps the content: 4px above and below. */
  body: string;
  content: string;
  /** The action and the dismiss button, 12px apart at the row's end. */
  trailing: string;
  /** Blade's action: an xsmall tertiary white Button. */
  action: string;
  /** Blade's dismiss: a subtle medium IconButton. */
  close: string;
}

/** The dismiss button's icon; `ToastCloseIcon.svelte` is the component. */
export type ToastCloseIconSnippet<P> = Snippet<[P]>;

export interface ToastStackClasses {
  /**
   * Web: the box at the host's edge the toasts are placed in, with no
   * height of its own; each toast sits in a `wrapper` moved by the stack's
   * `--toast-*` variables. Native: `column`.
   */
  root: string;
  /** Native: a flow column, no placement variables. */
  column: string;
  /** Per toast, reading `--toast-offset/scale/height/opacity/z`. */
  wrapper: string;
  /**
   * Fills the gutters between expanded toasts so the pointer never leaves
   * the stack between two of them; reads `--hover-bottom/height`.
   */
  hover: string;
  /** On a toast: the edge it enters from and leaves to. */
  slide: string;
  /** Shown at once; a newer toast evicts the oldest beyond it. */
  capacity: number;
  /** ms a toast stays when `showToast` passes no `duration`. */
  duration: number;
  /** The stacking numbers: `layoutToastStack` does the maths. */
  geometry: ToastStackGeometry;
  /** Up to this many toasts the stack is always expanded; beyond, only while held. */
  minShown: { phone: number; desktop: number };
  /** Where a tap, not a hover, holds the stack. */
  phoneMedia: string;
}

export type ToastStyleResolver<P> = (props: P) => ToastClasses;
export type ToastStackStyleResolver<P> = (props: P) => ToastStackClasses;

/** The blade taxonomy as data. */
export const TOAST_AXES = {
  color: INTENTS,
} as const;

export const TOAST_STACK_AXES = {
  placement: ['bottom', 'top'],
} as const;

/** Derived from TOAST_AXES: add a value there, never here. */
export interface ToastStyleProps {
  color?: AxisValue<typeof TOAST_AXES, 'color'>;
}

export interface ToastStackStyleProps {
  placement?: AxisValue<typeof TOAST_STACK_AXES, 'placement'>;
}

const URGENT: Intent[] = ['negative'];

// Blade's informational toast (toast.module.css): the intent's popup fill
// with its popup border as a 1px line, white text and icon on it, and a
// 1.5px static-white faded-highlighted bevel along the top edge.
// Blade's Toast: the colour's popup fill, its 1px popup rim drawn inside,
// the white bevel along the top, and the medium backdrop blur.
const TONE: Record<Intent, string> = {
  neutral: 'bg-popup-neutral-moderate shadow-toast-neutral',
  information: 'bg-popup-information-moderate shadow-toast-information',
  positive: 'bg-popup-positive-moderate shadow-toast-positive',
  notice: 'bg-popup-notice-moderate shadow-toast-notice',
  negative: 'bg-popup-negative-moderate shadow-toast-negative',
};

const LEADING: Record<Intent, IconSource> = {
  neutral: info,
  information: info,
  positive: checkCircle,
  notice: alertTriangle,
  negative: alertOctagon,
};

// 44px tall: 12px padding round a 20px line, the 16px icon and the dismiss
// cross centred on it, 8px between the parts and 12px either side of the
// hairline before the cross. Blade's motion: it slides in from the stack's
// edge over gentle/entrance (480ms) and out over moderate/exit (280ms),
// fading both ways — a transition takes the pace of the state it moves to,
// so each state names its own. It takes clicks while the box around it does
// not.
// Blade's Toast: 12px round, 12px in and 8px above and below, its parts
// 8px apart; the content body small in `surface.text.static-white.normal`,
// 4px above and below; the icon static white. Enter slides in from the
// edge over gentle/entrance, exit leaves over moderate/exit.
export const resolveToast: ToastStyleResolver<ToastStyleProps> = (props) => {
  const { color = 'neutral' } = props;
  return {
    root: `pointer-events-auto flex w-full items-center gap-2 overflow-hidden rounded-medium px-3 py-2 backdrop-blur-medium [transition-property:translate,opacity] data-[state=open]:duration-gentle data-[state=open]:ease-entrance data-[state=closed]:duration-moderate data-[state=closed]:ease-exit motion-reduce:transition-none data-[state=closed]:opacity-0 ${TONE[color]}`,
    icon: 'flex shrink-0 items-center icon-surface-static-white-normal',
    defaultIcon: LEADING[color],
    body: 'min-w-0 py-1',
    content: 'block font-text font-regular text-75 leading-75 tracking-50 text-surface-static-white-normal',
    trailing: 'ms-auto flex shrink-0 items-center gap-3',
    action: resolveButton({ variant: 'tertiary', color: 'white', size: 'xsmall' }).root,
    close: resolveIconButton({ emphasis: 'subtle', size: 'medium' }).root,
    // A failure interrupts a screen reader; Blade announces every toast
    // politely.
    role: URGENT.includes(color) ? 'alert' : 'status',
  };
};

// Blade's stack: the newest toast in front at the edge, the rest behind it.
// Each wrapper is moved away from the edge by `--toast-offset` and shrunk by
// `--toast-scale`, cropped to `--toast-height` and hidden by
// `--toast-opacity`; all of it moves over gentle/standard (480ms). The
// toasts' motion is theirs (`resolveToast`); this is the column's.
const MOTION =
  '[transition-property:translate,scale,opacity,height] duration-gentle ease-standard motion-reduce:transition-none';

const PLACEMENT: Record<
  AxisValue<typeof TOAST_STACK_AXES, 'placement'>,
  {
    root: string;
    column: string;
    wrapper: string;
    hover: string;
    slide: string;
  }
> = {
  bottom: {
    root: 'bottom-4 m:bottom-6',
    column: 'bottom-0 flex-col',
    wrapper: 'bottom-0 [translate:0_calc(var(--toast-offset)*-1px)]',
    hover: '[bottom:calc(var(--hover-bottom)*1px)]',
    slide: 'data-[state=closed]:translate-y-full',
  },
  top: {
    root: 'top-4 m:top-6',
    column: 'top-0 flex-col-reverse',
    wrapper: 'top-0 [translate:0_calc(var(--toast-offset)*1px)]',
    hover: '[top:calc(var(--hover-bottom)*1px)]',
    slide: 'data-[state=closed]:-translate-y-full',
  },
};

// Blade's numbers: 12px gutters and peeks, 5% per step, one toast in front,
// three peeking; a phone shows one toast expanded, a desktop three.
export const resolveToastStack: ToastStackStyleResolver<
  ToastStackStyleProps
> = (props) => {
  const { placement = 'bottom' } = props;
  const edge = PLACEMENT[placement];
  return {
    root: `pointer-events-none absolute inset-x-4 z-60 mx-auto max-w-[360px] m:inset-x-6 ${edge.root}`,
    column: `pointer-events-none absolute inset-x-0 z-60 flex items-center gap-2 p-4 ${edge.column}`,
    wrapper: `absolute inset-x-0 flex origin-center items-start overflow-hidden ${MOTION} [scale:var(--toast-scale)] [opacity:var(--toast-opacity)] [z-index:var(--toast-z)] h-[var(--toast-height)] [&>*]:pointer-events-auto ${edge.wrapper}`,
    hover: `absolute inset-x-0 [z-index:-100] h-[calc(var(--hover-height)*1px)] data-[expanded=true]:pointer-events-auto ${edge.hover}`,
    slide: edge.slide,
    capacity: 3,
    duration: 4000,
    geometry: { gutter: 12, peek: 12, scaleStep: 0.05, front: 1, peeks: 3 },
    minShown: { phone: 1, desktop: 3 },
    phoneMedia: PHONE_MEDIA,
  };
};
