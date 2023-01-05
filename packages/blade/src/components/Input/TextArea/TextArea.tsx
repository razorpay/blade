/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import { CloseIcon } from '../../Icons';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { IconButton } from '~components/Button/IconButton';
import Box from '~components/Box';
import { getPlatformType, isEmpty } from '~utils';
import { CharacterCounter } from '~components/Form/CharacterCounter';

type TextAreaProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'placeholder'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onBlur'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'maxCharacters'
  | 'autoFocus'
  | 'numberOfLines'
> & {
  /**
   * Decides whether to render a clear icon button
   */
  showClearButton?: boolean;
  /**
   * Event handler to handle the onClick event for clear button.
   */
  onClearButtonClick?: () => void;
};

// need to do this to tell TS to infer type as TextInput of React Native and make it believe that `ref.current.clear()` exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isReactNative = (_textInputRef: any): _textInputRef is TextInputReactNative => {
  return getPlatformType() === 'react-native';
};

const TextArea = ({
  label,
  labelPosition,
  necessityIndicator,
  errorText,
  helpText,
  successText,
  validationState,
  defaultValue,
  isDisabled,
  isRequired,
  name,
  onBlur,
  onChange,
  placeholder,
  value,
  maxCharacters,
  showClearButton,
  onClearButtonClick,
  autoFocus,
  numberOfLines = 2,
}: TextAreaProps): React.ReactElement => {
  const inputRef = React.useRef<HTMLInputElement | TextInputReactNative>(null);

  const [shouldShowClearButton, setShouldShowClearButton] = React.useState(false);

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(showClearButton && (value?.length || defaultValue?.length)));
  }, [showClearButton, defaultValue, value]);

  const renderInteractionElement = (): React.ReactNode => {
    if (shouldShowClearButton) {
      return (
        <Box paddingTop="spacing.3" marginTop="spacing.1">
          <IconButton
            icon={CloseIcon}
            accessibilityLabel="Clear textarea content"
            onClick={() => {
              if (isEmpty(value) && inputRef.current) {
                // when the input field is uncontrolled take the ref and clear the input and then call the onClearButtonClick function
                if (isReactNative(inputRef.current)) {
                  inputRef.current.clear();
                  inputRef.current.focus();
                } else if (inputRef.current instanceof HTMLTextAreaElement) {
                  inputRef.current.value = '';
                  inputRef.current.focus();
                }
              }
              // if the input field is controlled just call the click handler and the value change shall be left upto the consumer
              onClearButtonClick?.();
              inputRef?.current?.focus();
              setShouldShowClearButton(false);
            }}
          />
        </Box>
      );
    }

    return null;
  };

  return (
    <BaseInput
      as="textarea"
      id="textarea"
      componentName="textarea"
      autoFocus={autoFocus}
      ref={inputRef as React.Ref<HTMLInputElement>}
      label={label}
      labelPosition={labelPosition}
      necessityIndicator={necessityIndicator}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      validationState={validationState}
      isDisabled={isDisabled}
      isRequired={isRequired}
      name={name}
      maxCharacters={maxCharacters}
      onBlur={onBlur}
      placeholder={placeholder}
      interactionElement={renderInteractionElement()}
      defaultValue={defaultValue}
      value={value}
      numberOfLines={numberOfLines}
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
      trailingFooterSlot={(value) => {
        return maxCharacters ? (
          <Box marginTop="spacing.2" marginRight="spacing.1">
            <CharacterCounter currentCount={value?.length ?? 0} maxCount={maxCharacters} />
          </Box>
        ) : null;
      }}
    />
  );
};

export { TextArea, TextAreaProps };
