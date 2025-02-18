import React from 'react';
import { useDropdown } from '../useDropdown';
import { BaseInput } from '~components/Input/BaseInput';
// import type { BaseInputProps } from '../BaseInput';
// import { InputChevronIcon } from '../../Base';
// import type { BaseDropdownInputTriggerProps, useControlledDropdownInputProps } from './types';
// import isEmpty from '~utils/lodashButBetter/isEmpty';
import { isReactNative, isBrowser } from '~utils';
import { MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';

import { useTableEditableCell } from '~components/Table/TableEditableCellContext';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { InputChevronIcon } from '~components/Input/DropdownInputTriggers/InputChevronIcon';
import type { BaseDropdownInputTriggerProps } from '~components/Input/DropdownInputTriggers/types';

const _BaseDropdownInputTrigger = (
  props: BaseDropdownInputTriggerProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const { selectedIndices, isOpen, elementsRef } = useDropdown();
  // const { rowDensity } = useTableContext();
  const {
    onClick: onFloatingClick,
    onFocus: onFloatingFocus,
    onBlur: onFloatingBlur,
    onKeyDown: onFloatingKeyDown,
    ref: floatingRef,
    ...floatingReferenceProps
  } = props.referenceProps;

  const dropdownTriggerPlaceholder = props.placeholder ?? 'Select Option';
  // const isAutoCompleteInHeader =
  //   !props.isSelectInput && dropdownTriggerer !== dropdownComponentIds.triggers.AutoComplete;
  const isAutoCompleteInHeader = false;
  const selectionType = 'single';
  const dropdownBaseId = 'dropdown2';

  // const getShowAllTags = React.useCallback((): boolean => {
  //   if (isAutoCompleteInHeader) {
  //     // When AutoComplete is in bottomsheet header, we never want to show all tags in outer select input
  //     if (props.isSelectInput) {
  //       return false;
  //     }

  //     // ... And we always want to show all tags in inner AutoComplete
  //     return true;
  //   }

  //   return isOpen;
  // }, [isAutoCompleteInHeader, props.isSelectInput, isOpen]);

  // useControlledDropdownInput({
  //   onChange: props.onChange,
  //   name: props.name,
  //   value: props.value,
  //   defaultValue: props.defaultValue,
  //   syncInputValueWithSelection: props.syncInputValueWithSelection,
  //   isSelectInput: props.isSelectInput,
  //   triggererRef,
  // });

  const getValue = (): string | undefined => {
    let prefix = '';
    if (props.labelPosition === 'inside-input' && props.label) {
      prefix = `${props.label}: `;
    }

    if (props.isSelectInput) {
      if (selectionType === 'single') {
        return `${prefix}${selectedIndices}`;
      }

      // In multiselect, we return tags so no display value is required
      return undefined;
    }

    // In AutoComplete, input has a special value too
    return props.inputValue;
  };

  // const getTags = React.useMemo(
  //   () => ({ size }: { size: NonNullable<BaseInputProps['size']> }) => {
  //     if (selectionType === 'single') {
  //       return undefined;
  //     }

  //     return getTagsGroup({
  //       size,
  //       tags: selectedIndices.map((selectedIndex) => options[selectedIndex]?.title),
  //       activeTagIndex,
  //       isDisabled: props.isDisabled,
  //       onDismiss: ({ tagIndex }) => {
  //         if (isTagDismissedRef.current) {
  //           isTagDismissedRef.current.value = true;
  //         }

  //         if (!isReactNative()) {
  //           triggererRef.current?.focus();
  //         }

  //         removeOption(selectedIndices[tagIndex]);
  //         setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
  //       },
  //     });
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [selectedIndices, selectionType, activeTagIndex, changeCallbackTriggerer, options],
  // );

  // const tableInputProps: Partial<BaseInputProps> = {
  //   isTableInputCell: rowDensityToIsTableInputCellMapping[rowDensity],
  //   id: 'table-editable-cell-input',
  //   size: tableEditableCellRowDensityToInputSizeMap[rowDensity],
  //   trailingIcon: validationStateToInputTrailingIconMap[props.validationState ?? 'none'],
  //   showHintsAsTooltip: true,
  // };

  const isValidationStateNone =
    props.validationState === 'none' || props.validationState === undefined;

  const refMemo = React.useMemo(() => {
    return (isReactNative() || isAutoCompleteInHeader
      ? null
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node: any) => {
          // triggererRef.current = node;
          const elementRef = ref;
          if (elementRef) {
            if (typeof elementRef === 'function') {
              elementRef(node);
            } else {
              elementRef.current = node;
            }
          }
        }) as never;
  }, [ref, isReactNative, isAutoCompleteInHeader]);

  console.log('render basedropdowninputtrigger', props.referenceProps);

  return (
    <BaseInput
      {...floatingReferenceProps}
      as={props.isSelectInput ? 'button' : 'input'}
      ref={refMemo}
      isDropdownTrigger={true}
      setInputWrapperRef={(wrapperNode) => {
        console.count('setInputWrapperRef');
        // when autocomplete is in header, its not a trigger but a component inside of DropdownOverlay
        if (!isAutoCompleteInHeader) {
          // triggererWrapperRef.current = wrapperNode;
          floatingRef?.(wrapperNode);
        }
      }}
      maxTagRows={props.maxRows ?? 'single'}
      // tags={getTags({ size: props.size || 'medium' })}
      // showAllTags={getShowAllTags()}
      // activeTagIndex={activeTagIndex}
      // setActiveTagIndex={setActiveTagIndex}
      // shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
      // setShouldIgnoreBlurAnimation={setShouldIgnoreBlurAnimation}
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
        onFloatingClick?.(e.event);
      }}
      onFocus={(e) => {
        props.onFocus?.(e);
        onFloatingFocus?.(e.event);
      }}
      onBlur={({ name, event }) => {
        props.onBlur?.({ name, value: '' });
        onFloatingBlur?.(event);
      }}
      leadingIcon={props.icon}
      // Meta Props
      componentName={props.isSelectInput ? MetaConstants.SelectInput : MetaConstants.AutoComplete}
      testID={props.testID}
      // a11y Props
      id={`${dropdownBaseId}-trigger`}
      labelId={`${dropdownBaseId}-label`}
      // hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
      // isPopupExpanded={isOpen}
      // activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
      popupId={`${dropdownBaseId}-actionlist`}
      // Special Props for Unique behaviour between Select and AutoComplete
      onChange={props.isSelectInput ? undefined : props.onInputValueChange}
      onKeyDown={(e) => {
        props.onTriggerKeydown?.(e);
        onFloatingKeyDown?.(e.event);
      }}
      size={props.size}
      {...makeAnalyticsAttribute(props)}
      onTrailingInteractionElementClick={() => {
        // if (!props.isDisabled) {
        //   // Icon onClicks to the SelectInput itself
        //   if (!isReactNative()) {
        //     triggererRef.current?.focus();
        //   }
        //   onTriggerClick();
        // }
      }}
      trailingInteractionElement={
        <InputChevronIcon isDisabled={props.isDisabled} isOpen={isOpen} />
      }
      // {...(isInsideTableEditableCell ? tableInputProps : undefined)}
    />
  );
};

const BaseDropdownInputTrigger = React.forwardRef(_BaseDropdownInputTrigger);

export { BaseDropdownInputTrigger };
