import React from 'react';
import { useDropdown } from './useDropdown';
import { componentIds } from './dropdownUtils';
import type { ButtonProps } from '~components/Button';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import BaseButton from '~components/Button/BaseButton';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';

type DropdownButtonProps = ButtonProps & {
  onBlur?: BaseButtonProps['onBlur'];
  onKeyDown?: BaseButtonProps['onKeyDown'];
};

const _DropdownButton = ({
  children,
  icon,
  iconPosition = 'left',
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
  ...styledProps
}: DropdownButtonProps): JSX.Element => {
  const {
    onTriggerClick,
    onTriggerBlur,
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
      {...styledProps}
      {...(icon ? { icon, children } : { children })}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      isLoading={isLoading}
      size={size}
      type={type}
      variant={variant}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={triggererRef as any}
      {...makeAccessible({
        hasPopup: getActionListContainerRole(hasFooterAction, 'DropdownButton'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        role: 'combobox',
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      })}
      onClick={(e) => {
        onTriggerClick();
        // Setting it for web fails it on native typecheck and vice versa
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
        onClick?.(e as any);
      }}
      onBlur={(e) => {
        // With button trigger, there is no "value" as such. It's just clickable items
        onTriggerBlur?.({ name: undefined, value: undefined });
        // Setting it for web fails it on native typecheck and vice versa
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
        onBlur?.(e as any);
      }}
      onKeyDown={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
        onTriggerKeydown?.({ event: e as any });
        // Setting it for web fails it on native typecheck and vice versa
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
        onKeyDown?.(e as any);
      }}
    />
  );
};

const DropdownButton = assignWithoutSideEffects(_DropdownButton, {
  componentId: componentIds.triggers.DropdownButton,
});

export { DropdownButton };
