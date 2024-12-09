/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import type { TaggedInputProps } from '../BaseInput/useTaggedInput';
import { useTaggedInput } from '../BaseInput/useTaggedInput';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import { CloseIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { MetaConstants } from '~utils/metaAttribute';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getPlatformType } from '~utils';
import { useMergeRefs } from '~utils/useMergeRefs';
import type {
  BladeElementRef,
  BladeElementRefWithValue,
  DataAnalyticsAttribute,
} from '~utils/types';
import { hintMarginTop } from '~components/Form/formTokens';

type TextAreaCommonProps = Pick<
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
  | 'onSubmit'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'maxCharacters'
  | 'autoFocus'
  | 'numberOfLines'
  | 'testID'
  | 'size'
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
} & TaggedInputProps &
  StyledPropsBlade;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type TextAreaPropsWithA11yLabel = {
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
type TextAreaPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type TextAreaProps = (TextAreaPropsWithA11yLabel | TextAreaPropsWithLabel) & TextAreaCommonProps;

// need to do this to tell TS to infer type as TextInput of React Native and make it believe that `ref.current.clear()` exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isReactNative = (_textInputRef: any): _textInputRef is TextInputReactNative => {
  return getPlatformType() === 'react-native';
};

const _TextArea: React.ForwardRefRenderFunction<BladeElementRef, TextAreaProps> = (
  {
    label,
    accessibilityLabel,
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
    onChange,
    onFocus,
    onBlur,
    onSubmit,
    placeholder,
    value,
    maxCharacters,
    showClearButton,
    onClearButtonClick,
    autoFocus,
    numberOfLines = 2,
    testID,
    size = 'medium',
    isTaggedInput,
    tags,
    onTagChange,
    ...rest
  },
  ref,
) => {
  const inputRef = React.useRef<BladeElementRefWithValue>(null);
  const mergedRef = useMergeRefs(ref, inputRef);
  const [isInputFocussed, setIsInputFocussed] = React.useState(autoFocus ?? false);
  const {
    activeTagIndex,
    setActiveTagIndex,
    getTags,
    handleTaggedInputKeydown,
    handleTaggedInputChange,
    handleTagsClear,
  } = useTaggedInput({
    tags,
    onTagChange,
    isDisabled,
    inputRef,
    isTaggedInput,
    name,
    value,
    onChange,
  });

  const [shouldShowClearButton, setShouldShowClearButton] = React.useState(false);

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(showClearButton && (value?.length || defaultValue?.length)));
  }, [showClearButton, defaultValue, value]);

  const renderInteractionElement = (): React.ReactNode => {
    if (shouldShowClearButton) {
      return (
        <BaseBox paddingTop="spacing.3" marginTop="spacing.1">
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
              handleTagsClear();
              // if the input field is controlled just call the click handler and the value change shall be left upto the consumer
              onClearButtonClick?.();
              inputRef?.current?.focus();
              setShouldShowClearButton(false);
            }}
          />
        </BaseBox>
      );
    }

    return null;
  };

  return (
    <BaseInput
      as="textarea"
      id="textarea"
      maxTagRows="multiple"
      componentName={MetaConstants.TextArea}
      autoFocus={autoFocus}
      ref={mergedRef}
      label={label as string}
      tags={isTaggedInput ? getTags({ size }) : undefined}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      isDropdownTrigger={isTaggedInput}
      showAllTags={isInputFocussed}
      accessibilityLabel={accessibilityLabel}
      hideLabelText={!Boolean(label)}
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
      placeholder={placeholder}
      trailingInteractionElement={renderInteractionElement()}
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

        handleTaggedInputChange({ name, value });
        onChange?.({ name, value });
      }}
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
      trailingFooterSlot={(value) => {
        return maxCharacters ? (
          <BaseBox marginTop={hintMarginTop[size]} marginRight="spacing.1">
            <CharacterCounter currentCount={value?.length ?? 0} maxCount={maxCharacters} />
          </BaseBox>
        ) : null;
      }}
      testID={testID}
      size={size}
      {...rest}
    />
  );
};

const TextArea = assignWithoutSideEffects(React.forwardRef(_TextArea), {
  displayName: 'TextArea',
});

export type { TextAreaProps };
export { TextArea };
