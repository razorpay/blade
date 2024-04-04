/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
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
import type { BladeElementRef } from '~utils/types';
import { hintMarginTop } from '~components/Form/formTokens';
import { getTagsGroup } from '~components/Tag/getTagsGroup';

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
> & {
  /**
   * Decides whether to render a clear icon button
   */
  showClearButton?: boolean;
  /**
   * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
   */
  onClearButtonClick?: () => void;

  isTaggedInput?: boolean;
  tags?: string[];
  onTagChange?: ({ tags }: { tags: string[] }) => void;
} & StyledPropsBlade;

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
    ...styledProps
  },
  ref,
) => {
  const inputRef = React.useRef<BladeElementRef>(null);
  const mergedRef = useMergeRefs(ref, inputRef);
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [isInputFocussed, setIsInputFocussed] = React.useState(false);

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

  const getNewTagsArray = (indexToRemove: number): string[] => {
    if (!tags) {
      return [];
    }

    // Check if the index is valid
    if (indexToRemove < 0 || indexToRemove >= tags.length) {
      return tags; // Return the original array
    }

    // Create a new array without the element at the specified index
    const newArray = tags.slice(0, indexToRemove).concat(tags.slice(indexToRemove + 1));

    return newArray;
  };

  const getTags = React.useMemo(
    () => ({ size }: { size: NonNullable<BaseInputProps['size']> }) => {
      return getTagsGroup({
        size,
        tags: tags ?? [],
        activeTagIndex,
        isDisabled,
        onDismiss: ({ tagIndex }) => {
          // if (isTagDismissedRef.current) {
          //   isTagDismissedRef.current.value = true;
          // }

          if (!isReactNative(0)) {
            inputRef.current?.focus();
          }

          onTagChange?.({ tags: getNewTagsArray(tagIndex) });

          // removeOption(selectedIndices[tagIndex]);
          // setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTagIndex, tags, isDisabled],
  );

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
        if (!isTaggedInput) {
          return;
        }

        const currentTags = tags ?? [];
        const isControlledValue = Boolean(value);
        const inputElement = inputRef.current as HTMLTextAreaElement;
        const inputValue = isControlledValue ? value?.trim() : inputElement.value.trim();
        if (e.key === 'Enter') {
          e.event.preventDefault(); // we don't want textarea to treat enter as line break in tagged inputs

          if (inputValue) {
            onTagChange?.({ tags: [...currentTags, inputValue] });
            if (isControlledValue) {
              onChange?.({ name, value: '' });
            } else {
              inputElement.value = '';
            }

            setActiveTagIndex(-1);
          }
        }

        if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0) {
          onTagChange?.({ tags: currentTags.slice(0, -1) });
        }
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
      {...styledProps}
    />
  );
};

const TextArea = assignWithoutSideEffects(React.forwardRef(_TextArea), {
  displayName: 'TextArea',
});

export type { TextAreaProps };
export { TextArea };
