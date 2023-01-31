import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { SelectChevronIcon } from './SelectChevronIcon';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { IconComponent } from '~components/Icons';
import Box from '~components/Box';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { getPlatformType, isReactNative, MetaConstants } from '~utils';
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
  } = useDropdown();

  const inputRef = useBladeInnerRef(ref);

  const { icon, onChange, ...baseInputProps } = props;

  const platform = getPlatformType();

  React.useEffect(() => {
    onChange?.({ name: props.name, values: value.split(', ') });
  }, [value, onChange, props.name]);

  return (
    <Box position="relative">
      {platform !== 'react-native' ? (
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
        ref={triggererRef as React.MutableRefObject<HTMLInputElement>}
        textAlign="left"
        value={displayValue ? displayValue : 'Select Option'}
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
      />
    </Box>
  );
};

const SelectInput = React.forwardRef(_SelectInput);
// @ts-expect-error: componentId is our custom attribute
SelectInput.componentId = 'SelectInput';

export { SelectInput, SelectInputProps };
