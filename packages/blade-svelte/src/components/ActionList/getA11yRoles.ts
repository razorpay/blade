/**
 * Accessibility roles for the ActionList family. React's `getA11yRoles.ts`
 * switches between `menu`/`listbox`/`dialog` based on the Dropdown trigger; that
 * coupling is stripped here. This scope is single-select, BottomSheet-mode only,
 * so it emits list/option roles exclusively.
 */

/** Container role — always `listbox` (no Dropdown/footer/menu branches). */
export function getActionListContainerRole(): 'listbox' {
  return 'listbox';
}

/** Row role — `link` when the item navigates (`href`), else `option`. */
export function getActionListItemRole(href?: string): 'link' | 'option' {
  return href ? 'link' : 'option';
}

/** Section wrapper role — `group` (announces the section title as its label). */
export function getActionListSectionRole(): 'group' {
  return 'group';
}
