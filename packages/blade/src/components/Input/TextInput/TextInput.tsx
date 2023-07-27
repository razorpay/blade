import React, { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import type { ReactElement, ReactNode } from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { CloseIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { MetaConstants } from '~utils/metaAttribute';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import type { BladeElementRef } from '~utils/useBladeInnerRef';
import { useBladeInnerRef } from '~utils/useBladeInnerRef';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getPlatformType } from '~utils';

// Users should use PasswordInput for input type password
type Type = Exclude<BaseInputProps['type'], 'password'>;

type TextInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
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
  | 'onSubmit'
  | 'autoCapitalize'
  | 'testID'
> & {
  /**
   * Decides whether to render a clear icon button
   */
  showClearButton?: boolean;

  /**
   * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
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
   *
   * **Note on number type**
   *
   * `type="number"` internally uses `inputMode="numeric"` instead of HTML's `type="number"` which also allows text characters.
   * If you have a usecase where you only want to support number input, you can handle it on validations end.
   *
   * Check out [Why the GOV.UK Design System team changed the input type for numbers](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/) for reasoning
   *
   * @default text
   */
  type?: Type;
} & StyledPropsBlade;

type TextInputKeyboardAndAutoComplete = Pick<
  BaseInputProps,
  'keyboardType' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType' | 'autoCapitalize'
> & {
  type: Type;
};

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type TextInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type TextInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type TextInputProps = (TextInputPropsWithA11yLabel | TextInputPropsWithLabel) &
  TextInputCommonProps;

const getKeyboardAndAutocompleteProps = ({
  type = 'text',
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
  autoCapitalize,
}: TextInputKeyboardAndAutoComplete): TextInputKeyboardAndAutoComplete => {
  const keyboardAndAutocompleteProps: TextInputKeyboardAndAutoComplete = {
    type,
    keyboardType: 'text',
    keyboardReturnKeyType: 'default',
    autoCompleteSuggestionType: 'none',
    autoCapitalize,
  };

  const keyboardConfigMap = {
    text: {
      keyboardType: 'text',
      keyboardReturnKeyType: 'default',
      autoCompleteSuggestionType: 'none',
      autoCapitalize: undefined,
    },
    telephone: {
      keyboardType: 'telephone',
      keyboardReturnKeyType: 'done',
      autoCompleteSuggestionType: 'telephone',
      autoCapitalize: undefined,
    },
    email: {
      keyboardType: 'email',
      keyboardReturnKeyType: 'done',
      autoCompleteSuggestionType: 'email',
      autoCapitalize: 'none',
    },
    url: {
      keyboardType: 'url',
      keyboardReturnKeyType: 'go',
      autoCompleteSuggestionType: 'none',
      autoCapitalize: 'none',
    },
    number: {
      keyboardType: 'decimal',
      keyboardReturnKeyType: 'done',
      autoCompleteSuggestionType: 'none',
      autoCapitalize: undefined,
    },
    search: {
      keyboardType: 'search',
      keyboardReturnKeyType: 'search',
      autoCompleteSuggestionType: 'none',
      autoCapitalize: undefined,
    },
  } as const;

  const keyboardConfig = keyboardConfigMap[type];

  keyboardAndAutocompleteProps.keyboardType = keyboardConfig.keyboardType;

  keyboardAndAutocompleteProps.keyboardReturnKeyType =
    keyboardReturnKeyType ?? keyboardConfig.keyboardReturnKeyType;

  keyboardAndAutocompleteProps.autoCompleteSuggestionType =
    autoCompleteSuggestionType ?? keyboardConfig.autoCompleteSuggestionType;

  keyboardAndAutocompleteProps.autoCapitalize = keyboardConfig.autoCapitalize;

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
    accessibilityLabel,
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
    onSubmit,
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
    autoCapitalize,
    testID,
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
      id="textinput"
      componentName={MetaConstants.TextInput}
      ref={textInputRef as React.Ref<HTMLInputElement>}
      label={label as string}
      accessibilityLabel={accessibilityLabel}
      hideLabelText={!Boolean(label)}
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
      onSubmit={onSubmit}
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
      testID={testID}
      {...getKeyboardAndAutocompleteProps({
        type,
        keyboardReturnKeyType,
        autoCompleteSuggestionType,
        autoCapitalize,
      })}
      {...styledProps}
    />
  );
};

const TextInput = assignWithoutSideEffects(React.forwardRef(_TextInput), {
  displayName: 'TextInput',
});

export { TextInput, TextInputProps };
