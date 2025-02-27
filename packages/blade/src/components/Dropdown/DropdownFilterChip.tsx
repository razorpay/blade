/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseFilterChipProps } from '~components/FilterChip/types';

type DropdownFilterChipProps = Pick<
  BaseFilterChipProps,
  | 'onKeyDown'
  | 'value'
  | 'onClearButtonClick'
  | 'label'
  | 'testID'
  | 'onClick'
  | 'selectionType'
  | 'onBlur'
> & {
  accessibilityLabel?: string;
  defaultValue?: string;
};

const _DropdownFilterChip = ({
  onClick,
  onBlur,
  onKeyDown,
  accessibilityLabel,
  testID,
  value,
  // defaultValue,
  onClearButtonClick,
  label,
  ...rest
}: DropdownFilterChipProps): React.ReactElement => {
  const {
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
  } = useDropdown();

  return (
    <BaseFilterChip
      label={label}
      value={value}
      onClearButtonClick={onClearButtonClick}
      {...rest}
      ref={triggererRef as any}
      accessibilityProps={{
        label: accessibilityLabel ?? label,
        hasPopup: getActionListContainerRole(hasFooterAction, 'DropdownButton'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      }}
      onClick={(e) => {
        onTriggerClick();
        // Setting it for web fails it on native typecheck and vice versa
        onClick?.(e as any);
      }}
      onBlur={(e) => {
        // With button trigger, there is no "value" as such. It's just clickable items
        // Setting it for web fails it on native typecheck and vice versa
        onBlur?.(e as any);
      }}
      onKeyDown={(e) => {
        onTriggerKeydown?.({ event: e as any });
        // Setting it for web fails it on native typecheck and vice versa
        onKeyDown?.(e as any);
      }}
    />
  );
};

const DropdownFilterChip = assignWithoutSideEffects(_DropdownFilterChip, {
  componentId: dropdownComponentIds.triggers.DropdownButton,
});

export { DropdownFilterChip };
