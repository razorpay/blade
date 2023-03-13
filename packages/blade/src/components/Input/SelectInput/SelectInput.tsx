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
  } = useDropdown();

  const inputRef = useBladeInnerRef(ref, {
    onFocus: (opts) => {
      triggererRef.current?.focus(opts);
    },
  });

  const { icon, onChange, placeholder = 'Select Option', ...baseInputProps } = props;

  React.useEffect(() => {
    onChange?.({ name: props.name, values: value.split(', ') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.name]);

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
        onBlur={onTriggerBlur}
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
const SelectInput = React.forwardRef(_SelectInput);
// @ts-expect-error: componentId is our custom attribute
SelectInput.componentId = 'SelectInput';

export { SelectInput, SelectInputProps };
