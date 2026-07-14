import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import type { AccessibilityProps } from '~utils/makeAccessible';

type BaseFilterChipProps = {
  /**
   * Controlled value of FilterChip.
   *
   * FilterChip is always a controlled component since selected state of it comes from other components like Menu, Dropdown.
   */
  value?: string | string[];

  /**
   * Change handler when FilterChip's value is cleared
   */
  onClearButtonClick?: ({ value }: { value: string | string[] }) => void;

  /**
   * Whether to render the clear (cross) button when the chip has a selected value.
   *
   * Set to `false` for filters that should always hold a value (e.g. a date filter
   * with a mandatory default) so users can't clear it to an empty state.
   *
   * **Controlled / uncontrolled clearing contract:**
   * When the clear button is clicked, `onClearButtonClick` fires. If the parent
   * controls `value` (passes it explicitly), the chip cannot clear itself — the
   * parent must reset `value` in response to `onClearButtonClick`. In the uncontrolled
   * case, the chip clears itself automatically.
   *
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Children. Title of the Chip
   */
  label: string;

  /**
   * Disabled state for Chip
   */
  isDisabled?: boolean;

  /**
   * Type of selection.
   *
   * When set to multiple, length of selections is rendered inside counter
   *
   * When using inside Dropdown, this prop is internally taken from Dropdown.
   */
  selectionType?: 'single' | 'multiple';

  id?: string;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  onClick?: (e: React.MouseEventHandler) => void;
  onBlur?: (e: React.FocusEventHandler) => void;
  accessibilityProps?: Partial<AccessibilityProps>;
} & TestID &
  DataAnalyticsAttribute;

export type { BaseFilterChipProps };
