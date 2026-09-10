/**
 * Component id constants for the Dropdown family. Only the in-scope surfaces are
 * listed; out-of-scope triggers (SelectInput / AutoComplete / DropdownButton /
 * FilterChip* etc.) are intentionally omitted from this partial migration.
 */
export const dropdownComponentIds = {
  Dropdown: 'Dropdown',
  DropdownOverlay: 'DropdownOverlay',
  DropdownHeader: 'DropdownHeader',
  DropdownFooter: 'DropdownFooter',
  triggers: {
    InputDropdownButton: 'InputDropdownButton',
  },
} as const;

/**
 * Which element triggered the Dropdown. In this partial scope only
 * `InputDropdownButton` self-registers; menu triggers (Button/Link/IconButton)
 * leave this `undefined`, which the a11y-role helpers treat as a `menu`.
 */
export type DropdownTriggerer = 'InputDropdownButton' | undefined;
