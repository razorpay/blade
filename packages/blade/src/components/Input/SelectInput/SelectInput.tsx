import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { SelectChevronIcon } from './SelectChevronIcon';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { IconComponent } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { componentIds } from '~components/Dropdown/dropdownUtils';
import type { BladeElementRef } from '~utils/types';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getTagsGroup } from '~components/Tag/getTagsGroup';

type SelectInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'name'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'autoFocus'
  | 'onClick'
  | 'onFocus'
  | 'onBlur'
  | 'placeholder'
  | 'testID'
> & {
  icon?: IconComponent;
  /**
   * Controlled value of the Select. Use it in combination of `onChange`.
   *
   * Check out [Controlled Dropdown Documentation](https://blade.razorpay.com/?path=/story/components-dropdown-with-select--controlled-dropdown&globals=measureEnabled:false) for example.
   */
  value?: string | string[];
  /**
   * Used to set the default value of SelectInput when it's uncontrolled. Use `value` instead for controlled SelectInput
   */
  defaultValue?: string | string[];
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;
  /**
   * constraints the height of input to given number rows
   *
   * When set to expandable, input takes 1 row in the begining and expands to take 3 when active
   *
   * @default 'single'
   */
  maxRows?: BaseInputProps['maxTagRows'];
};

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type SelectInputPropsWithA11yLabel = {
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
type SelectInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type SelectInputProps = (SelectInputPropsWithA11yLabel | SelectInputPropsWithLabel) &
  SelectInputCommonProps;

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const {
    isOpen,
    value,
    displayValue,
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    activeIndex,
    activeTagIndex,
    setActiveTagIndex,
    triggererRef,
    hasFooterAction,
    dropdownTriggerer,
    shouldIgnoreBlurAnimation,
    setHasLabelOnLeft,
    setSelectedIndices,
    setShouldIgnoreBlurAnimation,
    controlledValueIndices,
    options,
    removeOption,
    isTagDismissedRef,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    setIsControlled,
    selectionType,
    selectedIndices,
    triggererWrapperRef,
  } = useDropdown();

  const {
    icon,
    onChange,
    defaultValue,
    placeholder = 'Select Option',
    onBlur,
    ...baseInputProps
  } = props;

  const getValuesArrayFromIndices = (): string[] => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

  const isFirstRenderRef = React.useRef(true);

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

  React.useEffect(() => {
    setHasLabelOnLeft(props.labelPosition === 'left');
  }, [props.labelPosition, setHasLabelOnLeft]);

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

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <BaseBox position="relative">
      {!isReactNative() ? (
        <VisuallyHidden>
          <input
            onFocus={() => {
              triggererRef.current?.focus();
            }}
            ref={ref as React.Ref<HTMLInputElement>}
            tabIndex={-1}
            required={props.isRequired}
            name={props.name}
            value={value}
            // Adding onChange to surpass no onChange on controlled component warning
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
            // Accessibility is covered in the select input itself so we hide this field from a11y tree
            aria-hidden={true}
          />
        </VisuallyHidden>
      ) : null}
      <BaseInput
        {...baseInputProps}
        as="button"
        isDropdownTrigger={true}
        maxTagRows={props.maxRows ?? 'single'}
        tags={getTags()}
        showAllTags={isOpen}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        value={selectionType === 'multiple' ? undefined : displayValue}
        label={props.label as string}
        hideLabelText={props.label?.length === 0}
        componentName={MetaConstants.SelectInput}
        ref={(!isReactNative() ? triggererRef : null) as never}
        setInputWrapperRef={(wrapperNode) => {
          triggererWrapperRef.current = wrapperNode;
        }}
        textAlign="left"
        placeholder={
          selectionType === 'multiple' && selectedIndices.length > 0 ? undefined : placeholder
        }
        id={`${dropdownBaseId}-trigger`}
        labelId={`${dropdownBaseId}-label`}
        leadingIcon={icon}
        hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
        isPopupExpanded={isOpen}
        onClick={(e) => {
          onTriggerClick();
          props?.onClick?.(e);
        }}
        onBlur={({ name }) => {
          onBlur?.({ name, value });
        }}
        onKeyDown={onTriggerKeydown}
        activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
        popupId={`${dropdownBaseId}-actionlist`}
        shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
        setShouldIgnoreBlurAnimation={setShouldIgnoreBlurAnimation}
        interactionElement={
          <SelectChevronIcon
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
        testID={props.testID}
      />
    </BaseBox>
  );
};

/**
 * ### SelectInput
 *
 * Our equivalent of `<select>` tag. Lets you select items from given options.
 *
 * To be used in combination of `Dropdown` and `ActionList` component
 *
 * ---
 *
 * #### Usage
 *
 * ```diff
 * <Dropdown>
 * + <SelectInput label="Select Fruits" />
 *   <DropdownOverlay>
 *     <ActionList>
 *       <ActionListItem title="Mango" value="mango" />
 *       <ActionListItem title="Apple" value="apple" />
 *     </ActionList>
 *   </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-dropdown-with-select--with-single-select SelectInput Documentation}.
 */

const SelectInput = assignWithoutSideEffects(React.forwardRef(_SelectInput), {
  componentId: componentIds.triggers.SelectInput,
});

export { SelectInput, SelectInputProps };
