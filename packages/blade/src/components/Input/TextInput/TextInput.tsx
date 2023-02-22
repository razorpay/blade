import React, { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { CloseIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import type { StyledProps } from '~utils';
import { getPlatformType, isEmpty } from '~utils';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';

// Users should use PasswordInput for input type password
type Type = Exclude<BaseInputProps['type'], 'password'>;

type TextInputProps = Pick<
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
  | 'onFocus'
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

  /**
   * Type of Input Field to be rendered. Use `PasswordInput` for type `password`
   *
   * @default text
   */
  type?: Type;
} & StyledProps;

type TextInputKeyboardAndAutoComplete = Pick<
  BaseInputProps,
  'keyboardType' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType'
> & {
  type: Type;
};

const getKeyboardAndAutocompleteProps = ({
  type = 'text',
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
}: TextInputKeyboardAndAutoComplete): TextInputKeyboardAndAutoComplete => {
  const keyboardAndAutocompleteProps: TextInputKeyboardAndAutoComplete = {
    type,
    keyboardType: 'text',
    keyboardReturnKeyType: 'default',
    autoCompleteSuggestionType: 'none',
  };

  const keyboardConfigMap = {
    text: {
      keyboardType: 'text',
      keyboardReturnKeyType: 'default',
      autoCompleteSuggestionType: 'none',
    },
    telephone: {
      keyboardType: 'telephone',
      keyboardReturnKeyType: 'done',
      autoCompleteSuggestionType: 'telephone',
    },
    email: {
      keyboardType: 'email',
      keyboardReturnKeyType: 'done',
      autoCompleteSuggestionType: 'email',
    },
    url: {
      keyboardType: 'url',
      keyboardReturnKeyType: 'go',
      autoCompleteSuggestionType: 'none',
    },
    number: {
      keyboardType: 'decimal',
      keyboardReturnKeyType: 'done',
      autoCompleteSuggestionType: 'none',
    },
    search: {
      keyboardType: 'search',
      keyboardReturnKeyType: 'search',
      autoCompleteSuggestionType: 'none',
    },
  } as const;

  const keyboardConfig = keyboardConfigMap[type];

  keyboardAndAutocompleteProps.keyboardType = keyboardConfig.keyboardType;

  keyboardAndAutocompleteProps.keyboardReturnKeyType =
    keyboardReturnKeyType ?? keyboardConfig.keyboardReturnKeyType;

  keyboardAndAutocompleteProps.autoCompleteSuggestionType =
    autoCompleteSuggestionType ?? keyboardConfig.autoCompleteSuggestionType;

  if (type === 'number') {
    /* the default keyboardType:numeric shows alphanumeric keyboard on iOS but number pad on android. making it type:text and keyboardType:decimal fixes this on all platforms.
     * source: https://css-tricks.com/everything-you-ever-wanted-to-know-about-keyboardType/#aa-decimal
     */
    keyboardAndAutocompleteProps.type = 'text';
  }

  if (type === 'search') {
    /* when input type:search is provided at that time browser adds a weird close button which collides with our clear button and then we have 2 clear buttons
     * source: https://github.com/razorpay/blade/issues/857#issue-1457367160
     */
    keyboardAndAutocompleteProps.type = 'text';
  }

  return keyboardAndAutocompleteProps;
};

// need to do this to tell TS to infer type as TextInput of React Native and make it believe that `ref.current.clear()` exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isReactNative = (_textInputRef: any): _textInputRef is TextInputReactNative => {
  return getPlatformType() === 'react-native';
};

const _TextInput: React.ForwardRefRenderFunction<BladeElementRef, TextInputProps> = (
  {
    label,
    labelPosition = 'top',
    placeholder,
    type = 'text',
    defaultValue,
    name,
    value,
    maxCharacters,
    onChange,
    onFocus,
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
    ...styledProps
  },
  ref,
): ReactElement => {
  const textInputRef = useBladeInnerRef(ref);
  const [shouldShowClearButton, setShouldShowClearButton] = useState(false);

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(showClearButton && (defaultValue ?? value)));
  }, [showClearButton, defaultValue, value]);

  const renderInteractionElement = (): ReactNode => {
    if (isLoading) {
      return <Spinner accessibilityLabel="Loading Content" />;
    }

    if (shouldShowClearButton) {
      return (
        <IconButton
          size="medium"
          icon={CloseIcon}
          onClick={() => {
            if (isEmpty(value) && textInputRef.current) {
              // when the input field is uncontrolled take the ref and clear the input and then call the onClearButtonClick function
              if (isReactNative(textInputRef.current)) {
                textInputRef.current.clear();
                textInputRef.current.focus();
              } else if (textInputRef.current instanceof HTMLInputElement) {
                textInputRef.current.value = '';
                textInputRef.current.focus();
              }
            }
            // if the input field is controlled just call the click handler and the value change shall be left upto the consumer
            onClearButtonClick?.();
            textInputRef?.current?.focus();
            setShouldShowClearButton(false);
          }}
          accessibilityLabel="Clear Input Content"
        />
      );
    }

    return null;
  };

  return (
    <BaseInput
      {...styledProps}
      id="textinput"
      componentName="textinput"
      ref={textInputRef as React.Ref<HTMLInputElement>}
      label={label}
      labelPosition={labelPosition}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      name={name}
      maxCharacters={maxCharacters}
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
      onFocus={onFocus}
      onBlur={onBlur}
      isDisabled={isDisabled}
      necessityIndicator={necessityIndicator}
      isRequired={isRequired}
      leadingIcon={icon}
      prefix={prefix}
      interactionElement={renderInteractionElement()}
      suffix={suffix}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      trailingFooterSlot={(value) => {
        return maxCharacters ? (
          <BaseBox marginTop="spacing.2" marginRight="spacing.1">
            <CharacterCounter currentCount={value?.length ?? 0} maxCount={maxCharacters} />
          </BaseBox>
        ) : null;
      }}
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

const TextInput = React.forwardRef(_TextInput);
TextInput.displayName = 'TextInput';

export { TextInput, TextInputProps };
