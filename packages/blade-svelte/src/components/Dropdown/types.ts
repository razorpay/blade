import type { Snippet } from 'svelte';
import type { Placement } from '@floating-ui/dom';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';
import type { DropdownTriggerer } from './dropdownComponentIds';

/** Selection mode of the Dropdown. */
export type DropdownSelectionType = 'single' | 'multiple';

/** Keydown handler shape (web-only port of React `FormInputHandleOnKeyDownEvent`). */
export type DropdownKeydownEvent = { event: KeyboardEvent };

export interface DropdownProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /**
   * Trigger + `DropdownOverlay` children.
   */
  children: Snippet;
  /**
   * Control the open/close state (controlled mode). Leave undefined for
   * uncontrolled behavior.
   */
  isOpen?: boolean;
  /**
   * Called whenever the open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Selection mode.
   * @default 'single'
   */
  selectionType?: DropdownSelectionType;
  /**
   * @private
   * Width applied to the outer relative container. Use `width` on
   * `DropdownOverlay` to change the menu width.
   */
  _width?: string;
  /**
   * Test ID for the container element.
   */
  testID?: string;
}

export interface DropdownOverlayProps extends DataAnalyticsAttribute {
  /**
   * Overlay content — `DropdownHeader?`, `ActionList`, `DropdownFooter?`.
   */
  children: Snippet;
  /**
   * z-index of the overlay.
   * @default 1001
   */
  zIndex?: number;
  /**
   * Override the overlay width.
   */
  width?: string;
  /**
   * Override the overlay min-width.
   */
  minWidth?: string;
  /**
   * Override the overlay max-width.
   */
  maxWidth?: string;
  /**
   * Element to position the overlay relative to. When omitted, the Dropdown's
   * own trigger wrapper is used. Svelte uses an element binding instead of
   * React's ref object.
   */
  referenceEl?: HTMLElement | null;
  /**
   * Placement of the overlay.
   * @default 'bottom-start'
   */
  defaultPlacement?: Placement;
  /**
   * @private
   * @default false
   */
  _isNestedDropdown?: boolean;
  /**
   * Test ID for the overlay element.
   */
  testID?: string;
}

export interface DropdownHeaderProps extends DataAnalyticsAttribute {
  /** Header title text. */
  title?: string;
  /** Secondary text below the title. */
  subtitle?: string;
  /** Leading slot (left of the title). */
  leading?: Snippet;
  /** Trailing slot (right side). */
  trailing?: Snippet;
  /** Slot rendered adjacent to the title text. */
  titleSuffix?: Snippet;
  /** Inner children (e.g. AutoComplete in header). */
  children?: Snippet;
  /** Test ID for the header element. */
  testID?: string;
}

export interface DropdownFooterProps extends DataAnalyticsAttribute {
  /** Footer content. */
  children?: Snippet;
  /** Test ID for the footer element. */
  testID?: string;
}

type BaseInputDropdownButtonProps = {
  /** Controls open state of the dropdown. */
  isOpen?: boolean;
  /** Called when the button loses focus. */
  onBlur?: (event: FocusEvent) => void;
  /** Called on keydown. */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Called on click. */
  onClick?: (event: MouseEvent) => void;
  /** Accessibility label. @default `change ${displayValue} filter` */
  accessibilityLabel?: string;
  /** @private */
  _isInsideSearchInput?: boolean;
  /** Disabled state. */
  isDisabled?: boolean;
  /** Called when the selected value changes. */
  onChange?: (props: { name: string; value: string }) => void;
  /** Name used in the change payload. */
  name?: string;
  /** Test ID for the button element. */
  testID?: string;
  /** Leading icon component. */
  icon?: IconComponent;
  /** Custom leading slot (e.g. a flag). */
  leading?: Snippet;
  /**
   * Show the selected value text in the trigger.
   * @default true
   */
  showDisplayValue?: boolean;
  /**
   * Size of the button.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & DataAnalyticsAttribute;

type ControlledInputDropdownButtonProps = BaseInputDropdownButtonProps & {
  /** Controlled selected value. */
  value: string;
  defaultValue?: never;
};

type UncontrolledInputDropdownButtonProps = BaseInputDropdownButtonProps & {
  value?: never;
  /** Initial selected value (uncontrolled). */
  defaultValue: string;
};

export type InputDropdownButtonProps =
  | ControlledInputDropdownButtonProps
  | UncontrolledInputDropdownButtonProps;

/** A registered ActionList option (mirrors React `OptionsType[number]`). */
export type DropdownOption = {
  /** Stable id of the registering item (used for reordering-safe indexing). */
  id: string;
  title: string;
  value: string;
  href?: string;
  onClickTrigger?: (isSelected: boolean) => void;
};

/**
 * Reactive context provided by `Dropdown` and consumed by `DropdownOverlay`,
 * `DropdownHeader/Footer`, `InputDropdownButton`, and (optionally) `ActionList`.
 * Getter fields stay live across the context boundary.
 */
export type DropdownContextValue = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  close: () => void;
  selectionType: DropdownSelectionType;
  selectedIndices: number[];
  /** Seed/replace selection by option value (used by controllable triggers). */
  setSelectedValues: (values: string[]) => void;
  activeIndex: number;
  filteredValues: string[];
  options: DropdownOption[];
  hasFooterAction: boolean;
  setHasFooterAction: (value: boolean) => void;
  hasAutoCompleteInHeader: boolean;
  setHasAutoCompleteInHeader: (value: boolean) => void;
  dropdownBaseId: string;
  dropdownTriggerer: DropdownTriggerer;
  setDropdownTriggerer: (triggerer: DropdownTriggerer) => void;
  value: string;
  displayValue: string;
  /** Register an option; returns nothing — the item reads its index reactively. */
  registerOption: (option: DropdownOption) => void;
  unregisterOption: (id: string) => void;
  /** Index of an option by its stable id (reorder-safe). */
  getOptionIndex: (id: string) => number;
  onOptionClick: (event: MouseEvent | KeyboardEvent, index: number) => void;
  onTriggerClick: () => void;
  onTriggerKeydown: (payload: DropdownKeydownEvent) => void;
  /** Element bindings (Svelte uses element refs instead of React ref objects). */
  triggererEl: HTMLElement | null;
  setTriggererEl: (el: HTMLElement | null) => void;
  triggererWrapperEl: HTMLElement | null;
  actionListContainerEl: HTMLElement | null;
  setActionListContainerEl: (el: HTMLElement | null) => void;
};
