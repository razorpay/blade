/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { Alignment, Side } from '@floating-ui/react';
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
} from '@floating-ui/react';
import React from 'react';
import { TooltipProps } from './types';
import { TooltipContent } from './TooltipContent';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils';
import { useId } from '~src/hooks/useId';
import { size } from '~tokens/global';

const Tooltip = ({
  content,
  children,
  placement = 'top',
  onOpenChange,
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const id = useId();
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef<SVGSVGElement>(null);

  const GAP = theme.spacing[2];
  const [side, alignment] = placement.split('-') as [Side, Alignment];
  const isHorizontal = side === 'left' || side === 'right';
  const isCrossAxis = side === 'right' || side === 'bottom';
  const hasAlignment = alignment === 'start' || alignment === 'end';

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
  });

  const animationOffset = isCrossAxis ? -size[4] : size[4];
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
    <>
      {React.cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
        ...makeAccessible({ label: content }),
      })}
      {isMounted && (
        <FloatingPortal>
          <BaseBox
            ref={refs.setFloating}
            style={floatingStyles}
            pointerEvents="none"
            {...getFloatingProps()}
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
                  // by default the floating UI will always try to position
                  // the content within the bounding box of reference
                  // this causes the arrow to be always in the middle
                  // this overriding the staticOffset to ensure the
                  // left/right positioned trigger arrow will be properly positioned
                  staticOffset={hasAlignment ? ARROW_WIDTH : undefined}
                />
              }
            >
              {content}
            </TooltipContent>
          </BaseBox>
        </FloatingPortal>
      )}
    </>
  );
};

export { Tooltip, TooltipProps };
