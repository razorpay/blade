/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import type { Side } from '@floating-ui/react';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PopoverContent } from '../Popover/PopoverContent';
import { ARROW_HEIGHT, ARROW_WIDTH } from '../Popover/constants';
import { PopoverContext } from '../Popover/PopoverContext';
import { useFloatingPortal } from '../Popover/useFloatingPortal.native';
import { transitionDelay } from './tourTokens';
import type { TourElement } from './TourContext';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useControllableState } from '~utils/useControllable';
import { PopupArrow } from '~components/PopupArrow';
import { useId } from '~utils/useId';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import type { PopoverProps } from '~components/Popover';
import { componentZIndices } from '~utils/componentZIndices';

/** Sentinel used when floating-ui has not yet computed a position */
const UNSET_POSITION = -200;

/** After this, reveal anyway so a failed measure never leaves the popover invisible */
const FORCE_REVEAL_MS = 120;

type TourPopoverProps = Omit<PopoverProps, 'children' | 'initialFocusRef'> & {
  attachTo: React.RefObject<TourElement> | undefined;
};

type PositionCoords = {
  left: number;
  top: number;
};

type FallbackPosition = PositionCoords & {
  side: Side;
};

type MeasurableHost = {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

const computeFallbackPosition = (
  rect: { x: number; y: number; width: number; height: number },
  side: Side,
  gap: number,
): FallbackPosition => {
  const offsetGap = gap + ARROW_HEIGHT;
  const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
  const estimatedPopoverHeight = 220;
  const estimatedPopoverWidth = Math.min(300, windowWidth - 24);
  const statusPad = 48;
  const edgePad = 12;

  const bySide = (resolvedSide: Side): PositionCoords => {
    switch (resolvedSide) {
      case 'bottom':
        return {
          left: Math.min(
            Math.max(edgePad, rect.x),
            Math.max(edgePad, windowWidth - estimatedPopoverWidth - edgePad),
          ),
          top: rect.y + rect.height + offsetGap,
        };
      case 'left':
        return {
          left: rect.x - estimatedPopoverWidth - offsetGap,
          top: rect.y,
        };
      case 'right':
        return {
          left: rect.x + rect.width + offsetGap,
          top: rect.y,
        };
      case 'top':
      default:
        return {
          left: Math.min(
            Math.max(edgePad, rect.x),
            Math.max(edgePad, windowWidth - estimatedPopoverWidth - edgePad),
          ),
          top: rect.y - estimatedPopoverHeight - offsetGap,
        };
    }
  };

  const hasHorizontalRoom = (resolvedSide: Side): boolean => {
    if (resolvedSide === 'left') {
      return rect.x - offsetGap - estimatedPopoverWidth >= edgePad;
    }
    if (resolvedSide === 'right') {
      return rect.x + rect.width + offsetGap + estimatedPopoverWidth <= windowWidth - edgePad;
    }
    return true;
  };

  const hasVerticalRoom = (resolvedSide: Side): boolean => {
    if (resolvedSide === 'bottom') {
      return rect.y + rect.height + offsetGap + estimatedPopoverHeight <= windowHeight - edgePad;
    }
    if (resolvedSide === 'top') {
      return rect.y - offsetGap - estimatedPopoverHeight >= statusPad;
    }
    return true;
  };

  /** Axis-aligned overlap between estimated popover box and the spotlight rect */
  const overlapsTarget = (position: PositionCoords): boolean => {
    const popoverLeft = position.left;
    const popoverTop = position.top;
    const popoverRight = position.left + estimatedPopoverWidth;
    const popoverBottom = position.top + estimatedPopoverHeight;
    return !(
      popoverRight <= rect.x ||
      popoverLeft >= rect.x + rect.width ||
      popoverBottom <= rect.y ||
      popoverTop >= rect.y + rect.height
    );
  };

  let resolvedSide = side;

  // Phones rarely have room for left/right — flip to a vertical side early
  if ((resolvedSide === 'left' || resolvedSide === 'right') && !hasHorizontalRoom(resolvedSide)) {
    resolvedSide = hasVerticalRoom('bottom') ? 'bottom' : 'top';
  }

  // Flip vertical when preferred side is short on space
  if (resolvedSide === 'bottom' && !hasVerticalRoom('bottom') && hasVerticalRoom('top')) {
    resolvedSide = 'top';
  } else if (resolvedSide === 'top' && !hasVerticalRoom('top') && hasVerticalRoom('bottom')) {
    resolvedSide = 'bottom';
  }

  let position = bySide(resolvedSide);

  // If still overlapping (tall popover / tight layout), prefer the other vertical side
  if (overlapsTarget(position)) {
    const alt = resolvedSide === 'top' ? 'bottom' : 'top';
    if (hasVerticalRoom(alt) || !hasVerticalRoom(resolvedSide)) {
      resolvedSide = alt;
      position = bySide(alt);
    }
  }

  // Soft-clamp ONLY when it does not cover the cutout (prevents the old clamp-over-target bug)
  const softClamped: PositionCoords = {
    left: Math.min(
      Math.max(edgePad, position.left),
      Math.max(edgePad, windowWidth - estimatedPopoverWidth - edgePad),
    ),
    top: Math.min(
      Math.max(statusPad, position.top),
      Math.max(statusPad, windowHeight - estimatedPopoverHeight - edgePad),
    ),
  };

  if (!overlapsTarget(softClamped)) {
    return { left: softClamped.left, top: softClamped.top, side: resolvedSide };
  }

  // Clamp would cover the target — keep the non-overlapping placement even if partially off-screen
  return {
    left: position.left,
    top: position.top,
    side: resolvedSide,
  };
};

const TourPopover = ({
  attachTo,
  content,
  title,
  titleLeading,
  footer,
  placement = 'top',
  onOpenChange,
  zIndex = componentZIndices.popover,
  isOpen,
  defaultIsOpen,
}: TourPopoverProps): React.ReactElement => {
  const { theme } = useTheme();
  const defaultInitialFocusRef = React.useRef(null);
  const arrowRef = React.useRef(null);
  const titleId = useId('popover-title');

  const GAP = theme.spacing[4];
  const [side] = getFloatingPlacementParts(placement);
  const isHorizontal = side === 'left' || side === 'right';

  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (open) => onOpenChange?.({ isOpen: open }),
  });

  const context = useFloating({
    sameScrollView: false,
    placement,
    middleware: [
      shift({ crossAxis: false, padding: GAP }),
      flip({ padding: GAP, fallbackAxisSideDirection: 'end' }),
      offset(GAP + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? GAP + ARROW_HEIGHT : ARROW_WIDTH,
      }),
    ],
  });

  const { refs, floatingStyles, update } = context;
  const [computedSide] = getFloatingPlacementParts(context.placement);
  const [fallbackPosition, setFallbackPosition] = React.useState<FallbackPosition | null>(null);
  const [forceReveal, setForceReveal] = React.useState(false);

  const [isVisible, setIsVisible] = React.useState(() => Boolean(controllableIsOpen));
  const { backdropRef, backdropOffset, onBackdropLayout } = useFloatingPortal(update, isVisible);

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  const measureFallbackFromAttachTo = React.useCallback(() => {
    const host = attachTo?.current as MeasurableHost | null | undefined;
    if (!host || typeof host.measureInWindow !== 'function') {
      return;
    }

    host.measureInWindow((x, y, width, height) => {
      if (width === 0 && height === 0) {
        return;
      }
      setFallbackPosition(computeFallbackPosition({ x, y, width, height }, side, GAP));
      update();
    });
  }, [GAP, attachTo, side, update]);

  // wait for animation to finish before unmounting (matches gentle open duration)
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (!controllableIsOpen) {
        setIsVisible(false);
        setFallbackPosition(null);
        setForceReveal(false);
      }
    }, transitionDelay);

    if (controllableIsOpen) {
      setIsVisible(true);
    }
    return () => clearTimeout(id);
  }, [controllableIsOpen]);

  // Attach floating reference to the active tour step (external attachTo — not a child trigger)
  React.useLayoutEffect(() => {
    if (!attachTo?.current) return;
    refs.setReference(attachTo.current as never);
    update();
    // Priming fallback in case floating-ui never settles (common with portal + external refs)
    measureFallbackFromAttachTo();
  }, [attachTo, refs, isOpen, update, measureFallbackFromAttachTo]);

  // Keep position updates in sync after open (re-measure once layout settles — don't delay first paint)
  React.useEffect(() => {
    if (!controllableIsOpen) return undefined;
    const id = setTimeout(() => {
      update();
      measureFallbackFromAttachTo();
    }, 32);
    return () => clearTimeout(id);
  }, [controllableIsOpen, update, attachTo, measureFallbackFromAttachTo]);

  // If floating styles remain at the unset sentinel, keep retrying measure-based fallback
  React.useEffect(() => {
    if (!controllableIsOpen || !isVisible) return undefined;

    const floatingLeft = floatingStyles.left;
    const floatingTop = floatingStyles.top;
    const stillUnset =
      (floatingLeft === undefined || floatingLeft === null || floatingLeft === UNSET_POSITION) &&
      (floatingTop === undefined || floatingTop === null || floatingTop === UNSET_POSITION);

    if (!stillUnset) {
      return undefined;
    }

    const timers = [16, 48, 96].map((delay) =>
      setTimeout(() => {
        measureFallbackFromAttachTo();
        update();
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [
    controllableIsOpen,
    floatingStyles.left,
    floatingStyles.top,
    isVisible,
    measureFallbackFromAttachTo,
    update,
  ]);

  // Escape hatch: never leave first open stuck at opacity 0 if measure stalls
  React.useEffect(() => {
    if (!controllableIsOpen) {
      setForceReveal(false);
      return undefined;
    }
    const id = setTimeout(() => setForceReveal(true), FORCE_REVEAL_MS);
    return () => clearTimeout(id);
  }, [controllableIsOpen]);

  const contextValue = React.useMemo(() => {
    return {
      close,
      defaultInitialFocusRef,
      titleId,
      openInteraction: 'click' as const,
    };
  }, [close, defaultInitialFocusRef, titleId]);

  const resolvedLeft = floatingStyles.left ?? fallbackPosition?.left ?? UNSET_POSITION;
  const resolvedTop = floatingStyles.top ?? fallbackPosition?.top ?? UNSET_POSITION;

  // Prefer measureInWindow fallback whenever available. floating-ui often returns a
  // non-sentinel but wrong position when the reference lives under an RN Modal overlay.
  const useFallback = fallbackPosition !== null;

  const popoverLeft = (useFallback ? fallbackPosition.left : resolvedLeft) - backdropOffset.x;
  // Modal host matches measureInWindow coords — no iOS portal offset correction needed
  const popoverTop = (useFallback ? fallbackPosition.top : resolvedTop) - backdropOffset.y;

  // Wait for measureInWindow fallback before fading in. floating-ui under RN Modal often
  // returns a non-sentinel but wrong placement — revealing then would snap when fallback lands.
  // forceReveal covers stalled measure so the popover never stays invisible.
  // Web: useTransitionStyles fades after Floating UI has a placement (TourPopover.web).
  const isPositionReady = useFallback || forceReveal;
  const shouldRevealContent = Boolean(controllableIsOpen) && isPositionReady;

  return (
    <PopoverContext.Provider value={contextValue}>
      {isVisible ? (
        <PopoverContext.Provider value={contextValue}>
          {/*
            Host must sit ABOVE TourMask (zIndex 1099). Mask dim rects use pointerEvents="auto"
            and cover the screen outside the cutout — without a higher host zIndex they swallow
            taps on Next/Prev/Done/Close (popover sits outside the spotlight).

            Do NOT put makeAccessible/accessible on this absoluteFill host: accessible={true}
            flattens descendants into one a11y node and blocks nested Button presses on iOS.
          */}
          <View
            ref={backdropRef as never}
            onLayout={onBackdropLayout}
            style={[StyleSheet.absoluteFill, { zIndex }]}
            pointerEvents="box-none"
            {...metaAttribute({ name: MetaConstants.TourPopover })}
          >
            <PopoverContent
              title={title}
              titleLeading={titleLeading}
              footer={footer}
              // Gate fade+slide until measured so we don't open at UNSET_POSITION (-200) then snap
              isVisible={shouldRevealContent}
              // Match TourPopover.web useTransitionStyles open duration (transitionDelay = gentle)
              animationDuration={transitionDelay}
              ref={refs.setFloating as never}
              side={useFallback ? fallbackPosition.side : computedSide}
              style={{
                ...floatingStyles,
                left: popoverLeft,
                top: popoverTop,
                zIndex,
              }}
              arrow={
                <PopupArrow
                  ref={arrowRef as never}
                  context={context}
                  width={ARROW_WIDTH}
                  height={ARROW_HEIGHT}
                  fillColor={theme.colors.popup.background.gray.subtle}
                  strokeColor={theme.colors.popup.border.subtle}
                />
              }
            >
              {content}
            </PopoverContent>
          </View>
        </PopoverContext.Provider>
      ) : null}
    </PopoverContext.Provider>
  );
};

export { TourPopover };
