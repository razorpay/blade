import { getContext, setContext } from 'svelte';

const DROPDOWN_CONTEXT_KEY = Symbol('blade-dropdown-context');

export type OptionsType = {
  title: string;
  value: string;
  onClickTrigger?: (isSelected: boolean) => void;
}[];

export type DropdownTriggererType =
  | 'SelectInput'
  | 'DropdownButton'
  | 'DropdownIconButton'
  | 'AutoComplete'
  | 'DropdownLink'
  | 'SearchInput'
  | 'FilterChipSelectInput'
  | 'InputDropdownButton';

export type DropdownContextState = {
  /** Whether the dropdown overlay is open */
  isOpen: boolean;
  /** Set open/close state */
  setIsOpen: (isOpen: boolean) => void;
  /** Close the dropdown */
  close: () => void;
  /** Selected option indices */
  selectedIndices: number[];
  setSelectedIndices: (value: number[]) => void;
  /** Controlled selection indices */
  controlledValueIndices: number[];
  setControlledValueIndices: (value: number[]) => void;
  /** All registered options */
  options: OptionsType;
  setOptions: (value: OptionsType) => void;
  /** Filtered values for autocomplete */
  filteredValues: string[];
  setFilteredValues: (values: string[]) => void;
  /** Currently focused option index */
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  /** Currently focused tag index */
  activeTagIndex: number;
  setActiveTagIndex: (value: number) => void;
  /** Ref for the triggerer element */
  triggererRef: { current: HTMLButtonElement | null };
  /** Ref for the header autocomplete element */
  headerAutoCompleteRef: { current: HTMLButtonElement | null };
  /** Ref for the triggerer wrapper element */
  triggererWrapperRef: { current: HTMLElement | null };
  /** Ref for the action list container */
  actionListItemRef: { current: HTMLDivElement | null };
  /** Ignore blur animation when focus stays inside dropdown */
  shouldIgnoreBlurAnimation: boolean;
  setShouldIgnoreBlurAnimation: (value: boolean) => void;
  /** Whether a keydown has been pressed (for keyboard navigation styling) */
  isKeydownPressed: boolean;
  setIsKeydownPressed: (value: boolean) => void;
  /** Base id shared across dropdown elements */
  dropdownBaseId: string;
  /** Which component is triggering the dropdown */
  dropdownTriggerer?: DropdownTriggererType;
  setDropdownTriggerer: (triggerer: DropdownTriggererType) => void;
  /** Single or multiple selection */
  selectionType?: 'single' | 'multiple';
  /** Whether footer contains an action */
  hasFooterAction: boolean;
  setHasFooterAction: (value: boolean) => void;
  /** Whether header contains an autocomplete input */
  hasAutoCompleteInHeader: boolean;
  setHasAutoCompleteInHeader: (value: boolean) => void;
  /** Counter that changes on each selection (use as dependency signal) */
  changeCallbackTriggerer: number;
  setChangeCallbackTriggerer: (value: number) => void;
  /** Whether SelectInput is in controlled mode */
  isControlled: boolean;
  setIsControlled: (value: boolean) => void;
  /** Stub: always false — BottomSheet integration not implemented */
  dropdownHasBottomSheet: false;
};

export function setDropdownContext(getter: () => DropdownContextState): void {
  setContext(DROPDOWN_CONTEXT_KEY, getter);
}

export function getDropdownContext(): () => DropdownContextState {
  return getContext<() => DropdownContextState>(DROPDOWN_CONTEXT_KEY);
}
