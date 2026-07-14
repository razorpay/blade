import type { OptionsType } from './useDropdown';

type GetTitleFromValueFn = (value: string) => string;
type GetUnControlledFilterChipValueFn = () => string | string[];

/**
 * Shared helper: resolves the title for a given option value.
 * Returns an empty string when the option is not found.
 */
export const makeGetTitleFromValue = (options: OptionsType): GetTitleFromValueFn => {
  return (value: string): string => {
    const option = options.find((option) => option.value === value);
    return option ? option.title : '';
  };
};

/**
 * Shared helper: builds the display value that `BaseFilterChip` renders.
 *
 * - For **uncontrolled** chips it delegates to `getUnControlledFilterChipValue`.
 * - For **controlled** chips it maps the consumer-supplied value(s) to option titles,
 *   falling back to the raw value via `??` (so an empty-string title is preserved).
 */
export const makeGetFilterChipDisplayValue = (
  propsValue: string | string[] | undefined,
  getUnControlledFilterChipValue: GetUnControlledFilterChipValueFn,
  getTitleFromValue: GetTitleFromValueFn,
): string | string[] => {
  if (propsValue === undefined) {
    return getUnControlledFilterChipValue();
  }
  if (Array.isArray(propsValue)) {
    return propsValue.map((selectionValue) => getTitleFromValue(selectionValue) ?? selectionValue);
  }
  return getTitleFromValue(propsValue) ?? propsValue;
};
