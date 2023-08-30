import React from 'react';
import type { SelectInputProps } from './types';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import { useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative } from '~utils';
import { componentIds } from '~components/Dropdown/dropdownUtils';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const { value, triggererRef, onTriggerKeydown } = useDropdown();

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
      <BaseDropdownInputTrigger {...props} onTriggerKeydown={onTriggerKeydown} />
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

export { SelectInput };
