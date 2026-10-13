/**
 * What a checkable control's snippets (its label, `leading`, `trailing`)
 * receive: Chip, Radio, Checkbox, Switch, SegmentedControlItem.
 */
export interface ControlState {
  isChecked: boolean;
  isDisabled: boolean;
}
