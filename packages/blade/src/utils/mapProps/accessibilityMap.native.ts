import type { CommonAccessibilityProps } from './types';

export const accessibilityValue = {
  accessibilityValueMax: 'max',
  accessibilityValueMin: 'min',
  accessibilityValueNow: 'now',
  accessibilityValueText: 'text',
};

export const accessibilityState = {
  accessibilitySelected: 'selected',
  accessibilityDisabled: 'disabled',
  accessibilityExpanded: 'expanded',
  accessibilityBusy: 'busy',
  accessibilityChecked: 'checked',
};

export const accessibilityValueKeys = Object.keys(accessibilityValue);
export const accessibilityStateKeys = Object.keys(accessibilityState);

// TODO:
// importantForAccessibility
// accessibilityElementsHidden
// accessibilityViewIsModal
export const accessibilityMap: AccessibilityMap = {
  ...accessibilityState,
  ...accessibilityValue,
  accessibilityActiveDescendant: 'accessibilityActiveDescendant',
  accessibilityAtomic: 'accessibilityAtomic',
  accessibilityAutoComplete: 'accessibilityAutoComplete',
  accessibilityColCount: 'accessibilityColCount',
  accessibilityColIndex: 'accessibilityColIndex',
  accessibilityColSpan: 'accessibilityColSpan',
  accessibilityControls: 'accessibilityControls',
  accessibilityDescribedBy: 'accessibilityDescribedBy',
  accessibilityDetails: 'accessibilityDetails',
  accessibilityErrorMessage: 'accessibilityErrorMessage',
  accessibilityFlowTo: 'accessibilityFlowTo',
  accessibilityHasPopup: 'accessibilityHasPopup',
  accessibilityHidden: 'accessibilityHidden',
  accessibilityInvalid: 'accessibilityInvalid',
  accessibilityKeyShortcuts: 'accessibilityKeyShortcuts',
  accessibilityLabel: 'accessibilityLabel',
  accessibilityLabelledBy: 'accessibilityLabelledBy',
  accessibilityLiveRegion: 'accessibilityLiveRegion',
  accessibilityModal: 'accessibilityModal',
  accessibilityMultiline: 'accessibilityMultiline',
  accessibilityMultiSelectable: 'accessibilityMultiSelectable',
  accessibilityOrientation: 'accessibilityOrientation',
  accessibilityOwns: 'accessibilityOwns',
  accessibilityPlaceholder: 'accessibilityPlaceholder',
  accessibilityPosInSet: 'accessibilityPosInSet',
  accessibilityPressed: 'accessibilityPressed',
  accessibilityReadOnly: 'accessibilityReadOnly',
  accessibilityRequired: 'accessibilityRequired',
  accessibilityRole: 'accessibilityRole',
  accessibilityRoleDescription: 'accessibilityRoleDescription',
  accessibilityRowCount: 'accessibilityRowCount',
  accessibilityRowIndex: 'accessibilityRowIndex',
  accessibilityRowSpan: 'accessibilityRowSpan',
  accessibilitySetSize: 'accessibilitySetSize',
  accessibilitySort: 'accessibilitySort',
  accessibilityCurrent: 'accessibilityCurrent',
  accessibilityDropEffect: 'accessibilityDropEffect',
  accessibilityGrabbed: 'accessibilityGrabbed',
  accessibilityLevel: 'accessibilityLevel',
  accessibilityRelevant: 'accessibilityRelevant',
};

export const supportedAccessibilityRoles = [
  'adjustable',
  'alert',
  'button',
  'checkbox',
  'combobox',
  'header',
  'image',
  'imagebutton',
  'keyboardkey',
  'link',
  'menu',
  'menubar',
  'menuitem',
  'none',
  'progressbar',
  'radio',
  'radiogroup',
  'scrollbar',
  'search',
  'spinbutton',
  'summary',
  'switch',
  'tab',
  'tablist',
  'text',
  'timer',
  'togglebutton',
  'toolbar',
];

export type AccessibilityMap = Record<keyof CommonAccessibilityProps, string>;
export type AccessibilityProps = CommonAccessibilityProps;
