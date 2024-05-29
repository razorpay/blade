import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { ChevronRightIcon } from '~components/Icons';
// import { Button } from '~components/Button';
// import { ChevronRightIcon } from '~components/Icons';

const StyledMenuItem = styled.button<{ hasFocusInside?: boolean }>((_props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
  };
});

const MenuContext = React.createContext<{
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}>({
  getItemProps: () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setHasFocusInside: () => {},
  isOpen: false,
});

interface MenuProps {
  label: string;
  nested?: boolean;
  children?: React.ReactNode;
}

export const MenuComponent = React.forwardRef<
  HTMLButtonElement,
  MenuProps & React.HTMLProps<HTMLButtonElement>
>(({ children, label, ...props }, forwardedRef) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasFocusInside, setHasFocusInside] = React.useState(false);

  const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const parent = React.useContext(MenuContext);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();

  const isNested = parentId != null;

  const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? 'right-start' : 'bottom-start',
    middleware: [
      offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: !isNested,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: 'dialog' });
  const dismiss = useDismiss(context, { bubbles: true });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
  ]);

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    const handleTreeClick = (): void => {
      setIsOpen(false);
    };

    const onSubMenuOpen = (event: { nodeId: string; parentId: string }): void => {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    };

    tree.events.on('click', handleTreeClick);
    tree.events.on('menuopen', onSubMenuOpen);

    // eslint-disable-next-line consistent-return
    return () => {
      // Cleanup
      tree.events.off('click', handleTreeClick);
      tree.events.off('menuopen', onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit('menuopen', { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  const referenceProps = {
    ref: useMergeRefs([refs.setReference, item.ref, forwardedRef]),
    ...getReferenceProps(
      parent.getItemProps({
        ...props,
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          setHasFocusInside(false);
          parent.setHasFocusInside(true);
        },
      }),
    ),
  };

  return (
    <FloatingNode id={nodeId}>
      {isNested ? (
        <StyledMenuItem hasFocusInside={hasFocusInside} {...referenceProps}>
          {label}
          <BaseBox display="flex" alignItems="center">
            <ChevronRightIcon />
          </BaseBox>
        </StyledMenuItem>
      ) : (
        <Button {...referenceProps}>{label}</Button>
      )}
      <MenuContext.Provider
        value={{
          getItemProps,
          setHasFocusInside,
          isOpen,
        }}
      >
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={isNested ? -1 : 0}
                returnFocus={!isNested}
              >
                <BaseBox
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ref={refs.setFloating as any}
                  style={floatingStyles}
                  backgroundColor="popup.background.subtle"
                  padding="spacing.4"
                  {...getFloatingProps()}
                >
                  {children}
                </BaseBox>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
});

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ label, disabled, ...props }, forwardedRef) => {
  const menu = React.useContext(MenuContext);
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();

  return (
    <StyledMenuItem
      as="button"
      {...props}
      ref={useMergeRefs([item.ref, forwardedRef])}
      type="button"
      disabled={disabled}
      {...menu.getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit('click');
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
      })}
    >
      {label}
    </StyledMenuItem>
  );
});

export const Menu = React.forwardRef<
  HTMLButtonElement,
  MenuProps & React.HTMLProps<HTMLButtonElement>
>((props, ref) => {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
});
