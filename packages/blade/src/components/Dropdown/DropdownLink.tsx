import React from 'react';
import { getActionListContainerRole } from '../ActionList/getA11yRoles';
import { BaseLink } from '../Link/BaseLink';
import type { BaseLinkProps } from '../Link/BaseLink';
import type { LinkButtonVariantProps } from '../Link';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
  ...props
}: DropdownLinkProps): React.ReactElement => {
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
    <BaseLink
      variant="button"
      {...(icon ? { icon, children } : { children })}
      iconPosition={iconPosition}
      size={size}
      testID={testID}
      hitSlop={hitSlop}
      htmlTitle={htmlTitle}
      isDisabled={isDisabled}
      {...props}
      {...makeAnalyticsAttribute(props)}
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
  componentId: dropdownComponentIds.triggers.DropdownLink,
});

export { DropdownLink };
