import type { OptionsType } from './useDropdown';
import type { BaseFilterChipProps } from '~components/FilterChip/types';

/**
 * Resolves an option's human-readable title from its value. Returns an empty string when the
 * option isn't found so callers can decide on a fallback.
 */
const getTitleFromValue = (options: OptionsType, value: string): string => {
  const option = options.find((currentOption) => currentOption.value === value);
  return option ? option.title : '';
};

type GetFilterChipDisplayValueParams = {
  /** Controlled value from props (option value or values). `undefined` when uncontrolled. */
  value: BaseFilterChipProps['value'];
  /** All options currently registered in the dropdown. */
  options: OptionsType;
  selectionType: BaseFilterChipProps['selectionType'];
  /** Internally tracked selection used in the uncontrolled case. */
  uncontrolledInputValue: string[];
  /**
   * Published by TreeView (D5): smallest describing set of the current selection where a
   * fully-selected branch counts as 1. Absent for every other overlay content
   */
  displayOverride?: { label: string; count: number };
};

/**
 * Resolves the value shown inside the filter chip as option title(s).
 *
 * Shared by the web and native `FilterChipSelectInput` implementations to keep the (non-trivial)
 * controlled-vs-uncontrolled / string-vs-array branching in a single source of truth. In every
 * branch we fall back to the raw value when the title can't be resolved (e.g. options loaded or
 * changed after a selection) so the chip never renders an empty string.
 */
const getFilterChipDisplayValue = ({
  value,
  options,
  selectionType,
  uncontrolledInputValue,
  displayOverride,
}: GetFilterChipDisplayValueParams): string | string[] => {
  const titleForValue = (selectionValue: string): string =>
    getTitleFromValue(options, selectionValue) || selectionValue;

  if (displayOverride) {
    if (selectionType === 'single') {
      return displayOverride.label;
    }
    // BaseFilterChip renders the single name at length 1 and a Counter of the array
    // length at 2+, so we synthesize an array of the override's count (only the first
    // entry is ever rendered as text)
    return Array.from({ length: displayOverride.count }, (_, index) =>
      index === 0 ? displayOverride.label : '',
    );
  }

  // Uncontrolled: derive display value from the internally tracked selection.
  if (value === undefined) {
    if (selectionType === 'single') {
      return uncontrolledInputValue.length > 0 ? titleForValue(uncontrolledInputValue[0]) : '';
    }
    // For multiple selection, hand the chip the option titles (not the raw values) so it can
    // render the selected option name(s) instead of a bare count.
    return uncontrolledInputValue.map(titleForValue);
  }

  // Controlled: consumer passes option value(s); map them to titles for display.
  if (Array.isArray(value)) {
    return value.map(titleForValue);
  }
  return titleForValue(value);
};

export { getFilterChipDisplayValue };
