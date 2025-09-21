/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import type { BladeElementRef } from '~utils/types';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { IconButtonProps } from '~components/Button/IconButton';
import StyledIconButton from '~components/Button/IconButton/StyledIconButton';

type DropdownIconButtonProps = Omit<IconButtonProps, 'onClick'> & {
  onBlur?: BaseButtonProps['onBlur'];
  onKeyDown?: BaseButtonProps['onKeyDown'];
  onClick?: IconButtonProps['onClick'];
};

const _DropdownIconButton: React.ForwardRefRenderFunction<
  BladeElementRef,
  DropdownIconButtonProps
> = ({
  icon,
  isDisabled = false,
  onClick,
  onBlur,
  onKeyDown,
  size = 'medium',
  accessibilityLabel,
  emphasis = 'intense',
  ...rest
}: DropdownIconButtonProps): React.ReactElement => {
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
    // Using StyledIconButton here to avoid exporting onKeydown, and accessibiltiyProps object
    <StyledIconButton
      {...rest}
      icon={icon}
      isDisabled={isDisabled}
      size={size}
      emphasis={emphasis}
      ref={triggererRef as any}
      accessibilityLabel={accessibilityLabel}
      accessibilityProps={{
        label: accessibilityLabel,
        hasPopup: getActionListContainerRole(hasFooterAction, 'DropdownIconButton'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      }}
      onClick={(e: any) => {
        onTriggerClick();
        // Setting it for web fails it on native typecheck and vice versa
        onClick?.(e as any);
      }}
      onBlur={(e: any) => {
        // With button trigger, there is no "value" as such. It's just clickable items
        // Setting it for web fails it on native typecheck and vice versa
        onBlur?.(e as any);
      }}
      onKeyDown={(e: any) => {
        onTriggerKeydown?.({ event: e as any });
        // Setting it for web fails it on native typecheck and vice versa
        onKeyDown?.(e as any);
      }}
    />
  );
};

const DropdownIconButton = assignWithoutSideEffects(_DropdownIconButton, {
  componentId: dropdownComponentIds.triggers.DropdownIconButton,
});

export { DropdownIconButton };
