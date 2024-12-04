import React from 'react';
import type { SelectInputProps } from './types';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import { useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative } from '~utils';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const { value, triggererRef, onTriggerKeydown, onTriggerClick } = useDropdown();

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
            {...makeAnalyticsAttribute(props)}
            // Adding onChange to surpass no onChange on controlled component warning
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
            // Accessibility is covered in the select input itself so we hide this field from a11y tree
            aria-hidden={true}
          />
        </VisuallyHidden>
      ) : null}
      <BaseDropdownInputTrigger
        {...props}
        isSelectInput={true}
        onTriggerKeydown={onTriggerKeydown}
        onTriggerClick={(e) => {
          onTriggerClick();
          props?.onClick?.(e);
        }}
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
  componentId: dropdownComponentIds.triggers.SelectInput,
});

export { SelectInput };
