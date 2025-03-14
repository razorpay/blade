import type { StyledPropsBlade } from '~components/Box/styledProps';

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
} & StyledPropsBlade;

export type { BaseFilterChipProps };
