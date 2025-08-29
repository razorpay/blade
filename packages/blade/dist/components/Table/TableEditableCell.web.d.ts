import { TableEditableCellProps, TableEditableDropdownCellProps } from './types';
declare const TableEditableDropdownCell: (dropdownProps: TableEditableDropdownCellProps) => React.ReactElement;
declare const TableEditableCell: ({ validationState, accessibilityLabel, autoCapitalize, autoCompleteSuggestionType, autoFocus, defaultValue, isDisabled, isRequired, keyboardReturnKeyType, leadingIcon, maxCharacters, name, onBlur, onChange, onClick, onFocus, onSubmit, placeholder, prefix, suffix, value, testID, trailingButton, errorText, successText, inputType, }: TableEditableCellProps) => React.ReactElement;
export { TableEditableCell, TableEditableDropdownCell };
