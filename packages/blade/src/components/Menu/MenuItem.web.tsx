import { useFloatingTree, useListItem, useMergeRefs } from '@floating-ui/react';
import React from 'react';
import type { MenuItemProps } from './types';
import { useMenu } from './useMenu';
import { BaseMenuItem } from '~components/BaseMenu';
import { ChevronRightIcon } from '~components/Icons';

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      title,
      isDisabled,
      description,
      leading,
      trailing,
      _isMenuTrigger,
      _hasFocusInside,
      href,
      target,
      children,
      as,
      ...props
    },
    forwardedRef,
  ) => {
    const menu = useMenu();
    const item = useListItem({ label: isDisabled && Boolean(children) ? null : title });
    const tree = useFloatingTree();

    const isLink = Boolean(href);

    const defaultAs = isLink ? 'a' : 'button';

    return (
      <BaseMenuItem
        title={title}
        description={description}
        leading={leading}
        trailing={
          _isMenuTrigger ? <ChevronRightIcon color="interactive.icon.gray.muted" /> : trailing
        }
        as={as ?? defaultAs}
        href={href}
        ref={useMergeRefs([item.ref, forwardedRef])}
        isDisabled={isDisabled}
        {...props}
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
      >
        {children}
      </BaseMenuItem>
    );
  },
);

export { MenuItem };
