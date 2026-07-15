import type { OptionsType } from './useDropdown';

type GetTitleFromValueFn = (value: string) => string | undefined;
type GetUnControlledFilterChipValueFn = () => string | string[];

/**
 * Shared helper: resolves the title for a given option value.
 * Returns `undefined` when the option is not found so that callers can
 * fall back to the raw value via `??`.
 */
export const makeGetTitleFromValue = (options: OptionsType): GetTitleFromValueFn => {
  return (value: string): string | undefined => {
    const option = options.find((option) => option.value === value);
    return option?.title;
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
