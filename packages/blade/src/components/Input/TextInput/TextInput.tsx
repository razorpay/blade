import React, { useEffect, useState, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { getKeyboardAndAutocompleteProps } from '../BaseInput/utils';
import type { TaggedInputProps } from '../BaseInput/useTaggedInput';
import { useTaggedInput } from '../BaseInput/useTaggedInput';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import type { IconComponent } from '~components/Icons';
import { CloseIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { MetaConstants } from '~utils/metaAttribute';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getPlatformType } from '~utils';
import { useMergeRefs } from '~utils/useMergeRefs';
import type {
  BladeElementRef,
  BladeElementRefWithValue,
  ContainerElementType,
  DataAnalyticsAttribute,
} from '~utils/types';
import { hintMarginTop } from '~components/Form/formTokens';
import { Divider } from '~components/Divider';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { DropdownOverlay } from '~components/Dropdown';

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
  | 'onClick'
  | 'size'
  | 'leadingIcon'
  | 'trailingButton'
  | 'trailingIcon'
  | 'textAlign'
  | keyof DataAnalyticsAttribute
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
   * @deprecated Use `leading` instead. This prop will be removed in the next major version.
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
  /**
   *
   * Icon or React Element to be rendered at the end of the input field
   */
  trailing?: React.ReactElement | IconComponent;
  /**
   * Icon or React Element to be rendered at the beginning of the input field
   */
  leading?: React.ReactElement | IconComponent;
} & TaggedInputProps &
  StyledPropsBlade;

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
    onClick,
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
    size = 'medium',
    leadingIcon,
    trailingIcon,
    isTaggedInput,
    tags,
    onTagChange,
    trailing,
    leading,
    ...rest
  },
  ref,
): ReactElement => {
  const textInputRef = React.useRef<BladeElementRefWithValue>(null);
  const mergedRef = useMergeRefs(ref, textInputRef);
  const [shouldShowClearButton, setShouldShowClearButton] = useState(false);
  const [isInputFocussed, setIsInputFocussed] = useState(autoFocus ?? false);
  const {
    activeTagIndex,
    setActiveTagIndex,
    getTags,
    handleTaggedInputKeydown,
    handleTaggedInputChange,
    handleTagsClear,
  } = useTaggedInput({
    isTaggedInput,
    tags,
    onTagChange,
    isDisabled,
    onChange,
    name,
    value,
    inputRef: textInputRef,
  });
  const [isTrailingDropDownOpen, setIsTrailingDropDownOpen] = React.useState(false);
  const [isLeadingDropDownOpen, setIsLeadingDropDownOpen] = React.useState(false);
  const textInputWrapperRef = useRef<ContainerElementType | null>(null);

  useEffect(() => {
    if (isTrailingDropDownOpen && isLeadingDropDownOpen) {
      setIsLeadingDropDownOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrailingDropDownOpen]);

  useEffect(() => {
    if (isLeadingDropDownOpen && isTrailingDropDownOpen) {
      setIsTrailingDropDownOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeadingDropDownOpen]);

  const leadingDropDown =
    leading && getComponentId(leading as React.ReactElement) === 'Dropdown' ? leading : null;

  const trailingDropdown =
    trailing && getComponentId(trailing as React.ReactElement) === 'Dropdown' ? trailing : null;
  // we need to look into name of component and check if it 's and icon or a dropdown
  const _leadingIcon: IconComponent | undefined =
    leading && typeof leading === 'function' && leading.name?.endsWith('Icon')
      ? (leading as IconComponent)
      : undefined;

  const _trailingIcon: IconComponent | undefined =
    trailing && typeof trailing === 'function' && trailing.name?.endsWith('Icon')
      ? (trailing as IconComponent)
      : undefined;
  const hasLeadingInterectionElement = !_leadingIcon && !leadingDropDown && leading;

  const hasTrailingInterectionElement = !_trailingIcon && !trailingDropdown && trailing;

  const renderDropdown = (
    dropdown: React.ReactElement,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    defaultPlacement: 'bottom-start' | 'bottom-end',
  ): React.ReactElement | null => {
    if (!dropdown) {
      return null;
    }
    return React.cloneElement(dropdown, {
      selectionType: 'single',
      isOpen,
      onOpenChange: (isOpen: boolean) => {
        setIsOpen(isOpen);
      },
      children: React.Children.map(dropdown.props.children, (child) => {
        if (child.type === DropdownOverlay) {
          return React.cloneElement(child, {
            referenceRef: textInputWrapperRef,
            _isNestedDropdown: true,
            defaultPlacement,
          });
        }
        return child;
      }),
    });
  };

  const renderLeadingDropDown = renderDropdown(
    leadingDropDown as React.ReactElement,
    isLeadingDropDownOpen,
    setIsLeadingDropDownOpen,
    'bottom-start',
  );

  const renderTrailingDropDown = renderDropdown(
    trailingDropdown as React.ReactElement,
    isTrailingDropDownOpen,
    setIsTrailingDropDownOpen,
    'bottom-end',
  );

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(showClearButton && (defaultValue ?? value)));
  }, [showClearButton, defaultValue, value]);

  const renderClearButton = (): React.ReactElement => {
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
          handleTagsClear();
          // if the input field is controlled just call the click handler and the value change shall be left upto the consumer
          onClearButtonClick?.();
          textInputRef?.current?.focus();
          setShouldShowClearButton(false);
        }}
        isDisabled={isDisabled}
        accessibilityLabel="Clear Input Content"
      />
    );
  };
  const hasTrailingDropDown = Boolean(trailingDropdown);

  const renderInteractionElement = (): ReactNode => {
    if (isLoading) {
      return <Spinner accessibilityLabel="Loading Content" color="primary" />;
    }

    if (shouldShowClearButton && hasTrailingDropDown) {
      return (
        <BaseBox display="flex" gap="spacing.3">
          {renderClearButton()} <Divider orientation="vertical" />
        </BaseBox>
      );
    }

    if (showClearButton && hasTrailingInterectionElement) {
      return (
        <BaseBox display="flex" gap="spacing.3">
          {renderClearButton()} <Divider orientation="vertical" /> {trailing as React.ReactElement}
        </BaseBox>
      );
    }

    if (shouldShowClearButton) {
      return renderClearButton();
    }

    if (hasTrailingInterectionElement) {
      return trailing as React.ReactElement;
    }
    return null;
  };
  return (
    <BaseInput
      id="textinput"
      componentName={MetaConstants.TextInput}
      ref={mergedRef}
      setInputWrapperRef={(wrapperNode) => {
        textInputWrapperRef.current = wrapperNode;
      }}
      label={label as string}
      accessibilityLabel={accessibilityLabel}
      hideLabelText={!Boolean(label)}
      labelPosition={labelPosition}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      name={name}
      maxCharacters={maxCharacters}
      isDropdownTrigger={isTaggedInput}
      tags={isTaggedInput ? getTags({ size }) : undefined}
      showAllTags={isInputFocussed}
      maxTagRows="single"
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      leadingDropDown={renderLeadingDropDown}
      trailingDropDown={renderTrailingDropDown}
      leadingInteractionElement={
        hasLeadingInterectionElement ? (leading as React.ReactElement) : null
      }
      onChange={({ name, value }) => {
        if (showClearButton && value?.length) {
          // show the clear button when the user starts typing in
          setShouldShowClearButton(true);
        }

        if (shouldShowClearButton && !value?.length) {
          // hide the clear button when the input field is empty
          setShouldShowClearButton(false);
        }

        handleTaggedInputChange({ name, value });
        onChange?.({ name, value });
      }}
      onClick={onClick}
      onFocus={(e) => {
        setIsInputFocussed(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsInputFocussed(false);
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        handleTaggedInputKeydown(e);
      }}
      onSubmit={onSubmit}
      isDisabled={isDisabled}
      necessityIndicator={necessityIndicator}
      isRequired={isRequired}
      leadingIcon={_leadingIcon ?? leadingIcon ?? icon}
      prefix={prefix}
      trailingInteractionElement={renderInteractionElement()}
      trailingIcon={_trailingIcon ?? trailingIcon}
      suffix={suffix}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      trailingFooterSlot={(value) => {
        return maxCharacters ? (
          <BaseBox marginTop={hintMarginTop[size]} marginRight="spacing.1">
            <CharacterCounter
              currentCount={value?.length ?? 0}
              maxCount={maxCharacters}
              size={size}
            />
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
      size={size}
      {...rest}
    />
  );
};

const TextInput = assignWithoutSideEffects(React.forwardRef(_TextInput), {
  displayName: 'TextInput',
});

export type { TextInputProps };
export { TextInput };
