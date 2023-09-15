/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  shift,
  FloatingPortal,
  arrow,
  flip,
  FloatingArrow,
  offset,
  useDelayGroup,
  useDelayGroupContext,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
  autoUpdate,
} from '@floating-ui/react';
import React from 'react';
import type { TooltipProps } from './types';
import { TooltipContent } from './TooltipContent';
import { ARROW_HEIGHT, ARROW_WIDTH, tooltipZIndex } from './constants';
import { getPlacementParts, mergeProps } from './utils';
import { TooltipContext } from './TooltipContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { size } from '~tokens/global';
import { useId } from '~utils/useId';
import { makeAccessible } from '~utils/makeAccessible';

const Tooltip = ({
  content,
  children,
  placement = 'top',
  onOpenChange,
  zIndex = tooltipZIndex,
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const id = useId();
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef<SVGSVGElement>(null);

  const GAP = theme.spacing[2];
  const [side] = getPlacementParts(placement);
  const isHorizontal = side === 'left' || side === 'right';
  const isOppositeAxis = side === 'right' || side === 'bottom';

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    strategy: 'fixed',
    onOpenChange: (open) => {
      if (open) {
        setIsOpen(true);
        onOpenChange?.({ isOpen: open });
      } else {
        setIsOpen(false);
        onOpenChange?.({ isOpen: open });
      }
    },
    middleware: [
      shift({ crossAxis: false, padding: GAP }),
      flip({ padding: GAP }),
      offset(GAP + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? 0 : ARROW_WIDTH,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const animationOffset = isOppositeAxis ? -size[4] : size[4];
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: theme.motion.duration.quick,
    initial: {
      opacity: 0,
      transform: `translate${isHorizontal ? 'X' : 'Y'}(${animationOffset}px)`,
    },
  });

  useDelayGroup(context, { id });
  const { delay } = useDelayGroupContext();
  const hover = useHover(context, {
    delay,
    move: false,
  });
  const focus = useFocus(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([role, hover, focus]);

  return (
    <TooltipContext.Provider value={true}>
      {/* Cloning the trigger children to enhance it with ref and event handler */}
      {React.cloneElement(children, {
        ref: refs.setReference,
        ...mergeProps(children.props, getReferenceProps()),
        ...makeAccessible({ label: content }),
      })}
      {isMounted && (
        <FloatingPortal>
          <BaseBox
            ref={refs.setFloating}
            style={floatingStyles}
            pointerEvents="none"
            // TODO: Tokenize zIndex values
            zIndex={zIndex}
            {...getFloatingProps()}
            {...metaAttribute({ name: MetaConstants.Tooltip })}
          >
            <TooltipContent
              style={styles}
              arrow={
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  width={ARROW_WIDTH}
                  height={ARROW_HEIGHT}
                  fill={theme.colors.brand.gray[200].highContrast}
                  stroke={theme.colors.brand.gray[300].highContrast}
                  strokeWidth={theme.border.width.thin}
                />
              }
            >
              {content}
            </TooltipContent>
          </BaseBox>
        </FloatingPortal>
      )}
    </TooltipContext.Provider>
  );
};

export { Tooltip };
