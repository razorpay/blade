// @TODO: diff this with useFloatingMenuSetup
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
import type {
  DropdownContextType,
  UseFloatingDropdownProps,
  UseFloatingDropdownReturnType,
} from './types';
import { useControllableState } from '~utils/useControllable';
import { OVERLAY_OFFSET, OVERLAY_TRANSITION_OFFSET } from '~components/BaseMenu/tokens';
import { makeSize, useTheme } from '~utils';
import { size as sizeTokens } from '~tokens/global';

const DropdownContext = React.createContext<DropdownContextType>({
  getItemProps: () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setHasFocusInside: () => {},
  isOpen: false,
});

const useDropdown = (): DropdownContextType => {
  const contextValue = React.useContext(DropdownContext);
  return contextValue;
};

const useFloatingDropdownSetup = ({
  elementsRef,
  openInteraction,
  onOpenChange,
  isOpen,
}: UseFloatingDropdownProps): UseFloatingDropdownReturnType => {
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

  const isMenu = false;
  const width = undefined;
  const minWidth = undefined;
  const maxWidth = undefined;

  const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isControllableOpen,
    onOpenChange: (_isOpen) => setIsControllableOpen(() => _isOpen),
    placement: 'bottom-start',
    middleware: [
      offset({ mainAxis: OVERLAY_OFFSET, alignmentAxis: 0 }),
      flip(),
      shift(),
      size({
        apply({ availableHeight, elements, rects }) {
          elements.floating.style.maxHeight = `${availableHeight}px`;
          const overlayWidth = isMenu ? undefined : makeSize(rects.reference.width);
          const overlayMinWidth = isMenu ? makeSize(sizeTokens['240']) : undefined;
          const overlayMaxWidth = isMenu ? makeSize(sizeTokens['400']) : undefined;

          Object.assign(elements.floating.style, {
            // in menu, we have flexible width between min and max
            // in input triggers, we just take width of trigger
            width: width ?? overlayWidth,
            minWidth: minWidth ?? overlayMinWidth,
            maxWidth: maxWidth ?? overlayMaxWidth,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: openInteraction === 'hover',
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: true,
    ignoreMouse: false,
  });
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: false,
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

    tree.events.on('click', handleTreeClick);

    // eslint-disable-next-line consistent-return
    return () => {
      // Cleanup
      tree.events.off('click', handleTreeClick);
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
    isMounted,
    floatingTransitionStyles,
  };
};

export { DropdownContext, useDropdown, useFloatingDropdownSetup };
