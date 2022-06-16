import type { AccessibilityMap } from './makeAccessible.d';

export const accessibilityValue = {
  accessibilityValueMax: 'aria-valuemax',
  accessibilityValueMin: 'aria-valuemin',
  accessibilityValueNow: 'aria-valuenow',
  accessibilityValueText: 'aria-valuetext',
};

export const accessibilityState = {
  accessibilitySelected: 'aria-selected',
  accessibilityDisabled: 'aria-disabled',
  accessibilityExpanded: 'aria-expanded',
  accessibilityBusy: 'aria-busy',
  accessibilityChecked: 'aria-checked',
};

// TODO:
// importantForAccessibility
// accessibilityElementsHidden
// accessibilityViewIsModal
export const accessibilityMap: AccessibilityMap = {
  ...accessibilityState,
  ...accessibilityValue,
  accessibilityActiveDescendant: 'aria-activedescendant',
  accessibilityAtomic: 'aria-atomic',
  accessibilityAutoComplete: 'aria-autocomplete',
  accessibilityColCount: 'aria-colcount',
  accessibilityColIndex: 'aria-colindex',
  accessibilityColSpan: 'aria-colspan',
  accessibilityControls: 'aria-controls',
  accessibilityDescribedBy: 'aria-describedby',
  accessibilityDetails: 'aria-details',
  accessibilityErrorMessage: 'aria-errormessage',
  accessibilityFlowTo: 'aria-flowto',
  accessibilityHasPopup: 'aria-haspopup',
  accessibilityHidden: 'aria-hidden',
  accessibilityInvalid: 'aria-invalid',
  accessibilityKeyShortcuts: 'aria-keyshortcuts',
  accessibilityLabel: 'aria-label',
  accessibilityLabelledBy: 'aria-labelledby',
  accessibilityLiveRegion: 'aria-live',
  accessibilityModal: 'aria-modal',
  accessibilityMultiline: 'aria-multiline',
  accessibilityMultiSelectable: 'aria-multiselectable',
  accessibilityOrientation: 'aria-orientation',
  accessibilityOwns: 'aria-owns',
  accessibilityPlaceholder: 'aria-placeholder',
  accessibilityPosInSet: 'aria-posinset',
  accessibilityPressed: 'aria-pressed',
  accessibilityReadOnly: 'aria-readonly',
  accessibilityRequired: 'aria-required',
  accessibilityRole: 'role',
  accessibilityRoleDescription: 'aria-roledescription',
  accessibilityRowCount: 'aria-rowcount',
  accessibilityRowIndex: 'aria-rowindex',
  accessibilityRowSpan: 'aria-rowspan',
  accessibilitySetSize: 'aria-setsize',
  accessibilitySort: 'aria-sort',
  accessibilityCurrent: 'aria-current',
  accessibilityDropEffect: 'aria-dropeffect',
  accessibilityGrabbed: 'aria-grabbed',
  accessibilityLevel: 'aria-level',
  accessibilityRelevant: 'aria-relevant',
};
