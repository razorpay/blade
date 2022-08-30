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
 * - add icon prop - done
 * - manage the state for clear button
 * - implement maxCharacters
 *
 */

import React, { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { BaseInput } from '~components/Input/BaseInput';
import type { IconComponent } from '~components/Icons';
import { InfoIcon, CloseIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import { isEmpty } from '~utils';

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
  /**
   * Decides whether to render a clear icon button
   */
  showClearButton?: boolean;
  /**
   * Event handler to handle the onClick event for clear button.
   */
  onClearButtonClick?: () => void;
  /**
   * Decides whether to show a loading spinner for the input field.
   */
  isLoading?: boolean;
  /**
   * Icon that will be rendered at the beginning of the input field
   */
  icon?: IconComponent;
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
  icon,
  prefix,
  showClearButton,
  onClearButtonClick,
  isLoading,
  suffix,
  autoFocus,
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
}: TextInputProps): ReactElement => {
  const textInputRef = React.useRef<HTMLInputElement>(null);
  const [shouldShowClearButton, setShouldShowClearButton] = useState(false);

  const renderInteractionElement = (): ReactNode => {
    if (isLoading) {
      return <InfoIcon size="medium" color="surface.text.subtle.lowContrast" />;
    }

    if (shouldShowClearButton) {
      return (
        <IconButton
          size="medium"
          icon={CloseIcon}
          onClick={() => {
            if (isEmpty(value) && textInputRef.current) {
              // when the input field is uncontrolled take the ref and clear the input and then call the onClearButtonClick function
              textInputRef.current.value = '';
            }
            // if the input field is controlled just call the click handler and the value change shall be left upto the consumer
            onClearButtonClick?.();
          }}
          accessibilityLabel="Clear Input Content"
        />
      );
    }

    return null;
  };

  return (
    <BaseInput
      id="textinput"
      ref={textInputRef}
      label={label}
      labelPosition={labelPosition}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      name={name}
      onChange={({ name, value }) => {
        if (showClearButton && value?.length) {
          // show the clear button when the user starts typing in
          setShouldShowClearButton(true);
        }

        if (shouldShowClearButton && !value?.length) {
          // hide the clear button when the input field is empty
          setShouldShowClearButton(false);
        }

        onChange?.({ name, value });
      }}
      onBlur={onBlur}
      isDisabled={isDisabled}
      necessityIndicator={necessityIndicator}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      isRequired={isRequired}
      leadingIcon={icon}
      prefix={prefix}
      interactionElement={renderInteractionElement()}
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
