import React from 'react';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import { useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative } from '~utils';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { SelectInputProps } from '~components/Input/DropdownInputTriggers';

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <BaseBox position="relative">
      <BaseDropdownInputTrigger
        label={props.label}
        referenceProps={props._referenceProps}
        isSelectInput={true}
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
