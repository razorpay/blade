import type React from 'react';
import type { Placement } from '@floating-ui/react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ContainerElementType, DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';

type DropdownProps = {
  /**
   * Control open / close state of the Dropdown component
   *
   * This can be used to close the dropdown when button in the footer of dropdown is clicked
   */
  isOpen?: boolean;
  /**
   * Callback when open state of the dropdown changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
  /**
   * @private
   *
   * width prop for outer relative container of Dropdown. Use width prop on DropdownOverlay to change width of menu
   */
  _width?: BoxProps['width'];
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type DropdownOverlayProps = {
  children: React.ReactElement[] | React.ReactElement;
  /**
   * Sets the z-index of the DropdownOverlay
   *
   * @default 1001
   */
  zIndex?: number;
  /**
   * Override the default width of dropdown
   *
   * Avoid overriding width in SelectInput and AutoComplete as its expected to match the input
   */
  width?: BoxProps['width'];

  /**
   * Override the default minWidth of dropdown
   *
   * Avoid overriding minWidth in SelectInput and AutoComplete as its expected to match the input
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * Override the default maxWidth of dropdown
   *
   * Avoid overriding maxWidth in SelectInput and AutoComplete as its expected to match the input
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * Reference to the element which triggers the DropdownOverlay
   *
   * This is used to position the DropdownOverlay relative to a specific element,
   * for example in PhoneNumberInput the DropdownOverlay is positioned relative to the input element
   */
  referenceRef?: React.MutableRefObject<ContainerElementType | null>;
  /**
   * Sets the placement of the DropdownOverlay
   *
   * @default 'bottom-start'
   */
  defaultPlacement?: Placement;
  /**
   * Nested Dropdown Overlay (Input Search Dropdown)
   * @default false
   * @private
   */
  _isNestedDropdown?: boolean;
} & TestID;

type FilterChipGroupProps = TestID &
  DataAnalyticsAttribute & {
    children: React.ReactNode;
    /**
     * Callback which is called when clear button is clicked
     */
    onClearButtonClick?: () => void;
    /**
     * Controls the group-level action link (the "Clear Filters" / "Reset" link rendered by the
     * group), NOT the per-chip clear (cross) button. When `true`, the link is shown whenever the
     * group has at least one selected filter.
     *
     * Note: this is distinct from `showClearButton` on `FilterChipSelectInput` /
     * `FilterChipDatePicker`, which toggles the individual chip's cross button.
     *
     * @default true
     */
    showClearButton?: boolean;
    /**
     * Custom text for the group's action button (e.g. `"Reset"`).
     *
     * When not provided (`undefined`) the label is derived from `clearButtonBehavior`:
     * - `"clear"` → auto-pluralised `"Clear Filter"` / `"Clear Filters"`.
     * - `"reset"` → `"Reset"`.
     *
     * Note: because of this conditional default, switching `clearButtonBehavior` while leaving
     * `clearButtonText` unset will change the button label. Pass `clearButtonText` explicitly to
     * pin the label regardless of behaviour.
     *
     * @default undefined (derived from `clearButtonBehavior`)
     */
    clearButtonText?: string;
    /**
     * Controls what happens when the group's action button is clicked. (This refers to the
     * button's behaviour regardless of its label — a button labelled "Reset" via `clearButtonText`
     * still uses this prop.)
     *
     * - `"clear"` (default): empties every filter and resets the group to a no-filter state.
     * - `"reset"`: fires `onClearButtonClick` and clears the group's "has changes" bookkeeping,
     *   but **does NOT clear the child filter chips**. The chips keep their current values.
     *   This delegates the responsibility of restoring defaults to the consumer's
     *   `onClearButtonClick` handler — the component does not reset itself.
     *
     *   ⚠️ In `"reset"` mode, **uncontrolled** chips (no `value` prop) will visually retain their
     *   selected values because there is no `defaultValue` for the group to restore. Only
     *   controlled chips can be reliably restored today (by resetting `value` in
     *   `onClearButtonClick`). Restoring defaults for uncontrolled filters is Phase 2 — see
     *   `_decisions/filter-chip-reset.md`.
     *
     *   Contract note: on action the group always clears its own selected-filter bookkeeping (so
     *   the action button hides after use — a lingering "Reset" with nothing to revert is
     *   confusing). This means that if the consumer's `onClearButtonClick` does not restore every
     *   chip's default, the group's tracked count can momentarily read empty while a chip still
     *   shows a value. This is an intentional trade-off in favour of hiding the used-up button;
     *   the count re-syncs on the next filter change.
     *
     * @default "clear"
     */
    clearButtonBehavior?: 'clear' | 'reset';
  };

type FilterChipGroupContextType = {
  /**
   *  Number of Selected Filters
   */
  filterChipGroupSelectedFilters: string[];
  setFilterChipGroupSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilterCallbackTriggerer: number;
  setClearFilterCallbackTriggerer: React.Dispatch<React.SetStateAction<number>>;
};
export type {
  DropdownProps,
  DropdownOverlayProps,
  FilterChipGroupProps,
  FilterChipGroupContextType,
};
