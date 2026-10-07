import type { AxisValue } from '../../axes';
import type { PopoverClasses } from '../popover/styles';
import {
  POPUP_CHECK,
  POPUP_FOOTER,
  POPUP_GAP,
  POPUP_HEADER,
  POPUP_ITEM,
  POPUP_ROWS,
  POPUP_SECTION,
  POPUP_SELECTED,
  POPUP_SURFACE,
} from '../shared/popup-list';
import type { PopupItemClasses } from '../shared/popup-list';
import { INPUT_DISABLED_FILL } from '../shared/input';
import { FRAMED_VALIDATION, framedControl } from '../text-input/styles';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/** The blade taxonomy as data: the select trigger's sizes (TextInput's). */
export const DROPDOWN_AXES = {
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof DROPDOWN_AXES> = AxisValue<typeof DROPDOWN_AXES, K>;

/** Derived from DROPDOWN_AXES: add a value there, never here. */
export interface DropdownStyleProps {
  /** The select trigger's size, and its label's and hint's. @default 'medium' */
  size?: Axis<'size'>;
}

/**
 * The popover's parts, the shared row look (`shared/popup-list`, Menu's
 * too), and what a dropdown adds: the list box between the header and the
 * footer, the held pick, the multiple-choice checkbox, sections, the empty
 * and loading rows, and the select trigger.
 */
export interface DropdownClasses extends PopoverClasses, PopupItemClasses {
  /** The listbox: the rows' box, scrolling past its cap. */
  list: string;
  /** A single pick's row: Figma's darker wash. */
  itemSelected: string;
  /** The checkbox a multiple-choice row leads with (Checkbox's own box). */
  check: typeof POPUP_CHECK;
  section: string;
  /** Figma's section-heading row: Semibold 12/17, muted, 8px in, 2px under. */
  sectionTitle: string;
  /** No results, loading: a muted row, centred. */
  stateRow: string;
  header: typeof POPUP_HEADER;
  footer: string;
  /** The select trigger: TextInput's framed field as a button. */
  trigger: {
    root: string;
    box: string;
    disabled: string;
    invalid: string;
    value: string;
    placeholder: string;
    chevron: string;
  };
}

export type DropdownStyleResolver<P> = (props: P) => DropdownClasses;

export const resolveDropdown: DropdownStyleResolver<DropdownStyleProps> = (props = {}) => {
  const size = props.size ?? 'medium';
  return {
    root: 'relative flex flex-col',
    // The surface holds the header, the list and the footer; the list carries
    // the rows' spacing, as Menu's panel does.
    panel: POPUP_SURFACE,
    list: `${POPUP_ROWS} max-h-[320px] overflow-y-auto`,
    ...POPUP_ITEM,
    itemSelected: POPUP_SELECTED,
    check: POPUP_CHECK,
    section: POPUP_SECTION.root,
    sectionTitle: POPUP_SECTION.title,
    stateRow:
      'flex items-center justify-center gap-2 p-2 font-text text-100 leading-100 tracking-50 text-surface-gray-muted',
    header: POPUP_HEADER,
    footer: POPUP_FOOTER,
    trigger: {
      root: 'flex w-full flex-col gap-1',
      box: `${framedControl(size)} flex cursor-pointer flex-row items-center gap-2 text-left`,
      disabled: `${INPUT_DISABLED_FILL} cursor-not-allowed`,
      invalid: FRAMED_VALIDATION.error,
      value: 'min-w-0 flex-1 truncate',
      placeholder: 'min-w-0 flex-1 truncate text-surface-gray-disabled',
      chevron: 'flex shrink-0 items-center text-surface-gray-muted',
    },
    nativePlacement: NATIVE_PLACEMENT,
    gap: POPUP_GAP,
  };
};

/** What a Dropdown hands its items and parts. */
export interface DropdownShared {
  classes: DropdownClasses;
}
