/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  shift,
  FloatingPortal,
  arrow,
  flip,
  offset,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
  autoUpdate,
  useClick,
  FloatingFocusManager,
} from '@floating-ui/react';
import React from 'react';
import { PopoverContent } from '../Popover/PopoverContent';
import { ARROW_HEIGHT, ARROW_WIDTH, popoverZIndex } from '../Popover/constants';
import { PopoverContext } from '../Popover/PopoverContext';
import { transitionDelay } from './tourTokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { size } from '~tokens/global';
import { useControllableState } from '~utils/useControllable';
import { PopupArrow } from '~components/PopupArrow';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import type { PopoverProps } from '~components/Popover';

type TourPopoverProps = Omit<PopoverProps, 'children' | 'initialFocusRef'> & {
  attachTo: React.RefObject<HTMLElement> | undefined;
  isTransitioning: boolean;
};

// TODO: Refactor out Popover/FloatingUI logic to a reusable hook/component later on
const TourPopover = ({
  attachTo,
  content,
  title,
  titleLeading,
  footer,
  placement = 'top',
  onOpenChange,
  zIndex = popoverZIndex,
  isOpen,
  defaultIsOpen,
  isTransitioning,
}: TourPopoverProps): React.ReactElement => {
  const { theme } = useTheme();
  const defaultInitialFocusRef = React.useRef<HTMLButtonElement>(null);
  const arrowRef = React.useRef<SVGSVGElement>(null);
  const titleId = useId('popover-title');

  const GAP = theme.spacing[4];
  const [side] = getFloatingPlacementParts(placement);
  const isHorizontal = side === 'left' || side === 'right';
  const isOppositeAxis = side === 'right' || side === 'bottom';

  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => onOpenChange?.({ isOpen }),
  });

  const { refs, floatingStyles, context, placement: computedPlacement } = useFloating({
    open: controllableIsOpen,
    onOpenChange: (isOpen) => controllableSetIsOpen(() => isOpen),
    placement,
    strategy: 'fixed',
    middleware: [
      shift({ crossAxis: false, padding: GAP }),
      flip({ padding: GAP, fallbackAxisSideDirection: 'end' }),
      offset(GAP + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? GAP + ARROW_HEIGHT : ARROW_WIDTH,
      }),
    ],
    transform: true,
    whileElementsMounted: autoUpdate,
  });

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  // we need to animate from the offset of the computed placement
  // because placement can change dynamically based on available space
  const [computedSide] = getFloatingPlacementParts(computedPlacement);
  const computedIsHorizontal = computedSide === 'left' || computedSide === 'right';
  const animationOffset = isOppositeAxis ? -size[4] : size[4];

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: {
      open: transitionDelay,
      close: theme.motion.duration.xquick,
    },
    initial: {
      opacity: 0,
      transform: `translate${computedIsHorizontal ? 'X' : 'Y'}(${animationOffset}px)`,
    },
  });

  // remove click handler if popover is controlled
  const isControlled = isOpen !== undefined;
  const click = useClick(context, { enabled: !isControlled });
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, role]);

  const contextValue = React.useMemo(() => {
    return {
      close,
      defaultInitialFocusRef,
      titleId,
    };
  }, [close, titleId]);

  // https://github.com/floating-ui/floating-ui/discussions/2352#discussioncomment-6044834
  React.useLayoutEffect(() => {
    window.setTimeout(() => {
      if (!attachTo) return;
      refs.setReference(attachTo.current);
      refs.setPositionReference(attachTo.current);
    });
  }, [attachTo, refs, isOpen]);

  return (
    <PopoverContext.Provider value={contextValue}>
      <FloatingPortal>
        <FloatingFocusManager
          // TODO: check if isTransitioning is enough since scrolling can take longer
          disabled={isOpen === false || !isMounted || isTransitioning}
          initialFocus={defaultInitialFocusRef}
          context={context}
          modal={true}
          guards={true}
        >
          {isMounted ? (
            <BaseBox
              ref={refs.setFloating}
              style={{ ...floatingStyles, pointerEvents: isMounted ? 'auto' : 'none' }}
              // TODO: Tokenize zIndex values
              zIndex={zIndex}
              {...getFloatingProps()}
              {...metaAttribute({ name: MetaConstants.TourPopover })}
              {...makeAccessible({ labelledBy: titleId })}
            >
              <PopoverContent
                title={title}
                titleLeading={titleLeading}
                footer={footer}
                style={styles}
                arrow={
                  <PopupArrow
                    ref={arrowRef}
                    context={context}
                    width={ARROW_WIDTH}
                    height={ARROW_HEIGHT}
                    fillColor={theme.colors.popup.background.subtle}
                    strokeColor={theme.colors.popup.border.subtle}
                  />
                }
              >
                {content}
              </PopoverContent>
            </BaseBox>
          ) : (
            <></>
          )}
        </FloatingFocusManager>
      </FloatingPortal>
    </PopoverContext.Provider>
  );
};

export { TourPopover };
