import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { InputChevronIcon } from './InputChevronIcon';
import type { BaseDropdownInputTriggerProps, useControlledDropdownInputProps } from './types';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { isReactNative, isBrowser } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { MetaConstants } from '~utils/metaAttribute';
import { getTagsGroup } from '~components/Tag/getTagsGroup';
import type { BladeElementRef } from '~utils/types';
import { useFirstRender } from '~utils/useFirstRender';
import { useTableContext } from '~components/Table/TableContext';
import {
  rowDensityToIsTableInputCellMapping,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
} from '~components/Table/tokens';
import { useTableEditableCell } from '~components/Table/TableEditableCellContext';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { fireNativeEvent } from '~utils/fireNativeEvent';

const useControlledDropdownInput = (props: useControlledDropdownInputProps): void => {
  const isFirstRender = useFirstRender();
  const {
    changeCallbackTriggerer,
    isControlled,
    options,
    selectedIndices,
    controlledValueIndices,
    setSelectedIndices,
    selectionType,
    setIsControlled,
  } = useDropdown();

  const getValuesArrayFromIndices = (): string[] => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

  const selectValues = (valuesToSelect: string | string[]): void => {
    if (options.length > 0) {
      // we use empty `''` for clearing the input
      if (isEmpty(valuesToSelect)) {
        setSelectedIndices([]);
      } else if (typeof valuesToSelect === 'string') {
        // single select control
        const selectedItemIndex = options.findIndex((option) => option.value === valuesToSelect);
        if (selectedItemIndex >= 0) {
          setSelectedIndices([selectedItemIndex]);
        }
      } else {
        // multiselect control

        // Handles repeated values in user state
        const uniqueValues = Array.from(new Set(valuesToSelect));
        // Handle selectionType single with multiselect values
        const userValues = selectionType === 'single' ? [valuesToSelect?.[0]] : uniqueValues;

        const selectedItemIndices = userValues
          .map((optionValue) => options.findIndex((option) => option.value === optionValue))
          .filter((value) => value >= 0);

        setSelectedIndices(selectedItemIndices);
      }
    }
  };

  // Handles `defaultValue` prop
  React.useEffect(() => {
    if (options.length > 0 && props.defaultValue) {
      selectValues(props.defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length]);

  // Handles `value` prop
  React.useEffect(() => {
    if (options.length > 0 && props.value !== undefined) {
      if (!isControlled) {
        setIsControlled(true);
      }

      selectValues(props.value);

      // in single select AutoComplete, we have to set inputValue of autocomplete according to the new selection.
      if (selectionType === 'single' && !Array.isArray(props.value) && !props.isSelectInput) {
        props.syncInputValueWithSelection?.(props.value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  // onChange behaviour
  React.useEffect(() => {
    // Ignore calling onChange on mount

    if (!isFirstRender) {
      props.onChange?.({
        name: props.name,
        values: getValuesArrayFromIndices(),
      });
      if (isBrowser()) {
        fireNativeEvent(props.triggererRef, ['change', 'input']);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);
};

const _BaseDropdownInputTrigger = (
  props: BaseDropdownInputTriggerProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const {
    isOpen,
    activeTagIndex,
    setActiveTagIndex,
    displayValue,
    selectionType,
    dropdownTriggerer,
    dropdownBaseId,
    selectedIndices,
    triggererRef,
    triggererWrapperRef,
    isTagDismissedRef,
    onTriggerClick,
    value,
    shouldIgnoreBlurAnimation,
    setShouldIgnoreBlurAnimation,
    activeIndex,
    hasFooterAction,
    hasAutoCompleteInBottomSheetHeader,
    options,
    removeOption,
    setChangeCallbackTriggerer,
    changeCallbackTriggerer,
  } = useDropdown();
  const { rowDensity } = useTableContext();
  const { isInsideTableEditableCell } = useTableEditableCell();

  const dropdownTriggerPlaceholder = props.placeholder ?? 'Select Option';
  const isAutoCompleteInHeader = !props.isSelectInput && hasAutoCompleteInBottomSheetHeader;

  const getShowAllTags = React.useCallback((): boolean => {
    if (hasAutoCompleteInBottomSheetHeader) {
      // When AutoComplete is in bottomsheet header, we never want to show all tags in outer select input
      if (props.isSelectInput) {
        return false;
      }

      // ... And we always want to show all tags in inner AutoComplete
      return true;
    }

    return isOpen;
  }, [hasAutoCompleteInBottomSheetHeader, props.isSelectInput, isOpen]);

  useControlledDropdownInput({
    onChange: props.onChange,
    name: props.name,
    value: props.value,
    defaultValue: props.defaultValue,
    syncInputValueWithSelection: props.syncInputValueWithSelection,
    isSelectInput: props.isSelectInput,
    triggererRef,
  });

  const getValue = (): string | undefined => {
    let prefix = '';
    if (props.labelPosition === 'inside-input' && props.label) {
      prefix = `${props.label}: `;
    }

    if (props.isSelectInput) {
      if (selectionType === 'single') {
        return `${prefix}${displayValue}`;
      }

      // In multiselect, we return tags so no display value is required
      return undefined;
    }

    // In AutoComplete, input has a special value too
    return props.inputValue;
  };

  const getTags = React.useMemo(
    () => ({ size }: { size: NonNullable<BaseInputProps['size']> }) => {
      if (selectionType === 'single') {
        return undefined;
      }

      return getTagsGroup({
        size,
        tags: selectedIndices.map((selectedIndex) => options[selectedIndex]?.title),
        activeTagIndex,
        isDisabled: props.isDisabled,
        onDismiss: ({ tagIndex }) => {
          if (isTagDismissedRef.current) {
            isTagDismissedRef.current.value = true;
          }

          if (!isReactNative()) {
            triggererRef.current?.focus();
          }

          removeOption(selectedIndices[tagIndex]);
          setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIndices, selectionType, activeTagIndex, changeCallbackTriggerer, options],
  );

  const tableInputProps: Partial<BaseInputProps> = {
    isTableInputCell: rowDensityToIsTableInputCellMapping[rowDensity],
    id: 'table-editable-cell-input',
    size: tableEditableCellRowDensityToInputSizeMap[rowDensity],
    trailingIcon: validationStateToInputTrailingIconMap[props.validationState ?? 'none'],
    showHintsAsTooltip: true,
  };

  const isValidationStateNone =
    props.validationState === 'none' || props.validationState === undefined;

  return (
    <BaseInput
      as={props.isSelectInput ? 'button' : 'input'}
      ref={
        (!isReactNative()
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (node: any) => {
              triggererRef.current = node;
              if (ref) {
                if (typeof ref === 'function') {
                  ref(node);
                } else {
                  ref.current = node;
                }
              }
            }
          : null) as never
      }
      isDropdownTrigger={true}
      setInputWrapperRef={(wrapperNode) => {
        triggererWrapperRef.current = wrapperNode;
      }}
      maxTagRows={props.maxRows ?? 'single'}
      tags={getTags({ size: props.size || 'medium' })}
      showAllTags={getShowAllTags()}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
      setShouldIgnoreBlurAnimation={setShouldIgnoreBlurAnimation}
      textAlign="left"
      // Form Props
      label={props.label as string}
      placeholder={
        selectionType === 'multiple' && selectedIndices.length > 0
          ? undefined
          : dropdownTriggerPlaceholder
      }
      hideLabelText={props.label?.length === 0}
      accessibilityLabel={props.accessibilityLabel}
      labelPosition={props.labelPosition === 'inside-input' ? undefined : props.labelPosition}
      isLabelInsideInput={props.labelPosition === 'inside-input'}
      necessityIndicator={props.necessityIndicator}
      autoCompleteSuggestionType="none"
      validationState={props.validationState}
      helpText={props.helpText}
      errorText={props.errorText}
      successText={props.successText}
      name={props.name}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      prefix={props.prefix}
      suffix={props.suffix}
      autoFocus={props.autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
      value={getValue()}
      onClick={(e) => {
        if (props.isDisabled) {
          return;
        }
        props.onTriggerClick?.(e);
      }}
      onFocus={props.onFocus}
      onBlur={({ name }) => {
        props.onBlur?.({ name, value });
      }}
      leadingIcon={props.icon}
      // Meta Props
      componentName={props.isSelectInput ? MetaConstants.SelectInput : MetaConstants.AutoComplete}
      testID={props.testID}
      // a11y Props
      id={`${dropdownBaseId}-trigger`}
      labelId={`${dropdownBaseId}-label`}
      hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
      isPopupExpanded={isOpen}
      activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
      popupId={`${dropdownBaseId}-actionlist`}
      // Special Props for Unique behaviour between Select and AutoComplete
      onChange={props.isSelectInput ? undefined : props.onInputValueChange}
      onKeyDown={props.onTriggerKeydown}
      size={props.size}
      {...makeAnalyticsAttribute(props)}
      onTrailingInteractionElementClick={() => {
        if (!props.isDisabled) {
          // Icon onClicks to the SelectInput itself
          if (!isReactNative()) {
            triggererRef.current?.focus();
          }
          onTriggerClick();
        }
      }}
      trailingInteractionElement={
        isAutoCompleteInHeader || (isInsideTableEditableCell && !isValidationStateNone) ? null : (
          <InputChevronIcon isDisabled={props.isDisabled} isOpen={isOpen} />
        )
      }
      {...(isInsideTableEditableCell ? tableInputProps : undefined)}
    />
  );
};

const BaseDropdownInputTrigger = React.forwardRef(_BaseDropdownInputTrigger);

export { BaseDropdownInputTrigger };
