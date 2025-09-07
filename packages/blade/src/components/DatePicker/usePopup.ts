/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { CSSProperties } from 'react';
import type {
  UseFloatingOptions,
  UseFloatingReturn,
  UseInteractionsReturn,
} from '@floating-ui/react';
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
} from '@floating-ui/react';
import { size, spacing } from '~tokens/global';
import { useTheme } from '~utils';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';

type UsePopupProps = {
  enabled?: boolean;
  open?: boolean;
  placement: UseFloatingOptions['placement'];
  onOpenChange?: UseFloatingOptions['onOpenChange'];
  referenceRef: React.RefObject<HTMLButtonElement>;
};

type UsePopupReturn = {
  refs: UseFloatingReturn['refs'];
  context: UseFloatingReturn['context'];
  isMounted: boolean;
  floatingStyles: CSSProperties;
  animationStyles: CSSProperties;
  getReferenceProps: UseInteractionsReturn['getReferenceProps'];
  getFloatingProps: UseInteractionsReturn['getFloatingProps'];
};

// 💡 Step 2: Apply the return type to the function signature
const usePopup = ({
  enabled = true,
  placement,
  open,
  onOpenChange,
  referenceRef,
}: UsePopupProps): UsePopupReturn => {
  const GAP = spacing[4];
  const { theme } = useTheme();
  const [side] = getFloatingPlacementParts(placement!);
  const isOppositeAxis = side === 'right' || side === 'bottom';

  const { refs, floatingStyles, context, placement: computedPlacement } = useFloating({
    open,
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
      offset(GAP),
    ],
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        elementResize: false,
      }),
  });

  // we need to animate from the offset of the computed placement
  // because placement can change dynamically based on available space
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

  const click = useClick(context);
  const dismiss = useDismiss(context, { enabled });
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

export { usePopup };