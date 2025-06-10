/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import BaseButton from '~components/Button/BaseButton';
import type { ButtonProps } from '~components/Button';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { IconColor } from '~components/Button/BaseButton/types';

type DropdownButtonProps = Omit<ButtonProps, 'variant'> & {
  iconColor?: IconColor;
  onBlur?: BaseButtonProps['onBlur'];
  onKeyDown?: BaseButtonProps['onKeyDown'];
  variant?: BaseButtonProps['variant'];
};

const _DropdownButton = ({
  children,
  icon,
  iconPosition = 'left',
  iconColor,
  isDisabled = false,
  isFullWidth = false,
  isLoading = false,
  onClick,
  onBlur,
  onKeyDown,
  size = 'medium',
  type = 'button',
  variant = 'primary',
  accessibilityLabel,
  testID,
  ...rest
}: DropdownButtonProps): React.ReactElement => {
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
    // Using BaseButton here to avoid exporting onBlur and onKeyDown from Button
    // If in future we decide to export onBlur and onKeyDown on Button, this can be replaced with Button
    <BaseButton
      {...rest}
      {...(icon ? { icon, children } : { children: children || '' })}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      isLoading={isLoading}
      size={size}
      type={type}
      variant={variant}
      testID={testID}
      ref={triggererRef as any}
      accessibilityProps={{
        label: accessibilityLabel,
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

const DropdownButton = assignWithoutSideEffects(_DropdownButton, {
  componentId: dropdownComponentIds.triggers.DropdownButton,
});

export { DropdownButton };
