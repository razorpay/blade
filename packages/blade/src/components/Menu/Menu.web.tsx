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
  useListNavigation,
  useListItem,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';
import styled from 'styled-components';
import { BaseMenuItem } from '~components/BaseMenu/BaseMenuItem';
import BaseBox from '~components/Box/BaseBox';
import { Divider } from '~components/Divider';
import { ChevronRightIcon } from '~components/Icons';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import type { BladeElementRef } from '~utils/types';

const UnfocussableOverlay = styled(BaseBox)((props) => {
  return {
    '&:focus-visible': {
      outline: 'none',
    },
  };
});

const _MenuOverlay: React.ForwardRefRenderFunction<
  BladeElementRef,
  {
    children: React.ReactElement[];
  }
> = ({ children, ...props }, ref): React.ReactElement => {
  return (
    <UnfocussableOverlay
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...props}
      backgroundColor="popup.background.subtle"
      paddingX="spacing.3"
      paddingY="spacing.4"
      minWidth={makeSize(size['240'])}
      elevation="midRaised"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
    >
      {children}
    </UnfocussableOverlay>
  );
};

export const MenuOverlay = React.forwardRef(_MenuOverlay);

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
  nested?: boolean;
  children?: [React.ReactElement, React.ReactElement];
}

const useFloatingMenuSetup = ({
  elementsRef,
}: {
  elementsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

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
      offset({ mainAxis: isNested ? 12 : 0, alignmentAxis: isNested ? -16 : 0 }),
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
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
    focusItemOnHover: false,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
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

  return {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    item,
    context,
    nodeId,
    isOpen,
    floatingStyles,
    refs,
    isNested,
  };
};

export const MenuComponent = React.forwardRef<
  HTMLButtonElement,
  MenuProps & React.HTMLProps<HTMLButtonElement>
>(({ children, label, ...props }, forwardedRef) => {
  const [hasFocusInside, setHasFocusInside] = React.useState(false);

  const elementsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const labelsRef = React.useRef<(string | null)[]>([]);
  const parent = React.useContext(MenuContext);

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    item,
    refs,
    floatingStyles,
    isOpen,
    nodeId,
    isNested,
    context,
  } = useFloatingMenuSetup({
    elementsRef,
  });

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

  const floatingProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: refs.setFloating as any,
    style: floatingStyles,
    ...getFloatingProps(),
  };

  const [menuTriggerChild, menuOverlayChild] = React.Children.toArray(children) as [
    React.ReactElement,
    React.ReactElement,
  ];

  const triggerWithReferenceProps = React.cloneElement(menuTriggerChild, {
    ...menuTriggerChild.props,
    ...referenceProps,
    _hasFocusInside: hasFocusInside,
    _isMenuTrigger: true,
    _isSubmenuOpen: isOpen,
  });

  const overlayWithFloatingProps = React.cloneElement(menuOverlayChild, {
    ...menuOverlayChild.props,
    ...floatingProps,
  });

  return (
    <FloatingNode id={nodeId}>
      <MenuContext.Provider
        value={{
          getItemProps,
          setHasFocusInside,
          isOpen,
        }}
      >
        {triggerWithReferenceProps}
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={-1}
                returnFocus={!isNested}
              >
                {overlayWithFloatingProps}
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
});

export const MenuDivider = (): React.ReactElement => {
  return <Divider marginLeft="-8px" marginY="spacing.1" marginRight="-8px" />;
};

interface MenuItemProps {
  label: string;
  disabled?: boolean;
  onClick?: (event: any) => void;
  onFocus?: (event: any) => void;
  _hasFocusInside?: boolean;
  _isMenuTrigger?: boolean;
  _isSubmenuOpen?: boolean;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    { label, disabled, _isMenuTrigger, _hasFocusInside, _isSubmenuOpen, ...props },
    forwardedRef,
  ) => {
    const menu = React.useContext(MenuContext);
    const item = useListItem({ label: disabled ? null : label });
    const tree = useFloatingTree();

    return (
      <BaseMenuItem
        title={label}
        trailing={
          _isMenuTrigger ? <ChevronRightIcon color="interactive.icon.gray.muted" /> : undefined
        }
        as="button"
        className={_isSubmenuOpen ? 'has-submenu-open' : ''}
        {...props}
        ref={useMergeRefs([item.ref, forwardedRef])}
        isDisabled={disabled}
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
