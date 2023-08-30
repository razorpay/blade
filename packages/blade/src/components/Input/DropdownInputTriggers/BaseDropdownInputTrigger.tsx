import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { BaseInput } from '../BaseInput';
import { InputChevronIcon } from './InputChevronIcon';
import type { BaseDropdownInputTriggerProps } from './types';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { isReactNative } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { MetaConstants } from '~utils/metaAttribute';
import { getTagsGroup } from '~components/Tag/getTagsGroup';

const useControlledDropdownInput = (
  props: Pick<BaseDropdownInputTriggerProps, 'onChange' | 'name' | 'value' | 'defaultValue'>,
): void => {
  const isFirstRenderRef = React.useRef(true);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  // onChange behaviour
  React.useEffect(() => {
    // Ignore calling onChange on mount
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (props.onChange && !isFirstRenderRef.current) {
      props.onChange({
        name: props.name,
        values: getValuesArrayFromIndices(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);
};

const BaseDropdownInputTrigger = (props: BaseDropdownInputTriggerProps): React.ReactElement => {
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
    options,
    removeOption,
    setChangeCallbackTriggerer,
    changeCallbackTriggerer,
  } = useDropdown();

  const dropdownTriggerPlaceholder = props.placeholder ?? 'Select Option';
  const isSelectInput = dropdownTriggerer === 'SelectInput';

  useControlledDropdownInput({
    onChange: props.onChange,
    name: props.name,
    value: props.value,
    defaultValue: props.defaultValue,
  });

  const getValue = (): string | undefined => {
    if (isSelectInput) {
      if (selectionType === 'single') {
        return displayValue;
      }

      // In multiselect, we return tags so no display value is required
      return undefined;
    }

    // In AutoComplete, input has a special value too
    return props.inputValue;
  };

  const getTags = React.useMemo(
    () => () => {
      if (selectionType === 'single') {
        return undefined;
      }

      return getTagsGroup({
        tags: selectedIndices.map((selectedIndex) => options[selectedIndex].title),
        activeTagIndex,
        onDismiss: ({ tagIndex }) => {
          if (isTagDismissedRef.current) {
            isTagDismissedRef.current.value = true;
          }

          removeOption(selectedIndices[tagIndex]);
          setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIndices, selectionType, activeTagIndex, changeCallbackTriggerer, options],
  );

  return (
    <BaseInput
      as={isSelectInput ? 'button' : 'input'}
      ref={(!isReactNative() ? triggererRef : null) as never}
      setInputWrapperRef={(wrapperNode) => {
        triggererWrapperRef.current = wrapperNode;
      }}
      maxTagRows={props.maxRows ?? 'single'}
      tags={getTags()}
      showAllTags={isOpen}
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
      labelPosition={props.labelPosition}
      necessityIndicator={props.necessityIndicator}
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
        onTriggerClick();
        props?.onClick?.(e);
      }}
      onBlur={({ name }) => {
        props.onBlur?.({ name, value });
      }}
      leadingIcon={props.icon}
      // Meta Props
      componentName={isSelectInput ? MetaConstants.SelectInput : MetaConstants.AutoComplete}
      testID={props.testID}
      // a11y Props
      id={`${dropdownBaseId}-trigger`}
      labelId={`${dropdownBaseId}-label`}
      hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
      isPopupExpanded={isOpen}
      activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
      popupId={`${dropdownBaseId}-actionlist`}
      // Special Props for Unique behaviour between Select and AutoComplete
      onChange={isSelectInput ? undefined : props.onInputValueChange}
      onKeyDown={props.onTriggerKeydown}
      interactionElement={
        <InputChevronIcon
          onClick={() => {
            if (!props.isDisabled) {
              // Icon onClicks to the SelectInput itself
              if (!isReactNative()) {
                triggererRef.current?.focus();
              }
              onTriggerClick();
            }
          }}
          isOpen={isOpen}
        />
      }
    />
  );
};

export { BaseDropdownInputTrigger };
