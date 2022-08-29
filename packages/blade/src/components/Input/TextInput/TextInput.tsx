/**
 * @props
 * type
 * label
 * labelposition
 * placeholder
 * value
 * defaultValue
 * name
 * onchange
 * onblur
 * isDisabled
 * isRequired
 * necessityIndicator
 * showClearButton -> interactionElement
 * onClearButtonClickedx
 * icon -> leftIcon
 * prefix
 * suffix
 * isLoading -> interactionElement
 * maxcharacters
 * validationState
 * helpText
 * errorText
 * successText
 * autoFocus
 * autoFillSuggestionType -> if not provided fallback to default map above
 * keyboradreturnkeytype -> if not provided fallback to default map above
 *
 * @todo
 * - create a map of type to keyboard and autosuggestion props and keyboardType - done
 * - manage the state for clear button
 * - implement maxCharacters
 *
 */

import type { ReactElement } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';

export type TextInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'placeholder'
  | 'type'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onBlur'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'maxCharacters'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
> & {
  icon?: boolean;
  showClearButton?: boolean;
  onClearButtonClick?: boolean;
  isLoading?: boolean;
};

type TextInputKeyboardAndAutoComplete = Pick<
  BaseInputProps,
  'type' | 'keyboardType' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType'
>;

const getKeyboardAndAutocompleteProps = ({
  type,
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
}: TextInputKeyboardAndAutoComplete): TextInputKeyboardAndAutoComplete => {
  const keyboardAndAutocompleteProps: TextInputKeyboardAndAutoComplete = {
    type,
    keyboardType: 'text',
    keyboardReturnKeyType: 'default',
    autoCompleteSuggestionType: 'none',
  };

  if (type === 'text') {
    keyboardAndAutocompleteProps.keyboardType = 'text';
    keyboardAndAutocompleteProps.keyboardReturnKeyType = keyboardReturnKeyType ?? 'default';
    keyboardAndAutocompleteProps.autoCompleteSuggestionType = autoCompleteSuggestionType ?? 'none';
  } else if (type === 'telephone') {
    keyboardAndAutocompleteProps.keyboardType = 'telephone';
    keyboardAndAutocompleteProps.keyboardReturnKeyType = keyboardReturnKeyType ?? 'done';
    keyboardAndAutocompleteProps.autoCompleteSuggestionType =
      autoCompleteSuggestionType ?? 'telephone';
  } else if (type === 'email') {
    keyboardAndAutocompleteProps.keyboardType = 'email';
    keyboardAndAutocompleteProps.keyboardReturnKeyType = keyboardReturnKeyType ?? 'done';
    keyboardAndAutocompleteProps.autoCompleteSuggestionType = autoCompleteSuggestionType ?? 'email';
  } else if (type === 'url') {
    keyboardAndAutocompleteProps.keyboardType = 'url';
    keyboardAndAutocompleteProps.keyboardReturnKeyType = keyboardReturnKeyType ?? 'go';
    keyboardAndAutocompleteProps.autoCompleteSuggestionType = autoCompleteSuggestionType ?? 'none';
  } else if (type === 'numeric') {
    keyboardAndAutocompleteProps.type = 'text';
    /* the default keyboardType:numeric shows alphanumeric keyboard on iOS but number pad on android. making it type:text and keyboardType:decimal fixes this on all platforms.
     * source: https://css-tricks.com/everything-you-ever-wanted-to-know-about-keyboardType/#aa-decimal
     */
    keyboardAndAutocompleteProps.keyboardType = 'decimal';
    keyboardAndAutocompleteProps.keyboardReturnKeyType = keyboardReturnKeyType ?? 'done';
    keyboardAndAutocompleteProps.autoCompleteSuggestionType = autoCompleteSuggestionType ?? 'none';
  } else if (type === 'search') {
    keyboardAndAutocompleteProps.keyboardType = 'search';
    keyboardAndAutocompleteProps.keyboardReturnKeyType = keyboardReturnKeyType ?? 'search';
    keyboardAndAutocompleteProps.autoCompleteSuggestionType = autoCompleteSuggestionType ?? 'none';
  }

  return keyboardAndAutocompleteProps;
};

export const TextInput = ({
  label,
  labelPosition = 'top',
  placeholder,
  type = 'text',
  defaultValue,
  name,
  value,
  onChange,
  onBlur,
  isDisabled,
  necessityIndicator,
  validationState,
  errorText,
  helpText,
  successText,
  isRequired,
  // icon,
  prefix,
  // showClearButton,
  // onClearButtonClick,
  // isLoading,
  suffix,
  autoFocus,
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
}: TextInputProps): ReactElement => {
  return (
    <BaseInput
      id="textinput"
      label={label}
      labelPosition={labelPosition}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      isDisabled={isDisabled}
      necessityIndicator={necessityIndicator}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      isRequired={isRequired}
      // leadingIcon={icon}
      prefix={prefix}
      // showClearButton={showClearButton}
      // onClearButtonClick={onClearButtonClick}
      // isLoading={isLoading}
      suffix={suffix}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      {...getKeyboardAndAutocompleteProps({
        type,
        keyboardReturnKeyType,
        autoCompleteSuggestionType,
      })}
    />
  );
};
