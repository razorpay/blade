import { useFloatingTree, useListItem, useMergeRefs } from '@floating-ui/react';
import React from 'react';
import type { MenuItemProps } from './types';
import { useMenu } from './useMenu';
import { BaseMenuItem } from '~components/BaseMenu/BaseMenuItem';
import { ChevronRightIcon } from '~components/Icons';

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    { title, isDisabled, _isMenuTrigger, _hasFocusInside, _isSubmenuOpen, ...props },
    forwardedRef,
  ) => {
    const menu = useMenu();
    const item = useListItem({ label: isDisabled ? null : title });
    const tree = useFloatingTree();

    return (
      <BaseMenuItem
        title={title}
        trailing={
          _isMenuTrigger ? <ChevronRightIcon color="interactive.icon.gray.muted" /> : undefined
        }
        as="button"
        className={_isSubmenuOpen ? 'has-submenu-open' : ''}
        {...props}
        ref={useMergeRefs([item.ref, forwardedRef])}
        isDisabled={isDisabled}
        {...(_isMenuTrigger
          ? {}
          : menu.getItemProps({
              onClick(event: React.MouseEvent<HTMLButtonElement>) {
                props.onClick?.(event);
                tree?.events.emit('click');
              },
              onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                props.onFocus?.(event);
                menu.setHasFocusInside(true);
              },
            }))}
      />
    );
  },
);

export { MenuItem };
