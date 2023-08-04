/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { ReactNode } from 'react';
import type {
  FormInputLabelProps,
  FormInputValidationProps,
  FormInputHandleOnEvent,
  FormInputOnEvent,
  FormHintProps,
} from '../../Form';
import { StyledBaseInput } from './StyledBaseInput';
import { BaseInputVisuals } from './BaseInputVisuals';
import { BaseInputWrapper } from './BaseInputWrapper';
import { BaseInputTagSlot } from './BaseInputTagSlot';
import { FormHint, FormLabel } from '~components/Form';
import type { IconComponent } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getPlatformType, isReactNative, useBreakpoint } from '~utils';
import type { Platform } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useFormId } from '~components/Form/useFormId';
import { useTheme } from '~components/BladeProvider';
import useInteraction from '~utils/useInteraction';
import type {
  FormInputHandleOnClickEvent,
  FormInputHandleOnKeyDownEvent,
} from '~components/Form/FormTypes';
import type { TestID } from '~utils/types';
import { makeSize } from '~utils/makeSize';
import type { AriaAttributes } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';

type CommonAutoCompleteSuggestionTypes =
  | 'none'
  | 'name'
  | 'email'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | 'telephone'
  | 'postalCode'
  | 'countryName'
  | 'creditCardNumber'
  | 'creditCardCSC'
  | 'creditCardExpiry'
  | 'creditCardExpiryMonth'
  | 'creditCardExpiryYear';

type WebAutoCompleteSuggestionType = CommonAutoCompleteSuggestionTypes | 'on';

type BaseInputCommonProps = FormInputLabelProps &
  FormInputValidationProps & {
    /**
     * Determines if it needs to be rendered as input, textarea or button
     */
    as?: 'input' | 'textarea' | 'button';
    /**
     * ID that will be used for accessibility
     */
    id: string;
    /**
     * Placeholder text to be displayed inside the input field
     */
    placeholder?: string;
    /**
     * Type of Input Field to be rendered.
     *
     * @default text
     */
    type?: 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search' | 'password';
    /**
     * Used to set the default value of input field when it's uncontrolled
     */
    defaultValue?: string;
    /**
     * The name of the input field.
     *
     * Useful in form submissions
     */
    name?: string;
    /**
     * The callback function to be invoked when the input field gets focus
     */
    onFocus?: FormInputOnEvent;
    /**
     * The callback function to be invoked when the value of the input field changes
     */
    onChange?: FormInputOnEvent;
    /**
     * The callback function to be invoked when input is clicked
     */
    onClick?: FormInputOnEvent;
    /**
     * The callback function to be invoked when the value of the input field has any input
     */
    onInput?: FormInputOnEvent;
    /**
     * The callback function to be invoked whenever there is a keyDown event
     */
    onKeyDown?: FormInputHandleOnKeyDownEvent;
    /**
     * The callback function to be invoked when the the input field loses focus
     *
     * For React Native this will call `onEndEditing` event since we want to get the last value of the input field
     */
    onBlur?: FormInputOnEvent;
    /**
     * Ignores the blur event animation (Used in Select to ignore blur animation when item in option is clicked)
     */
    shouldIgnoreBlurAnimation?: boolean;
    /**
     * sets boolean that ignores the blur animations on baseinput
     */
    setShouldIgnoreBlurAnimation?: (shouldIgnoreBlurAnimation: boolean) => void;
    /**
     * Used to turn the input field to controlled so user can control the value
     */
    value?: string;
    /**
     * Used to disable the input field
     */
    isDisabled?: boolean;
    /**
     * If true, the input is marked as required, and `required` attribute will be added
     */
    isRequired?: boolean;
    /**
     * Icon to be shown at the start of the input field
     */
    leadingIcon?: IconComponent;
    /**
     * Prefix symbol to be displayed at the beginning of the input field. If leadingIcon is provided it'll be placed after it
     */
    prefix?: string;
    /**
     * Element to be rendered before suffix. This is decided by the component which is extending BaseInput
     *
     * eg: consumers can render a loader or they could render a clear button
     */
    interactionElement?: ReactNode;
    /**
     * Suffix symbol to be displayed at the end of the input field. If trailingIcon is provided it'll be placed before it
     */
    suffix?: string;
    /**
     * Icon to be displayed at the end of the input field
     */
    trailingIcon?: IconComponent;
    /**
     * Displays the character counter under the input field
     */
    maxCharacters?: number;
    /**
     * alignment of the text inside input field
     */
    textAlign?: 'left' | 'center' | 'right';
    /**
     * If true, focuses the input field on load
     *
     * **Note:**
     * Automatically focusing a form control can confuse visually-impaired people using screen-reading technology and people with cognitive impairments.
     * When autofocus is assigned, screen-readers "teleport" their user to the form control without warning them beforehand.
     */
    autoFocus?: boolean;
    /**
     * Hints the platform to display an appropriate virtual keyboard
     *
     * **Native:** Passes as is the `keyboardType` attribute
     *
     * **Web:** Passes the value to the `inputMode` attribute
     */
    keyboardType?: 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal';
    /**
     * determines what return key to show on the keyboard of mobile devices/virtual keyboard
     * **Note**: Few values are platform dependent and might not render on all the platforms
     *
     * `default` is only available on native. it'll be mapped to `enter` for web
     * `previous` is only available on native android
     */
    keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';
    /**
     * Element to be rendered on the trailing slot of input field label
     */
    trailingHeaderSlot?: (value?: string) => ReactNode;
    /**
     * Element to be rendered on the trailing slot of input field footer
     */
    trailingFooterSlot?: (value?: string) => ReactNode;
    /**
     * Sets the textarea's number of lines
     */
    numberOfLines?: 2 | 3 | 4 | 5;
    /**
     * Sets the accessibility label for the input
     */
    accessibilityLabel?: string;
    /**
     * Sets the id of the label
     *
     * (Useful when assigning one label to multiple elements using aria-labelledby)
     */
    labelId?: string;
    /**
     * Can be used in select to set the id of the active descendant from the listbox
     */
    activeDescendant?: string;
    /**
     * Hides the label text
     */
    hideLabelText?: boolean;
    /**
     * Hides the form hint text
     */
    hideFormHint?: boolean;
    /**
     * componentName prop sets the data-blade-component attribute name
     * for internal metric collection purposes
     */
    componentName?: string;
    /**
     * whether the input has a popup
     */
    hasPopup?: AriaAttributes['hasPopup'];
    /**
     * id of the popup
     */
    popupId?: string;
    /**
     * true if popup is in expanded state
     */
    isPopupExpanded?: boolean;
    /**
     * sets the autocapitalize behavior for the input
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

    /**
     * Removes the height restriction from input.
     * Unlike as="textarea" prop, this does not make input render as textarea element while increasing height.
     */
    isMultiline?: boolean;
    /**
     * A slot for adding tags to input
     */
    tags?: React.ReactElement[] | null;

    /**
     * Disables stripping of tags and shows all tags
     */
    showAllTags?: boolean;

    /**
     * State variable of active tag index
     */
    activeTagIndex?: number;

    /**
     * State setter for active tag index
     */
    setActiveTagIndex?: (activeTagIndex: number) => void;
  } & TestID &
  Platform.Select<{
    native: {
      /**
       * The callback function to be invoked when the value of the input field is submitted.
       */
      onSubmit?: FormInputOnEvent;
      /**
       * determines what autoComplete suggestion type to show
       *
       * Internally it'll render platform specific attributes:
       *
       * - web: `autocomplete`
       * - iOS: `textContentType`
       * - android: `autoComplete`
       *
       */
      autoCompleteSuggestionType?: CommonAutoCompleteSuggestionTypes;
    };
    web: {
      /**
       * This is a react-native only prop and has no effect on web.
       */
      onSubmit?: undefined;
      /**
       * determines what autoComplete suggestion type to show
       *
       * Internally it'll render platform specific attributes:
       *
       * - web: `autocomplete`
       * - iOS: `textContentType`
       * - android: `autoComplete`
       *
       */
      autoCompleteSuggestionType?: WebAutoCompleteSuggestionType;
    };
  }> &
  StyledPropsBlade;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type BaseInputPropsWithA11yLabel = {
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
type BaseInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

export type BaseInputProps = (BaseInputPropsWithA11yLabel | BaseInputPropsWithLabel) &
  BaseInputCommonProps;

const autoCompleteSuggestionTypeValues = [
  'none',
  'on',
  'name',
  'email',
  'username',
  'password',
  'newPassword',
  'oneTimeCode',
  'telephone',
  'postalCode',
  'countryName',
  'creditCardNumber',
  'creditCardCSC',
  'creditCardExpiry',
  'creditCardExpiryMonth',
  'creditCardExpiryYear',
];

type OnInputKeydownTagHandlerType = (key: string | undefined) => void;
const useTags = (
  tags: BaseInputProps['tags'],
  activeTagIndex: number,
  setActiveTagIndex?: (activeTagIndex: number) => void,
): {
  onInputKeydownTagHandler: OnInputKeydownTagHandlerType;
  visibleTagsCountRef: React.MutableRefObject<number>;
} => {
  const visibleTagsCountRef = React.useRef<number>(0);

  const onTagLeft = (): void => {
    if (activeTagIndex < 0) {
      console.log('setting based on visible tags count', { visibleTagsCountRef, activeTagIndex });
      setActiveTagIndex?.(visibleTagsCountRef.current - 1);
    }

    if (activeTagIndex > 0) {
      setActiveTagIndex?.(activeTagIndex - 1);
      console.log('setting based on active tags index');
    }
  };

  const onTagRight = (): void => {
    if (activeTagIndex < visibleTagsCountRef.current - 1) {
      setActiveTagIndex?.(activeTagIndex + 1);
    }
  };

  const onTagRemove = (): void => {
    if (activeTagIndex >= 0 && activeTagIndex < visibleTagsCountRef.current && tags) {
      tags[activeTagIndex].props.onDismiss();
    }
  };

  const onInputKeydownTagHandler: OnInputKeydownTagHandlerType = (key) => {
    if (tags && tags.length > 0) {
      if (key === 'ArrowRight') {
        onTagRight();
      }

      if (key === 'ArrowLeft') {
        onTagLeft();
      }

      if (key === 'Backspace') {
        onTagRemove();
      }
    }
  };

  return {
    onInputKeydownTagHandler,
    visibleTagsCountRef,
  };
};

const useInput = ({
  value,
  defaultValue,
  onClick,
  onFocus,
  onChange,
  onBlur,
  onSubmit,
  onInput,
  onKeyDown,
  onInputKeydownTagHandler,
}: Pick<
  BaseInputProps,
  | 'value'
  | 'defaultValue'
  | 'onFocus'
  | 'onChange'
  | 'onBlur'
  | 'onInput'
  | 'onKeyDown'
  | 'onClick'
  | 'onSubmit'
> & {
  onInputKeydownTagHandler: OnInputKeydownTagHandlerType;
}): {
  handleOnFocus: FormInputHandleOnEvent;
  handleOnClick: FormInputHandleOnClickEvent;
  handleOnChange: FormInputHandleOnEvent;
  handleOnBlur: FormInputHandleOnEvent;
  handleOnSubmit: FormInputHandleOnEvent;
  handleOnInput: FormInputHandleOnEvent;
  handleOnKeyDown: FormInputHandleOnKeyDownEvent;
  inputValue?: string;
} => {
  if (__DEV__) {
    if (value && defaultValue) {
      throw new Error(
        `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
      );
    }
  }

  const [inputValue, setInputValue] = React.useState(defaultValue ?? value);

  const handleOnFocus: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onFocus?.({
        name,
        value: _value,
      });
    },
    [onFocus],
  );

  const handleOnClick: FormInputHandleOnClickEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.currentTarget.value ?? '';
      }

      onClick?.({
        name,
        value: _value,
      });
    },
    [onClick],
  );

  const handleOnSubmit: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }
      if (isReactNative()) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        //@ts-ignore need to ignore this since it will throw a TS error for web but not for native
        onSubmit?.({
          name,
          value: _value,
        });
      }
    },
    [onSubmit],
  );

  const handleOnBlur: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';
      if (getPlatformType() === 'react-native' && typeof value == 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onBlur?.({
        name,
        value: _value,
      });
    },
    [onBlur],
  );

  const handleOnChange: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onChange?.({
        name,
        value: _value,
      });
      setInputValue(_value);
    },
    [onChange],
  );

  const handleOnInput: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';
      if (getPlatformType() === 'react-native' && typeof value == 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onInput?.({
        name,
        value: _value,
      });
    },
    [onInput],
  );

  const handleOnKeyDown: FormInputHandleOnKeyDownEvent = React.useCallback(
    ({ name, key, code, event }) => {
      onInputKeydownTagHandler(key);
      onKeyDown?.({
        name,
        key,
        code,
        event,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onKeyDown],
  );

  return {
    handleOnFocus,
    handleOnClick,
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    handleOnInput,
    handleOnKeyDown,
    inputValue,
  };
};

export const getHintType = ({
  validationState,
  hasHelpText,
}: {
  validationState: BaseInputProps['validationState'];
  hasHelpText: boolean;
}): FormHintProps['type'] => {
  if (validationState === 'error') {
    return 'error';
  }

  if (validationState === 'success') {
    return 'success';
  }

  if (hasHelpText) {
    return 'help';
  }

  return 'help';
};

const getDescribedByElementId = ({
  validationState,
  hasErrorText,
  hasSuccessText,
  hasHelpText,
  errorTextId,
  successTextId,
  helpTextId,
}: {
  validationState: BaseInputProps['validationState'];
  hasErrorText: boolean;
  hasSuccessText: boolean;
  hasHelpText: boolean;
  errorTextId: string;
  successTextId: string;
  helpTextId: string;
}): string => {
  if (validationState === 'error' && hasErrorText) {
    return errorTextId;
  }

  if (validationState === 'success' && hasSuccessText) {
    return successTextId;
  }

  if (hasHelpText) {
    return helpTextId;
  }

  return '';
};

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      as = 'input',
      label,
      labelPosition = 'top',
      placeholder,
      type = 'text',
      defaultValue,
      tags,
      showAllTags = false,
      activeTagIndex = -1,
      setActiveTagIndex,
      name,
      value,
      onFocus,
      onChange,
      onInput,
      onBlur,
      onSubmit,
      onClick,
      onKeyDown,
      isDisabled,
      necessityIndicator,
      validationState,
      errorText,
      helpText,
      successText,
      isRequired,
      leadingIcon,
      prefix,
      interactionElement,
      suffix,
      trailingIcon,
      maxCharacters,
      textAlign,
      autoFocus,
      keyboardReturnKeyType,
      keyboardType,
      autoCompleteSuggestionType,
      trailingHeaderSlot,
      trailingFooterSlot,
      numberOfLines,
      id,
      componentName,
      accessibilityLabel,
      labelId,
      activeDescendant,
      hideLabelText,
      hideFormHint,
      hasPopup,
      popupId,
      isPopupExpanded,
      isMultiline,
      shouldIgnoreBlurAnimation,
      setShouldIgnoreBlurAnimation,
      autoCapitalize,
      testID,
      ...styledProps
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { onInputKeydownTagHandler, visibleTagsCountRef } = useTags(
      tags,
      activeTagIndex,
      setActiveTagIndex,
    );
    const {
      handleOnFocus,
      handleOnChange,
      handleOnClick,
      handleOnBlur,
      handleOnSubmit,
      handleOnInput,
      handleOnKeyDown,
      inputValue,
    } = useInput({
      defaultValue,
      value,
      onFocus,
      onClick,
      onChange,
      onBlur,
      onSubmit,
      onInput,
      onKeyDown,
      onInputKeydownTagHandler,
    });
    const { inputId, helpTextId, errorTextId, successTextId } = useFormId(id);
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
    const { currentInteraction, setCurrentInteraction } = useInteraction();
    const _isRequired = isRequired || necessityIndicator === 'required';

    const accessibilityProps = makeAccessible({
      required: Boolean(_isRequired),
      disabled: Boolean(isDisabled),
      invalid: Boolean(validationState === 'error'),
      describedBy: getDescribedByElementId({
        validationState,
        hasErrorText: Boolean(errorText),
        hasSuccessText: Boolean(successText),
        hasHelpText: Boolean(helpText),
        errorTextId,
        successTextId,
        helpTextId,
      }),
      label: accessibilityLabel,
      hasPopup,
      expanded: hasPopup ? isPopupExpanded : undefined,
      controls: hasPopup ? popupId : undefined,
      role: hasPopup ? 'combobox' : undefined,
      activeDescendant,
    });

    const willRenderHintText = Boolean(helpText) || Boolean(successText) || Boolean(errorText);

    if (__DEV__) {
      if (
        autoCompleteSuggestionType &&
        !autoCompleteSuggestionTypeValues.includes(autoCompleteSuggestionType)
      ) {
        throw new Error(
          `[Blade: Input]: Expected autoCompleteSuggestionType to be one of ${autoCompleteSuggestionTypeValues.join(
            ', ',
          )} but received ${autoCompleteSuggestionType}`,
        );
      }
    }

    const isTextArea = as === 'textarea';
    const isReactNative = getPlatformType() === 'react-native';
    return (
      <BaseBox {...metaAttribute({ name: componentName, testID })} {...getStyledProps(styledProps)}>
        <BaseBox
          display="flex"
          flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
          justifyContent={isLabelLeftPositioned ? 'center' : undefined}
          alignItems={isLabelLeftPositioned ? 'center' : undefined}
          position="relative"
          width="100%"
        >
          {!hideLabelText && (
            <BaseBox
              display="flex"
              flexDirection={isLabelLeftPositioned ? 'column' : 'row'}
              justifyContent="space-between"
              alignSelf={isTextArea ? 'flex-start' : undefined}
              marginY={isTextArea && isLabelLeftPositioned ? 'spacing.3' : 'spacing.0'}
            >
              <FormLabel
                as="label"
                necessityIndicator={necessityIndicator}
                position={labelPosition}
                id={labelId}
                htmlFor={inputId}
              >
                {label}
              </FormLabel>
              {trailingHeaderSlot?.(inputValue)}
            </BaseBox>
          )}
          <BaseInputWrapper
            isTextArea={isTextArea}
            isDisabled={isDisabled}
            validationState={validationState}
            currentInteraction={currentInteraction}
            isLabelLeftPositioned={isLabelLeftPositioned}
          >
            <BaseInputVisuals leadingIcon={leadingIcon} prefix={prefix} isDisabled={isDisabled} />
            <BaseInputTagSlot
              tags={tags}
              showAllTags={showAllTags}
              setFocusOnInput={() => {
                if (ref && 'current' in ref) {
                  ref.current?.focus();
                }
              }}
              visibleTagsCountRef={visibleTagsCountRef}
              handleOnClick={handleOnClick}
              setShouldIgnoreBlurAnimation={setShouldIgnoreBlurAnimation}
              isMultiline={isMultiline}
              inputRef={ref}
            />
            <StyledBaseInput
              as={isReactNative ? undefined : as}
              id={inputId}
              ref={ref as any}
              name={name}
              type={type}
              defaultValue={defaultValue}
              value={value}
              placeholder={placeholder}
              isDisabled={isDisabled}
              validationState={validationState}
              isRequired={_isRequired}
              handleOnFocus={handleOnFocus}
              handleOnChange={handleOnChange}
              handleOnBlur={handleOnBlur}
              handleOnSubmit={handleOnSubmit}
              handleOnInput={handleOnInput}
              handleOnKeyDown={handleOnKeyDown}
              handleOnClick={handleOnClick}
              leadingIcon={leadingIcon}
              prefix={prefix}
              interactionElement={interactionElement}
              suffix={suffix}
              trailingIcon={trailingIcon}
              maxCharacters={maxCharacters}
              textAlign={textAlign}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocus}
              keyboardReturnKeyType={keyboardReturnKeyType}
              keyboardType={keyboardType}
              autoCompleteSuggestionType={autoCompleteSuggestionType}
              accessibilityProps={accessibilityProps}
              currentInteraction={currentInteraction}
              setCurrentInteraction={setCurrentInteraction}
              numberOfLines={numberOfLines}
              isTextArea={isTextArea || isMultiline}
              hasPopup={hasPopup}
              shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
              autoCapitalize={autoCapitalize}
              {...metaAttribute({ name: MetaConstants.StyledBaseInput })}
            />
            <BaseInputVisuals
              interactionElement={interactionElement}
              suffix={suffix}
              trailingIcon={trailingIcon}
              isDisabled={isDisabled}
            />
          </BaseInputWrapper>
        </BaseBox>
        {/* the magic number 136 is basically max-width of label i.e 120 and then right margin i.e 16 which is the spacing between label and input field */}
        {!hideFormHint && (
          <BaseBox marginLeft={makeSize(isLabelLeftPositioned && !hideLabelText ? 136 : 0)}>
            <BaseBox
              display="flex"
              flexDirection="row"
              justifyContent={willRenderHintText ? 'space-between' : 'flex-end'}
            >
              <FormHint
                type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
                helpText={helpText}
                errorText={errorText}
                successText={successText}
                helpTextId={helpTextId}
                errorTextId={errorTextId}
                successTextId={successTextId}
              />
              {trailingFooterSlot?.(inputValue)}
            </BaseBox>
          </BaseBox>
        )}
      </BaseBox>
    );
  },
);
