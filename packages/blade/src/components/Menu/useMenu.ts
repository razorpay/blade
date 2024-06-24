import React from 'react';
import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size,
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
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import type { MenuContextType, UseFloatingMenuProps, UseFloatingMenuReturnType } from './types';
import { useControllableState } from '~utils/useControllable';
import { OVERLAY_OFFSET, OVERLAY_TRANSITION_OFFSET } from '~components/BaseMenu/tokens';
import { makeSize, useTheme } from '~utils';

const MenuContext = React.createContext<MenuContextType>({
  getItemProps: () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setHasFocusInside: () => {},
  isOpen: false,
});

const useMenu = (): MenuContextType => {
  const contextValue = React.useContext(MenuContext);
  return contextValue;
};

const useFloatingMenuSetup = ({
  elementsRef,
  openInteraction,
  onOpenChange,
  isOpen,
}: UseFloatingMenuProps): UseFloatingMenuReturnType => {
  const [isControllableOpen, setIsControllableOpen] = useControllableState({
    value: isOpen,
    defaultValue: false,
    onChange: (isOpen) => onOpenChange?.({ isOpen }),
  });
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();
  const { theme } = useTheme();

  const isNested = parentId != null;

  const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isControllableOpen,
    onOpenChange: (_isOpen) => setIsControllableOpen(() => _isOpen),
    placement: isNested ? 'right-start' : 'bottom-start',
    middleware: [
      offset({ mainAxis: isNested ? 12 : OVERLAY_OFFSET, alignmentAxis: isNested ? -16 : 0 }),
      flip(),
      shift(),
      size({
        apply({ availableHeight, elements }) {
          elements.floating.style.maxHeight = `${availableHeight}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: isNested || openInteraction === 'hover',
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

  const { isMounted, styles: floatingTransitionStyles } = useTransitionStyles(context, {
    duration: theme.motion.duration.quick,
    initial: ({ side }) => {
      const transitionOffset = makeSize(OVERLAY_TRANSITION_OFFSET);
      const transformMap = {
        top: `translateY(${transitionOffset})`,
        right: `translateX(-${transitionOffset})`,
        left: `translateX(${transitionOffset})`,
        bottom: `translateY(-${transitionOffset})`,
      } as const;

      return {
        transform: transformMap[side ?? 'bottom'],
        opacity: 0,
      };
    },
  });

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    const handleTreeClick = (): void => {
      setIsControllableOpen(() => false);
    };

    const onSubMenuOpen = (event: { nodeId: string; parentId: string }): void => {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsControllableOpen(() => false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    isOpen: isControllableOpen,
    floatingStyles,
    refs,
    isNested,
    isMounted,
    floatingTransitionStyles,
  };
};

export { MenuContext, useMenu, useFloatingMenuSetup };
