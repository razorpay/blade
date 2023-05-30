import React from 'react';
import { getActionListContainerRole } from '../ActionList/getA11yRoles';
import { useDropdown } from './useDropdown';
import { componentIds } from './dropdownUtils';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils';
import type { BaseLinkProps } from '~components/Link/BaseLink';
import { BaseLink } from '~components/Link/BaseLink';
import type { LinkButtonVariantProps } from '~components/Link';

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
}: DropdownLinkProps): JSX.Element => {
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
      accessibilityLabel={accessibilityLabel}
      size={size}
      testID={testID}
      hitSlop={hitSlop}
      htmlTitle={htmlTitle}
      isDisabled={isDisabled}
      {...styledProps}
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

const DropdownButton = assignWithoutSideEffects(_DropdownLink, {
  componentId: componentIds.triggers.DropdownLink,
});

export { DropdownButton };
