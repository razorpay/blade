import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { SurfaceClasses } from '../layer/styles';

/**
 * The parts of a Modal. Static class strings only. Open/closed styling
 * rides `data-state`: Modal stamps `data-state="open" | "closed"` on
 * the root, and the enter/exit visuals key on it
 * (`group-data-[state=closed]:…`) as CSS transitions. The modal stays
 * mounted for the longest computed transition among the backdrop and the
 * panel, so the reduced-motion variant (no transition) unmounts immediately with no
 * extra wiring. On native the platform sheet owns the scrim and enter/exit,
 * shaped through `nativeSheet` (see `SurfaceClasses`).
 */
export interface ModalClasses extends SurfaceClasses {
  header: string;
  title: string;
  /** The close button. */
  close: string;
  body: string;
  footer: string;
}

export type ModalStyleResolver<P> = (props: P) => ModalClasses;

/**
 * Library-internal seam. A spelling of Modal (BottomSheet) hands the modal
 * its resolver instead of style props: not an axis, no public grammar. The
 * exported look (`bottomSheetLook` in `../bottom-sheet/styles`) is the
 * sanctioned value, and `openModal` options carry it too; Modal imports
 * nothing of it. The modal's typed rest reaches the look, so a look may
 * read a switch of its own there (the sheet's `adaptive`).
 */
export interface ModalLookProp {
  look?: ModalStyleResolver<ModalStyleProps>;
}

/** The close button's icon; `ModalCloseIcon.svelte` is the component. */
export type ModalCloseIconSnippet<P> = Snippet<[P]>;

/** The body while an opened modal's component loads; see `ModalPending.svelte`. */
export type ModalPendingSnippet<P> = Snippet<[P]>;

/** The blade taxonomy as data. */
export const MODAL_AXES = {
  placement: ['center', 'bottom', 'top', 'left', 'right', 'full'],
  size: ['default', 'full'],
  pace: ['default', 'snappy'],
} as const;

type Axis<K extends keyof typeof MODAL_AXES> = AxisValue<typeof MODAL_AXES, K>;

/** Derived from MODAL_AXES: add a value there, never here. */
export interface ModalStyleProps {
  /** Where the panel sits; a look (a sheet) decides it itself and ignores this. */
  placement?: Axis<'placement'>;
  /**
   * The panel's width on desktop: a fixed column by default, or `full` to
   * span the host (a sheet rising in a half-width frame). On mobile every
   * panel spans the viewport.
   */
  size?: Axis<'size'>;
  /** `snappy`: v2's quick-buy drawer — 250ms, expo-out. */
  pace?: Axis<'pace'>;
}

// Ported from app/v2/modules/navstack/components/Overlay.svelte and
// app/v2/modules/common/components/Modal.svelte. Semantic tokens only —
// merchant theming reaches every class through the CSS-var seam. Enter/exit
// are CSS transitions keyed on the root's data-state, so an interrupted open
// reverses from where it is; the scrim is the LayerHost's (../layer-host),
// one under every open modal, and fades at the default pace here.
const PACE: Record<Axis<'pace'>, string> = {
  default: 'duration-moderate ease-entrance motion-reduce:transition-none',
  // 250ms in v2; Blade's nearest step is `moderate` (280ms), so the pace
  // differs from the default by its easing only.
  snappy:
    'duration-moderate [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
};

// The root inherits the host box's `pointer-events-none`; the panel opts
// back in, so a click beside it falls through to the host's scrim.
const ROOT = 'group absolute inset-0 z-50 flex';

const PANEL =
  'pointer-events-auto relative flex max-h-full flex-col overflow-hidden bg-popup-gray-subtle text-surface-gray-normal outline-none transition-all';

/**
 * Per placement: how the root lays the panel out, where the closed panel
 * parks, and its elevation (a sheet swaps in Blade's upward shadow).
 */
export const MODAL_PLACEMENT: Record<
  Axis<'placement'>,
  { root: string; panel: string }
> = {
  center: {
    root: 'items-center justify-center p-4',
    panel:
      'w-full rounded-small shadow-highRaised group-data-[state=closed]:scale-95 group-data-[state=closed]:opacity-0',
  },
  bottom: {
    root: 'items-end justify-center m:justify-end m:p-2',
    panel:
      'w-full rounded-tl-small rounded-tr-small shadow-highRaised group-data-[state=closed]:translate-y-full m:rounded-small',
  },
  top: {
    root: 'items-start justify-center m:p-2',
    panel:
      'w-full rounded-bl-small rounded-br-small shadow-highRaised group-data-[state=closed]:-translate-y-full m:rounded-small',
  },
  left: {
    root: 'items-stretch justify-start m:p-2',
    panel:
      'h-full w-full shadow-highRaised group-data-[state=closed]:-translate-x-full m:rounded-small',
  },
  right: {
    root: 'items-stretch justify-end m:p-2',
    panel:
      'h-full w-full shadow-highRaised group-data-[state=closed]:translate-x-full m:rounded-small',
  },
  full: {
    root: 'items-stretch m:p-2',
    panel:
      'h-full w-full shadow-highRaised group-data-[state=closed]:translate-y-full m:rounded-small',
  },
};

// Native: the platform sheet is bottom-anchored and content-sized; only
// `full` changes its shape.
const NATIVE_SHEET: Record<Axis<'placement'>, Record<string, string>> = {
  center: {},
  bottom: {},
  top: {},
  left: {},
  right: {},
  full: { 'data-height': 'full', 'data-radius': '0' },
};

const NO_DRAG = { isEnabled: false, zone: '', handle: '', grip: '' };

// v2's medium modal column (26rem there; Blade's 400px step here); `full`
// leaves the panel at the host's width.
const SIZE: Record<Axis<'size'>, string> = {
  default: 'm:w-blade-400',
  full: '',
};

/** What a look decides under the fixed chrome: the layout per state, the drag, the native sheet. */
export interface ModalLayout {
  root: string;
  panel: string;
  drag: ModalClasses['drag'];
  nativeSheet: ModalClasses['nativeSheet'];
}

/**
 * The modal's parts for a layout: the fixed root and panel chrome, the
 * pace, the desktop column and the three sections. `resolveModal` and the
 * sheet looks compose on it.
 */
export function modalClasses(
  layout: ModalLayout,
  props: ModalStyleProps = {}
): ModalClasses {
  const { size = 'default', pace = 'default' } = props;
  return {
    root: `${ROOT} ${layout.root}`,
    drag: layout.drag,
    nativeSheet: layout.nativeSheet,
    panel: `${PANEL} ${PACE[pace]} ${layout.panel} ${SIZE[size]}`,
    // Three padded sections with a hairline between each: 20px all round,
    // the header keeping clear of the close button, the footer laying its
    // actions out in a row.
    header: 'flex flex-col gap-1 border-b-thin border-solid border-surface-gray-muted p-5 pr-14',
    title: 'font-heading text-200 leading-200 font-semibold',
    // Blade's close button (blade-core Modal/modal.module.css): a muted
    // icon, subtle on hover, press and keyboard focus, with a 2px primary
    // outline 2px out.
    close:
      'absolute right-3.5 top-3.5 z-10 flex w-10 h-10 items-center justify-center border-none bg-transparent icon-interactive-gray-muted hover:icon-interactive-gray-subtle active:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle focus-visible:outline-solid focus-visible:outline-thicker focus-visible:outline-offset-2 focus-visible:outline-interactive-primary-default',
    body: 'overflow-auto p-5',
    footer: 'flex gap-4 border-t-thin border-solid border-surface-gray-muted px-5 pb-5 pt-4',
  };
}

export const resolveModal: ModalStyleResolver<ModalStyleProps> = (
  props: ModalStyleProps = {}
) => {
  const { placement = 'center', size = 'default', pace = 'default' } = props;
  return modalClasses(
    {
      ...MODAL_PLACEMENT[placement],
      drag: NO_DRAG,
      nativeSheet: NATIVE_SHEET[placement],
    },
    // A full placement already spans the host, as `size: 'full'` does.
    { size: placement === 'full' ? 'full' : size, pace }
  );
};
