/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  shift,
  FloatingPortal,
  arrow,
  flip,
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
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { TooltipContext } from './TooltipContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { size } from '~tokens/global';
import { useId } from '~utils/useId';
import { makeAccessible } from '~utils/makeAccessible';
import { mergeProps } from '~utils/mergeProps';
import { PopupArrow } from '~components/PopupArrow';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { componentZIndices } from '~utils/componentZIndices';
import { mergeRefs } from '~utils/useMergeRefs';

const _Tooltip: React.ForwardRefRenderFunction<HTMLElement, TooltipProps> = (
  {
    title,
    content,
    children,
    placement = 'top',
    onOpenChange,
    zIndex = componentZIndices.tooltip,
    ...incomingReferenceProps
  },
  ref,
): React.ReactElement => {
  const { theme } = useTheme();
  const id = useId();
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef<SVGSVGElement>(null);

  const GAP = theme.spacing[2];
  const [side] = getFloatingPlacementParts(placement);
  const isHorizontal = side === 'left' || side === 'right';
  const isOppositeAxis = side === 'right' || side === 'bottom';

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    strategy: 'fixed',
    onOpenChange: (open) => {
      setIsOpen(open);
      onOpenChange?.({ isOpen: open });
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

  // Cloning the trigger children to enhance it with ref and event handler
  const triggerElement = React.useMemo(() => {
    return React.cloneElement(children, {
      ...makeAccessible({ label: content }),
      ...mergeProps(
        children.props,
        getReferenceProps({ ...incomingReferenceProps, ref: mergeRefs(ref, refs.setReference) }),
      ),
    });
  }, [children, content]);

  return (
    <TooltipContext.Provider value={true}>
      {triggerElement}
      {isMounted && (
        <FloatingPortal>
          <BaseBox
            ref={refs.setFloating}
            style={floatingStyles}
            pointerEvents="none"
            zIndex={zIndex}
            {...getFloatingProps()}
            {...metaAttribute({ name: MetaConstants.Tooltip })}
          >
            <TooltipContent
              title={title}
              style={styles}
              arrow={
                <PopupArrow
                  ref={arrowRef}
                  context={context}
                  width={ARROW_WIDTH}
                  height={ARROW_HEIGHT}
                  fillColor={theme.colors.popup.background.intense}
                  strokeColor={theme.colors.popup.border.intense}
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

const Tooltip = React.forwardRef(_Tooltip);

export { Tooltip };
