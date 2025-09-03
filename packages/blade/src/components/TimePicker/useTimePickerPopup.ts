import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
  type UseFloatingOptions,
} from '@floating-ui/react';
import React from 'react';
import { spacing, size } from '~tokens/global';
import { useTheme } from '~utils';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';

type UseTimePickerPopupProps = {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean, event?: Event, reason?: string) => void;
  placement?: UseFloatingOptions['placement'];
  referenceRef: React.RefObject<HTMLElement>;
  crossAxisOffset?: number;
};

/**
 * Custom hook for TimePicker popup management
 * Similar to DatePicker's usePopup but simplified for time selection
 */
const useTimePickerPopup = ({
  isOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  referenceRef,
  crossAxisOffset = 0,
}: UseTimePickerPopupProps) => {
  const GAP = spacing[2]; // 8px gap
  const { theme } = useTheme();
  const [side] = getFloatingPlacementParts(placement);
  const isOppositeAxis = side === 'right' || side === 'bottom';

  const { refs, floatingStyles, context, placement: computedPlacement } = useFloating({
    open: isOpen,
    onOpenChange: (isOpen, event, reason) => {
      onOpenChange?.(isOpen, event, reason);
      if (reason === 'escape-key') {
        referenceRef.current?.focus();
      }
    },
    placement,
    strategy: 'fixed',
    elements: {
      reference: referenceRef.current,
    },
    middleware: [
      shift({ crossAxis: false, padding: GAP }),
      flip({ padding: GAP, fallbackAxisSideDirection: 'end' }),
      offset({ mainAxis: GAP, crossAxis: crossAxisOffset }),
    ],
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        elementResize: false,
      }),
  });

  // Animation styles
  const [computedSide] = getFloatingPlacementParts(computedPlacement);
  const computedIsHorizontal = computedSide === 'left' || computedSide === 'right';
  const animationOffset = isOppositeAxis ? -size[4] : size[4];
  
  const { isMounted, styles: animationStyles } = useTransitionStyles(context, {
    duration: theme.motion.duration.quick,
    initial: {
      opacity: 0,
      transform: `translate${computedIsHorizontal ? 'X' : 'Y'}(${animationOffset}px)`,
    },
  });

  // Interaction handlers
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return {
    refs,
    context,
    isMounted,
    floatingStyles,
    animationStyles,
    getReferenceProps,
    getFloatingProps,
  } as const;
};

export { useTimePickerPopup };
