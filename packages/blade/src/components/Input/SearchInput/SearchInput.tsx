import React, { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { getKeyboardAndAutocompleteProps } from '../BaseInput/utils';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import { CloseIcon, SearchIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { MetaConstants } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getPlatformType } from '~utils';
import { useMergeRefs } from '~utils/useMergeRefs';
import type {
  BladeElementRef,
  BladeElementRefWithValue,
  DataAnalyticsAttribute,
} from '~utils/types';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { useDropdown } from '~components/Dropdown/useDropdown';

type SearchInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'labelPosition'
  | 'helpText'
  | 'placeholder'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'value'
  | 'isDisabled'
  | 'autoFocus'
  | 'onSubmit'
  | 'autoCapitalize'
  | 'testID'
  | 'onClick'
  | 'size'
  | keyof DataAnalyticsAttribute
> & {
  /**
   * Event handler to handle the onClick event for clear button.
   */
  onClearButtonClick?: () => void;

  /**
   * Decides whether to show a loading spinner for the input field.
   */
  isLoading?: boolean;
  /**
   * Toggle the visibility of the search icon.
   *
   * @default true
   */
  showSearchIcon?: boolean;
} & StyledPropsBlade;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type SearchInputPropsWithA11yLabel = {
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
type SearchInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type SearchInputProps = (SearchInputPropsWithA11yLabel | SearchInputPropsWithLabel) &
  SearchInputCommonProps;

// need to do this to tell TS to infer type as SearchInput of React Native and make it believe that `ref.current.clear()` exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isReactNative = (_textInputRef?: any): _textInputRef is TextInputReactNative => {
  return getPlatformType() === 'react-native';
};

const _SearchInput: React.ForwardRefRenderFunction<BladeElementRef, SearchInputProps> = (
  {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    placeholder,
    defaultValue,
    name,
    value,
    onChange,
    onClick,
    onFocus,
    onBlur,
    onSubmit,
    isDisabled,
    helpText,
    onClearButtonClick,
    isLoading,
    autoCapitalize,
    autoFocus,
    testID,
    size = 'medium',
    showSearchIcon = true,
    ...rest
  },
  ref,
): ReactElement => {
  const textInputRef = React.useRef<BladeElementRefWithValue>(null);
  const mergedRef = useMergeRefs(ref, textInputRef);
  const [shouldShowClearButton, setShouldShowClearButton] = useState(false);
  const {
    triggererWrapperRef,
    onTriggerKeydown,
    onTriggerClick,
    dropdownTriggerer,
  } = useDropdown();
  const isInsideDropdown = dropdownTriggerer === 'SearchInput';

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(defaultValue ?? value));
  }, [defaultValue, value]);

  const renderInteractionElement = (): ReactNode => {
    if (isLoading) {
      return <Spinner accessibilityLabel="Loading Content" color="primary" />;
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
          isDisabled={isDisabled}
          accessibilityLabel="Clear Input Content"
        />
      );
    }

    return null;
  };

  return (
    <BaseBox position="relative">
      <BaseInput
        id="searchinput"
        componentName={MetaConstants.SearchInput}
        ref={mergedRef}
        isDropdownTrigger={true}
        setInputWrapperRef={
          isInsideDropdown
            ? (wrapperNode) => {
                triggererWrapperRef.current = wrapperNode;
              }
            : undefined
        }
        label={label as string}
        accessibilityLabel={accessibilityLabel}
        hideLabelText={!Boolean(label)}
        labelPosition={labelPosition}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        name={name}
        onKeyDown={isInsideDropdown ? onTriggerKeydown : undefined}
        onChange={({ name, value }) => {
          if (value?.length) {
            // show the clear button when the user starts typing in
            setShouldShowClearButton(true);
          }

          if (shouldShowClearButton && !value?.length) {
            // hide the clear button when the input field is empty
            setShouldShowClearButton(false);
          }

          onChange?.({ name, value });
        }}
        onClick={(e) => {
          if (isDisabled) return;
          if (isInsideDropdown) {
            onTriggerClick();
          }
          onClick?.(e);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmit={onSubmit}
        isDisabled={isDisabled}
        leadingIcon={showSearchIcon ? SearchIcon : undefined}
        trailingInteractionElement={renderInteractionElement()}
        helpText={helpText}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        testID={testID}
        {...getKeyboardAndAutocompleteProps({
          type: 'search',
          autoCapitalize,
        })}
        size={size}
        {...rest}
      />
    </BaseBox>
  );
};

const SearchInput = assignWithoutSideEffects(React.forwardRef(_SearchInput), {
  displayName: 'SearchInput',
  componentId: dropdownComponentIds.triggers.SearchInput,
});

export type { SearchInputProps };
export { SearchInput };
