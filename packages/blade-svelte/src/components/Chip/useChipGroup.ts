import type { ChipGroupProps, State } from './types';

export type UseChipGroupProps = Pick<
  ChipGroupProps,
  | 'isDisabled'
  | 'isRequired'
  | 'necessityIndicator'
  | 'validationState'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'size'
  | 'color'
  | 'selectionType'
>;

let idCounter = 0;

/**
 * Generate a unique ID for a chip group instance.
 */
export function generateChipGroupId(): string {
  return `chip-group-${++idCounter}`;
}

/**
 * Normalize a value prop (string or string[]) to an array for internal state management.
 */
export function normalizeValue(
  val: string | string[] | undefined,
  selectionType: 'single' | 'multiple',
): string[] | undefined {
  if (val === undefined) return undefined;
  if (selectionType === 'single' && typeof val === 'string') return [val];
  if (Array.isArray(val)) return val;
  return [val as string];
}

/**
 * Create a State object from checked values and group config.
 * This is a pure function — the actual reactive state lives in ChipGroup.svelte.
 */
export function createChipGroupState({
  checkedValues,
  selectionType,
  isDisabled,
  onSetValues,
}: {
  checkedValues: string[];
  selectionType: 'single' | 'multiple';
  isDisabled: boolean;
  onSetValues: (newValues: string[]) => void;
}): State {
  return {
    value: checkedValues,
    isChecked(val: string): boolean {
      if (selectionType === 'single') {
        if (val === undefined || checkedValues === undefined) return false;
        return checkedValues[0] === val;
      }
      return checkedValues.includes(val);
    },
    addValue(val: string) {
      if (isDisabled) return;
      if (selectionType === 'single') {
        onSetValues([val]);
      }
      if (selectionType === 'multiple' && !checkedValues.includes(val)) {
        onSetValues(checkedValues.concat(val));
      }
    },
    removeValue(val: string) {
      if (isDisabled) return;
      if (selectionType === 'single') {
        onSetValues([]);
      }
      if (selectionType === 'multiple' && checkedValues.includes(val)) {
        onSetValues(checkedValues.filter((existing) => existing !== val));
      }
    },
  };
}
