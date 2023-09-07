import React from 'react';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { BaseLink } from '~components/Link/BaseLink';
import type { BaseLinkProps } from '~components/Link/BaseLink';
import type { LinkButtonVariantProps } from '~components/Link';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type DropdownLinkProps = LinkButtonVariantProps & {
  onBlur?: BaseLinkProps['onBlur'];
  onKeyDown?: BaseLinkProps['onKeyDown'];
};

const _DropdownLink = ({
  children,
  icon,
  iconPosition = 'left',
  onClick,
  onBlur,
  onKeyDown,
  isDisabled,
  href,
  target,
  rel,
  accessibilityLabel,
  size = 'medium',
  testID,
  hitSlop,
  htmlTitle,
  ...styledProps
}: DropdownLinkProps): React.ReactElement => {
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
    <BaseLink
      variant="button"
      {...(icon ? { icon, children } : { children })}
      iconPosition={iconPosition}
      size={size}
      testID={testID}
      hitSlop={hitSlop}
      htmlTitle={htmlTitle}
      isDisabled={isDisabled}
      {...styledProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const DropdownLink = assignWithoutSideEffects(_DropdownLink, {
  componentId: componentIds.triggers.DropdownLink,
});

export { DropdownLink };
