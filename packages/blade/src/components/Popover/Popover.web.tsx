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
  useDismiss,
  FloatingFocusManager,
} from '@floating-ui/react';
import React from 'react';
import type { PopoverProps } from './types';
import { PopoverContent } from './PopoverContent';
import { ARROW_HEIGHT, ARROW_WIDTH, popoverZIndex } from './constants';
import { getPlacementParts } from './utils';
import { PopoverContext } from './PopoverContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { size } from '~tokens/global';
import { useControllableState } from '~utils/useControllable';
import { mergeProps } from '~utils/mergeProps';
import { PopupArrow } from '~components/PopupArrow';
import { useMergeRefs } from '~utils/useMergeRefs';

const Popover = ({
  content,
  headerTitle,
  headerLeading,
  footerContent,
  children,
  placement = 'top',
  onOpenChange,
  zIndex = popoverZIndex,
  isOpen,
  defaultIsOpen,
  initialFocusRef,
}: PopoverProps): React.ReactElement => {
  const { theme } = useTheme();
  const defaultInitialFocusRef = React.useRef<HTMLButtonElement>(null);
  const arrowRef = React.useRef<SVGSVGElement>(null);

  const GAP = theme.spacing[2];
  const [side] = getPlacementParts(placement);
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
        padding: isHorizontal ? 0 : ARROW_WIDTH,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  // we need to animate from the offset of the computed placement
  // because placement can change dynamically based on available space
  const [computedSide] = getPlacementParts(computedPlacement);
  const computedIsHorizontal = computedSide === 'left' || computedSide === 'right';
  const animationOffset = isOppositeAxis ? -size[4] : size[4];
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: theme.motion.duration.quick,
    initial: {
      opacity: 0,
      transform: `translate${computedIsHorizontal ? 'X' : 'Y'}(${animationOffset}px)`,
    },
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergeRefs(refs.setReference, triggerRef);

  const contextValue = React.useMemo(() => {
    return {
      close,
      defaultInitialFocusRef,
    };
  }, [close]);

  // Inject aria attributes to trigger
  // Doing it this way instead of makeAccessible()
  // because with makeAccessible we will need to make sure aria-controls, aria-expanded etc
  // are exposed from the trigger component prop, which we cannot ensure
  React.useLayoutEffect(() => {
    if (!triggerRef.current) return;

    const props = getReferenceProps() as Record<string, string>;
    for (const key of Object.keys(props)) {
      if (key.startsWith('aria-')) {
        triggerRef.current.setAttribute(key, props[key]);
      }
    }
  }, [getReferenceProps, triggerRef]);

  return (
    <PopoverContext.Provider value={contextValue}>
      {/* Cloning the trigger children to enhance it with ref and event handler */}
      {React.cloneElement(children, {
        ref: mergedRef,
        ...mergeProps(children.props, getReferenceProps()),
      })}
      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager
            initialFocus={initialFocusRef ?? defaultInitialFocusRef}
            context={context}
            modal={true}
            guards={true}
          >
            <BaseBox
              ref={refs.setFloating}
              style={floatingStyles}
              // TODO: Tokenize zIndex values
              zIndex={zIndex}
              {...getFloatingProps()}
              {...metaAttribute({ name: MetaConstants.Popover })}
            >
              <PopoverContent
                headerTitle={headerTitle}
                headerLeading={headerLeading}
                footerContent={footerContent}
                style={styles}
                arrow={
                  <PopupArrow
                    ref={arrowRef}
                    context={context}
                    width={ARROW_WIDTH}
                    height={ARROW_HEIGHT}
                    fillColor={theme.colors.surface.background.level2.lowContrast}
                    strokeColor={theme.colors.brand.gray[400].lowContrast}
                  />
                }
              >
                {content}
              </PopoverContent>
            </BaseBox>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </PopoverContext.Provider>
  );
};

export { Popover };
