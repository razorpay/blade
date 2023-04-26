import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { SelectChevronIcon } from './SelectChevronIcon';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { IconComponent } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative, MetaConstants } from '~utils';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { makeInputValue } from '~components/Dropdown/dropdownUtils';

type SelectInputProps = Pick<
  BaseInputProps,
  | 'label'
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
  value?: string | string[];
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;
};

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): JSX.Element => {
  const {
    isOpen,
    value,
    displayValue,
    onTriggerClick,
    onTriggerKeydown,
    onTriggerBlur,
    dropdownBaseId,
    activeIndex,
    triggererRef,
    hasFooterAction,
    dropdownTriggerer,
    shouldIgnoreBlurAnimation,
    setHasLabelOnLeft,
    setSelectedIndices,
    selectedIndices,
    options,
    changeCallbackTriggerer,
    isControlled,
    setIsControlled,
  } = useDropdown();

  const inputRef = useBladeInnerRef(ref, {
    onFocus: (opts) => {
      triggererRef.current?.focus(opts);
    },
  });

  const { icon, onChange, placeholder = 'Select Option', onBlur, ...baseInputProps } = props;

  React.useEffect(() => {
    if (options.length > 0 && props.value) {
      if (!isControlled) {
        setIsControlled(true);
      }

      if (typeof props.value === 'string') {
        // single select control
        const selectedItemIndex = options.findIndex((option) => option.value === props.value);
        if (selectedItemIndex) {
          setSelectedIndices([selectedItemIndex]);
        }
      } else {
        // multiselect control
        const controlledSelectedIndices = props.value
          .map((optionValue) => options.findIndex((option) => option.value === optionValue))
          .filter((value) => value > 0);

        setSelectedIndices(controlledSelectedIndices);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  React.useEffect(() => {
    if (props.onChange) {
      console.log({ selectedIndices });
      props.onChange({
        name: props.name,
        values: makeInputValue(selectedIndices, options).split(','),
      });
    }
    // onChange?.({ name: props.name, values: value.split(', ') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);

  React.useEffect(() => {
    setHasLabelOnLeft(props.labelPosition === 'left');
  }, [props.labelPosition, setHasLabelOnLeft]);

  return (
    <BaseBox position="relative">
      {!isReactNative() ? (
        <VisuallyHidden>
          <input
            ref={inputRef as React.Ref<HTMLInputElement>}
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
        componentName={MetaConstants.SelectInput}
        ref={!isReactNative() ? (triggererRef as React.MutableRefObject<HTMLInputElement>) : null}
        textAlign="left"
        value={displayValue}
        placeholder={placeholder}
        id={`${dropdownBaseId}-trigger`}
        labelId={`${dropdownBaseId}-label`}
        leadingIcon={icon}
        hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
        isPopupExpanded={isOpen}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeydown}
        onBlur={({ name }) => {
          onTriggerBlur?.({ name, value, onBlurCallback: onBlur });
        }}
        activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
        popupId={`${dropdownBaseId}-actionlist`}
        shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
        interactionElement={
          <SelectChevronIcon
            onClick={() => {
              // Icon onClicks to the SelectInput itself
              if (!isReactNative()) {
                triggererRef.current?.focus();
              }
              onTriggerClick();
            }}
            icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
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
  componentId: 'SelectInput',
});

export { SelectInput, SelectInputProps };
