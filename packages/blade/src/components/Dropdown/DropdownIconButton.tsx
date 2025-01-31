import React from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { IconButtonProps } from '~components/Button/IconButton';
import StyledIconButton from '~components/Button/IconButton/StyledIconButton';
import type { TooltipifyComponentProps } from '~utils/TooltipifyComponent';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';

type DropdownIconButtonProps = Omit<IconButtonProps, 'onClick'> & {
  onBlur?: BaseButtonProps['onBlur'];
  onKeyDown?: BaseButtonProps['onKeyDown'];
  onClick?: IconButtonProps['onClick'];
  tooltip?: TooltipifyComponentProps['tooltip'];
};

const _DropdownIconButton = ({
  icon,
  isDisabled = false,
  onClick,
  onBlur,
  onKeyDown,
  size = 'medium',
  accessibilityLabel,
  emphasis = 'intense',
  tooltip,
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
    <TooltipifyComponent tooltip={tooltip}>
      <StyledIconButton
        {...rest}
        icon={icon}
        isDisabled={isDisabled}
        size={size}
        emphasis={emphasis}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={triggererRef as any}
        accessibilityLabel={accessibilityLabel}
        accessibilityProps={{
          label: accessibilityLabel,
          hasPopup: getActionListContainerRole(hasFooterAction, 'DropdownIconButton'),
          expanded: isOpen,
          controls: `${dropdownBaseId}-actionlist`,
          activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
        }}
        onClick={(e) => {
          onTriggerClick();
          // Setting it for web fails it on native typecheck and vice versa
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
          onClick?.(e as any);
        }}
        onBlur={(e) => {
          // With button trigger, there is no "value" as such. It's just clickable items
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
    </TooltipifyComponent>
  );
};

const DropdownIconButton = assignWithoutSideEffects(_DropdownIconButton, {
  componentId: dropdownComponentIds.triggers.DropdownIconButton,
});

export { DropdownIconButton };
