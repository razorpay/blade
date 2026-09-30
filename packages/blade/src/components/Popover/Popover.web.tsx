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
  useHover,
  useDismiss,
  useDelayGroup,
  FloatingFocusManager,
} from '@floating-ui/react';
import type { FloatingContext, OpenChangeReason } from '@floating-ui/react';
import React from 'react';
import type { PopoverProps } from './types';
import { PopoverContent } from './PopoverContent';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { PopoverContext } from './PopoverContext';
import { componentIds } from './componentIds';
import { useTheme } from '~components/BladeProvider';
import { TopNavOverlayThemeOverride } from '~components/TopNav/TopNavOverlayThemeOverride';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { size } from '~tokens/global';
import { useControllableState } from '~utils/useControllable';
import { mergeProps } from '~utils/mergeProps';
import { PopupArrow } from '~components/PopupArrow';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { OverlayContextReset } from '~components/OverlayContextReset';

const noop = (): void => undefined;

/**
 * Hover popovers join BladeProvider's `FloatingDelayGroup`, the group every Tooltip is in, so
 * moving the pointer between hover overlays switches them in place: opening one closes whichever
 * one is showing, the replaced one disappears without fading out, and the new one appears without
 * fading in (see the transition in Popover). Click popovers stay out of the group: hovering a
 * tooltip must not close a popover someone opened on purpose.
 *
 * Works for controlled popovers too: being replaced calls `onOpenChange({ isOpen: false })`.
 */
const useHoverPopoverDelayGroup = ({
  context,
  isEnabled,
}: {
  context: FloatingContext;
  isEnabled: boolean;
}): ReturnType<typeof useDelayGroup> => {
  const { open, onOpenChange, floatingId } = context;
  // The group closes every member that is not the current one, and it can do so before an opening
  // popover has claimed the group (a popover mounted open, or opened in the same update another
  // member is still current). Such a close is ignored until this popover has been current once
  const hasClaimedGroupRef = React.useRef(false);
  const handleGroupOpenChange = React.useCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason): void => {
      if (!nextOpen && !hasClaimedGroupRef.current) {
        return;
      }
      onOpenChange(nextOpen, event, reason);
    },
    [onOpenChange],
  );

  const group = useDelayGroup(
    {
      ...context,
      open: isEnabled && open,
      onOpenChange: isEnabled ? handleGroupOpenChange : noop,
    },
    { id: floatingId },
  );

  React.useLayoutEffect(() => {
    if (!open) {
      hasClaimedGroupRef.current = false;
    } else if (group.currentId === floatingId) {
      hasClaimedGroupRef.current = true;
    }
  }, [open, group.currentId, floatingId]);

  return group;
};

const _Popover = ({
  content,
  title,
  titleLeading,
  footer,
  children,
  placement = 'top',
  onOpenChange,
  zIndex = componentZIndices.popover,
  isOpen,
  defaultIsOpen,
  initialFocusRef,
  openInteraction = 'click',
  maxWidth,
  ...rest
}: PopoverProps): React.ReactElement => {
  const { theme } = useTheme();
  const defaultInitialFocusRef = React.useRef<HTMLButtonElement>(null);
  const arrowRef = React.useRef<SVGSVGElement>(null);
  const titleId = useId('popover-title');

  const GAP = theme.spacing[2];
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
    whileElementsMounted: autoUpdate,
  });

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  const isHoverPopover = openInteraction === 'hover';
  const { isInstantPhase, currentId } = useHoverPopoverDelayGroup({
    context,
    isEnabled: isHoverPopover,
  });

  // we need to animate from the offset of the computed placement
  // because placement can change dynamically based on available space
  const [computedSide] = getFloatingPlacementParts(computedPlacement);
  const computedIsHorizontal = computedSide === 'left' || computedSide === 'right';
  const animationOffset = isOppositeAxis ? -size[4] : size[4];
  const { isMounted, styles } = useTransitionStyles(context, {
    // While the pointer moves from one hover overlay to the next, swap them without animating:
    // the replaced one disappears at once and the new one appears in place. Only the first one of
    // the streak fades in and the last one fades out (the same as Tooltip)
    duration:
      isHoverPopover && isInstantPhase
        ? {
            open: 0,
            close: currentId === context.floatingId ? theme.motion.duration.quick : 0,
          }
        : theme.motion.duration.quick,
    initial: {
      opacity: 0,
      transform: `translate${computedIsHorizontal ? 'X' : 'Y'}(${animationOffset}px)`,
    },
  });

  // remove click handler if popover is controlled
  const isControlled = isOpen !== undefined;
  const click = useClick(context, { enabled: !isControlled && openInteraction === 'click' });
  const hover = useHover(context, {
    enabled: !isControlled && isHoverPopover,
    // A short close delay keeps this popover current until the next hover overlay opens, so the
    // next one replaces it in place (see useHoverPopoverDelayGroup). It is cancelled when the
    // pointer enters the popover itself
    delay: { open: 0, close: theme.motion.delay['2xquick'] },
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role, hover]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergeRefs(refs.setReference, triggerRef);

  const contextValue = React.useMemo(() => {
    return {
      close,
      defaultInitialFocusRef,
      titleId,
      openInteraction,
    };
  }, [close, titleId, openInteraction]);

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
          <OverlayContextReset>
            <FloatingFocusManager
              initialFocus={
                initialFocusRef ?? (openInteraction === 'hover' ? -1 : defaultInitialFocusRef)
              }
              context={context}
              // A hover popover is a preview the pointer rests on: it must not trap focus or hide
              // the rest of the page from assistive tech (modal marks everything else aria-hidden)
              modal={!isHoverPopover}
              guards={true}
            >
              <TopNavOverlayThemeOverride>
                <BaseBox
                  ref={refs.setFloating}
                  style={floatingStyles}
                  // TODO: Tokenize zIndex values
                  zIndex={zIndex}
                  {...getFloatingProps()}
                  {...metaAttribute({ name: MetaConstants.Popover })}
                  {...makeAccessible({ labelledBy: titleId })}
                  {...makeAnalyticsAttribute(rest)}
                >
                  <PopoverContent
                    title={title}
                    titleLeading={titleLeading}
                    footer={footer}
                    style={styles}
                    maxWidth={maxWidth}
                    arrow={
                      <PopupArrow
                        ref={arrowRef}
                        context={context}
                        width={ARROW_WIDTH}
                        height={ARROW_HEIGHT}
                        fillColor={theme.colors.popup.background.gray.moderate}
                        strokeColor={theme.colors.popup.border.gray.moderate}
                        strokeWidth={theme.border.width.thin}
                        style={{ transform: 'translateY(-1px)' }}
                      />
                    }
                  >
                    {content}
                  </PopoverContent>
                </BaseBox>
              </TopNavOverlayThemeOverride>
            </FloatingFocusManager>
          </OverlayContextReset>
        </FloatingPortal>
      )}
    </PopoverContext.Provider>
  );
};

const Popover = assignWithoutSideEffects(_Popover, {
  componentId: componentIds.Popover,
});

export { Popover };
