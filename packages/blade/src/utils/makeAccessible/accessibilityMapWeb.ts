import type { AccessibilityMap } from './types';

export const accessibilityValue = {
  valueMax: 'aria-valuemax',
  valueMin: 'aria-valuemin',
  valueNow: 'aria-valuenow',
  valueText: 'aria-valuetext',
};

export const accessibilityState = {
  selected: 'aria-selected',
  disabled: 'aria-disabled',
  expanded: 'aria-expanded',
  busy: 'aria-busy',
  checked: 'aria-checked',
};

// TODO:
// accessibilityViewIsModal
export const accessibilityMap: AccessibilityMap = {
  ...accessibilityState,
  ...accessibilityValue,
  activeDescendant: 'aria-activedescendant',
  atomic: 'aria-atomic',
  autoComplete: 'aria-autocomplete',
  colCount: 'aria-colcount',
  colIndex: 'aria-colindex',
  colSpan: 'aria-colspan',
  controls: 'aria-controls',
  describedBy: 'aria-describedby',
  details: 'aria-details',
  errorMessage: 'aria-errormessage',
  flowTo: 'aria-flowto',
  hasPopup: 'aria-haspopup',
  hidden: 'aria-hidden',
  invalid: 'aria-invalid',
  keyShortcuts: 'aria-keyshortcuts',
  label: 'aria-label',
  labelledBy: 'aria-labelledby',
  liveRegion: 'aria-live',
  modal: 'aria-modal',
  multiline: 'aria-multiline',
  multiSelectable: 'aria-multiselectable',
  orientation: 'aria-orientation',
  owns: 'aria-owns',
  placeholder: 'aria-placeholder',
  posInSet: 'aria-posinset',
  pressed: 'aria-pressed',
  readOnly: 'aria-readonly',
  required: 'aria-required',
  role: 'role',
  roleDescription: 'aria-roledescription',
  rowCount: 'aria-rowcount',
  rowIndex: 'aria-rowindex',
  rowSpan: 'aria-rowspan',
  setSize: 'aria-setsize',
  sort: 'aria-sort',
  current: 'aria-current',
  dropEffect: 'aria-dropeffect',
  grabbed: 'aria-grabbed',
  level: 'aria-level',
  relevant: 'aria-relevant',
};
