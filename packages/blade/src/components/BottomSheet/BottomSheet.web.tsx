/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { rubberbandIfOutOfBounds, useDrag } from '@use-gesture/react';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetBody } from './BottomSheetBody';
import type { SnapPoints } from './utils';
import { computeMaxContent, computeSnapPointBounds } from './utils';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetContext, useDropdownBottomSheetContext } from './BottomSheetContext';
import { ComponentIds } from './componentIds';
import { BottomSheetProps } from './types';
import { BottomSheetCloseButton } from './BottomSheetCloseButton';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime, makeSpace } from '~utils';

import { useScrollLock } from '~src/hooks/useScrollLock';
import { useWindowSize } from '~src/hooks/useWindowSize';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

export const BOTTOM_SHEET_EASING = 'cubic-bezier(.15,0,.24,.97)';

const BottomSheetSurface = styled.div<{
  windowHeight: number;
  isOpen: boolean;
  isDragging: boolean;
}>(({ theme, windowHeight, isOpen, isDragging }) => {
  const offsetX = theme.shadows.offsetX.level[1];
  const offsetY = theme.shadows.offsetY.level[1];
  const blur = theme.shadows.blurRadius.level[1];
  const shadowColor = theme.shadows.color.level[1];

  const shadow1 = `${offsetX}px ${offsetY}px ${blur}px 0px ${shadowColor}`;
  const shadow2 = `0px 0px 1px 0px ${shadowColor}`;

  return {
    background: theme.colors.surface.background.level2.lowContrast,
    // TODO: we do not have 16px radius token
    borderTopLeftRadius: makeSpace(theme.spacing[5]),
    borderTopRightRadius: makeSpace(theme.spacing[5]),
    borderColor: theme.colors.surface.border.normal.lowContrast,
    boxShadow: `${shadow1}, ${shadow2}`,

    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'all' : 'none',
    transitionDuration: isDragging
      ? undefined
      : `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: BOTTOM_SHEET_EASING,
    willChange: 'transform, opacity, height',
    transitionProperty: 'transform, opacity, height',

    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    top: windowHeight,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none',
    overflow: 'hidden',
    zIndex: 2,
  };
});

const _BottomSheet = ({
  isOpen,
  onDismiss,
  children,
  snapPoints = [0.35, 0.5, 0.85],
}: BottomSheetProps): React.ReactElement => {
  const dimensions = useWindowSize();
  const [contentHeight, setContentHeight] = React.useState(0);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [footerHeight, setFooterHeight] = React.useState(0);

  const dropdownBottomSheetProps = useDropdownBottomSheetContext();
  const [posY, _setPosY] = React.useState(0);
  const [_isOpen, setIsOpen] = React.useState(dropdownBottomSheetProps?.isOpen || isOpen);
  const [isDragging, setIsDragging] = React.useState(false);

  const preventScrollingRef = React.useRef(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const grabHandleRef = React.useRef<HTMLDivElement>(null);
  const originalFocusElement = React.useRef<HTMLElement>(null);

  const setPosY = React.useCallback(
    (value: number, limit = true) => {
      const maxValue = computeMaxContent({
        contentHeight,
        footerHeight,
        headerHeight,
        maxHeight: value,
      });
      _setPosY(limit ? maxValue : value);
    },
    [contentHeight, footerHeight, headerHeight],
  );

  const scrollLockRef = useScrollLock({
    enabled: true,
    reserveScrollBarGap: true,
    targetRef: scrollRef,
  });

  // take the grabHandle's height into headerHeight too
  useIsomorphicLayoutEffect(() => {
    setHeaderHeight((prev) => {
      if (!grabHandleRef.current) return prev;
      return prev + grabHandleRef.current.getBoundingClientRect().height;
    });
  }, [grabHandleRef, _isOpen]);

  const returnFocus = React.useCallback(() => {
    if (!originalFocusElement.current) return;
    originalFocusElement.current.focus();
  }, [originalFocusElement]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    setPosY(0);
    returnFocus();
    // close the select dropdown as well
    dropdownBottomSheetProps?.setIsOpen(false);
    scrollLockRef.current.deactivate();
    onDismiss?.();
  }, [setPosY, returnFocus, dropdownBottomSheetProps, scrollLockRef, onDismiss]);

  const open = React.useCallback(() => {
    setIsOpen(true);
    setPosY(dimensions.height * 0.5);
    scrollLockRef.current.activate();
    // @ts-expect-error this is a mutable ref
    originalFocusElement.current = originalFocusElement.current || document.activeElement;
  }, [dimensions.height, scrollLockRef, setPosY]);

  React.useEffect(() => {
    if (isOpen === true) {
      open();
    }
    if (isOpen === false) {
      close();
    }
  }, [close, isOpen, onDismiss, open]);

  // sync the select dropdown's state with bottomsheet's state
  React.useEffect(() => {
    if (!dropdownBottomSheetProps) return;

    // this will let the Dropdown component know that it's rendering a bottomsheet
    dropdownBottomSheetProps.setHasBottomSheet(true);

    if (dropdownBottomSheetProps.isOpen) {
      open();
    }

    if (!dropdownBottomSheetProps.isOpen && dropdownBottomSheetProps.selectionType === 'single') {
      close();
    }
  }, [close, open, dropdownBottomSheetProps]);

  /*
      1. The content should not be scrollable on lower or middle snapPoints
      2. If we reach the top snapPoint we make the content scrollable
      3. scrolling down the content will work as usual
      4. but if the scroll position is at top and then we drag down on the content body
         the bottom-sheet will start the dragging and we will set the scroll to 'none'
    */
  const bind = useDrag(
    ({
      active,
      last,
      cancel,
      tap,
      movement: [_mx, my],
      velocity: [_vx, vy],
      lastOffset: [_, lastOffsetY],
      down,
      args: [{ isContentDragging = false } = {}] = [],
    }) => {
      setIsDragging(down);
      const rawY = lastOffsetY - my;

      const lowerSnapPoint = dimensions.height * snapPoints[0];
      const upperSnapPoint = dimensions.height * snapPoints[snapPoints.length - 1];

      // predictedY is used to create velocity driven swipe
      // the faster you swipe the more distance you cover
      // this enables users to reach upper & lower snappoint with a single swipe
      const predictedDistance = my * (vy / 2);
      const predictedY = Math.max(
        lowerSnapPoint,
        Math.min(upperSnapPoint, rawY - predictedDistance * 2),
      );

      let newY = rawY;

      if (down) {
        // Ensure that users aren't able to drag the sheet
        // more than the upperSnapPoint or maximum height of the sheet
        // this is basically a clamp() function but creates a nice rubberband effect
        const dampening = 0.55;
        const totalHeight = headerHeight + footerHeight + contentHeight;
        if (totalHeight < upperSnapPoint) {
          newY = rubberbandIfOutOfBounds(rawY, 0, totalHeight, dampening);
        } else {
          newY = rubberbandIfOutOfBounds(rawY, 0, upperSnapPoint, dampening);
        }
      } else {
        newY = predictedY;
      }

      const isPosAtUpperSnapPoint = newY >= upperSnapPoint;

      if (isContentDragging) {
        if (isPosAtUpperSnapPoint) {
          newY = upperSnapPoint;
        }

        // keep the newY at upper snap point
        // until the scrollable content is not at top
        // and previously saved Y position is greater than or equal to upper snap point
        // Note: how using newY won't work here since we need the previous value of the newY
        // since we always keep updating the newY,
        // this is cruicial in making the scroll feel natural
        const isContentScrolledAtTop = scrollRef.current?.scrollTop! <= 0;
        if (lastOffsetY === upperSnapPoint && !isContentScrolledAtTop) {
          newY = upperSnapPoint;
        }
        preventScrollingRef.current = newY < upperSnapPoint;
      }

      const shouldClose = newY < lowerSnapPoint;
      if (shouldClose) {
        setIsDragging(false);
        close();
        cancel();
        return;
      }

      if (last) {
        // calculate the nearest snapPoint
        const [nearest] = computeSnapPointBounds(
          newY,
          snapPoints.map((point) => dimensions.height * point) as SnapPoints,
        );

        // if we stop dragging assign snap to the nearest point
        if (!active && !tap) {
          newY = nearest;
        }
      }

      setPosY(newY, !down);
    },
    {
      from: [0, posY],
      filterTaps: true,
    },
  );

  useIsomorphicLayoutEffect(() => {
    const elem = scrollRef.current;
    if (!elem) return;

    const preventScrolling = (e: Event) => {
      if (preventScrollingRef?.current) {
        e.preventDefault();
      }
    };

    // https://www.bram.us/2016/05/02/prevent-overscroll-bounce-in-ios-mobilesafari-pure-css/
    const preventSafariOverscroll = (e: Event) => {
      if (elem.scrollTop < 0) {
        // TODO: figure this out, it doesn't seem to work >iOS12
        // requestAnimationFrame(() => {
        //   elem.style.overflow = 'hidden';
        //   elem.scrollTop = 0;
        //   elem.style.removeProperty('overflow');
        // });
        e.preventDefault();
      }
    };

    elem.addEventListener('scroll', preventScrolling);
    elem.addEventListener('touchmove', preventScrolling);
    elem.addEventListener('touchstart', preventSafariOverscroll);
    return () => {
      elem.removeEventListener('scroll', preventScrolling);
      elem.removeEventListener('touchmove', preventScrolling);
      elem.removeEventListener('touchstart', preventSafariOverscroll);
    };
  }, [scrollRef]);

  const contextValue = React.useMemo(
    () => ({
      isInBottomSheet: true,
      isOpen: Boolean(_isOpen),
      close,
      posY,
      headerHeight,
      contentHeight,
      footerHeight,
      setContentHeight,
      setFooterHeight,
      setHeaderHeight,
      scrollRef,
      bind,
    }),
    [
      _isOpen,
      close,
      posY,
      headerHeight,
      contentHeight,
      footerHeight,
      setContentHeight,
      setFooterHeight,
      setHeaderHeight,
      scrollRef,
      bind,
    ],
  );

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <BottomSheetBackdrop />
      <BottomSheetSurface
        data-surface
        windowHeight={dimensions.height}
        isOpen={Boolean(_isOpen)}
        isDragging={isDragging}
        style={{
          opacity: !_isOpen ? 0 : 1,
          pointerEvents: !_isOpen ? 'none' : 'all',
          height: posY,
          bottom: 0,
          top: 'auto',
        }}
      >
        <BaseBox height="100%" display="flex" flexDirection="column">
          <BottomSheetCloseButton />
          <BottomSheetGrabHandle ref={grabHandleRef} {...bind()} />
          {children}
        </BaseBox>
      </BottomSheetSurface>
    </BottomSheetContext.Provider>
  );
};

const BottomSheet = assignWithoutSideEffects(_BottomSheet, {
  componentId: ComponentIds.BottomSheet,
});

export { BottomSheet, BottomSheetBody, BottomSheetHeader, BottomSheetProps };
