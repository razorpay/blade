import { useFloatingTree, useListItem, useMergeRefs } from '@floating-ui/react';
import React from 'react';
import type { DropdownItemProps } from '../types';
import { useDropdown } from '../useDropdown';
import { Box } from '~components/Box';
import { BaseMenuItem } from '~components/BaseMenu';
import { ChevronRightIcon } from '~components/Icons';
import type { ActionListProps } from '~components/ActionList';

const ActionList = ({ children }: ActionListProps): React.ReactElement => {
  return <Box>{children}</Box>;
};

const ActionListItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    {
      title,
      isDisabled,
      description,
      leading,
      trailing,
      _isDropdownTrigger,
      _hasFocusInside,
      href,
      target,
      children,
      as,
      ...props
    },
    forwardedRef,
  ) => {
    const dropdown = useDropdown();
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
          _isDropdownTrigger ? <ChevronRightIcon color="interactive.icon.gray.muted" /> : trailing
        }
        as={as ?? defaultAs}
        href={href}
        ref={useMergeRefs([item.ref, forwardedRef])}
        isDisabled={isDisabled}
        {...props}
        {...(_isDropdownTrigger
          ? {}
          : dropdown.getItemProps({
              onClick(event: React.MouseEvent<HTMLButtonElement>) {
                props.onClick?.(event);
                tree?.events.emit('click');
              },
              onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                props.onFocus?.(event);
                dropdown.setHasFocusInside(true);
              },
            }))}
      >
        {children}
      </BaseMenuItem>
    );
  },
);

export { ActionList, ActionListItem };
