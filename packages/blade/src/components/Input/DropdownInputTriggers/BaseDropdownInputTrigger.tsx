import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { InputChevronIcon } from './InputChevronIcon';
import type { BaseDropdownInputTriggerProps } from './types';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { isReactNative } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { MetaConstants } from '~utils/metaAttribute';
import { getTagsGroup } from '~components/Tag/getTagsGroup';
import type { BladeElementRef } from '~utils/types';
import { useTableContext } from '~components/Table/TableContext';
import {
  rowDensityToIsTableInputCellMapping,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
} from '~components/Table/tokens';
import { useTableEditableCell } from '~components/Table/TableEditableCellContext';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { useControlledDropdownInput } from '~utils/useControlledDropdownInput';

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
    headerAutoCompleteRef,
    triggererWrapperRef,
    isTagDismissedRef,
    onTriggerClick,
    value,
    shouldIgnoreBlurAnimation,
    setShouldIgnoreBlurAnimation,
    activeIndex,
    hasFooterAction,
    options,
    removeOption,
    setChangeCallbackTriggerer,
    changeCallbackTriggerer,
  } = useDropdown();
  const { rowDensity } = useTableContext();
  const { isInsideTableEditableCell } = useTableEditableCell();

  const dropdownTriggerPlaceholder = props.placeholder ?? 'Select Option';
  const isAutoCompleteInHeader =
    !props.isSelectInput && dropdownTriggerer !== dropdownComponentIds.triggers.AutoComplete;

  const getShowAllTags = React.useCallback((): boolean => {
    if (isAutoCompleteInHeader) {
      // When AutoComplete is in bottomsheet header, we never want to show all tags in outer select input
      if (props.isSelectInput) {
        return false;
      }

      // ... And we always want to show all tags in inner AutoComplete
      return true;
    }

    return isOpen;
  }, [isAutoCompleteInHeader, props.isSelectInput, isOpen]);

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
        (isReactNative()
          ? null
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (node: any) => {
              if (isAutoCompleteInHeader) {
                headerAutoCompleteRef.current = node;
              } else {
                triggererRef.current = node;
              }

              if (ref) {
                if (typeof ref === 'function') {
                  ref(node);
                } else {
                  ref.current = node;
                }
              }
            }) as never
      }
      isDropdownTrigger={true}
      setInputWrapperRef={(wrapperNode) => {
        // when autocomplete is in header, its not a trigger but a component inside of DropdownOverlay
        if (!isAutoCompleteInHeader) {
          triggererWrapperRef.current = wrapperNode;
        }
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
      valueSuffix={
        typeof props.valueSuffix === 'function'
          ? props.valueSuffix({
              values: options
                .filter((option, index) => selectedIndices.includes(index))
                .map((option) => option.value),
            })
          : undefined
      }
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
      role={isAutoCompleteInHeader ? 'searchbox' : 'combobox'}
      hasPopup={
        isAutoCompleteInHeader
          ? false
          : getActionListContainerRole(hasFooterAction, dropdownTriggerer)
      }
      isPopupExpanded={isOpen}
      activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
      popupId={isAutoCompleteInHeader ? undefined : `${dropdownBaseId}-actionlist`}
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
      // When AutoComplete is present inside DropdownOverlay, the floating ui adds tabIndex -1 internally. We override it with tabIndex 0 here
      tabIndex={isAutoCompleteInHeader ? 0 : undefined}
    />
  );
};

const BaseDropdownInputTrigger = React.forwardRef(_BaseDropdownInputTrigger);

export { BaseDropdownInputTrigger };
