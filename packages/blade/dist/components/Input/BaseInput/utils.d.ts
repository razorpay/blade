import { BaseInputProps } from './BaseInput';
type Type = Exclude<BaseInputProps['type'], 'password'>;
type TextInputKeyboardAndAutoComplete = Pick<BaseInputProps, 'keyboardType' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType' | 'autoCapitalize'> & {
    type: Type;
};
declare const getKeyboardAndAutocompleteProps: ({ type, keyboardReturnKeyType, autoCompleteSuggestionType, autoCapitalize, }: TextInputKeyboardAndAutoComplete) => TextInputKeyboardAndAutoComplete;
export { getKeyboardAndAutocompleteProps };
