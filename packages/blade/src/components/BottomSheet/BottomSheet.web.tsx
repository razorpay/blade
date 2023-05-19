/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import styled from 'styled-components';
import { rubberbandIfOutOfBounds, useDrag } from '@use-gesture/react';
import usePresence from 'use-presence';
import { clearAllBodyScrollLocks } from 'body-scroll-lock';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetFooter } from './BottomSheetFooter';
import { BottomSheetBody } from './BottomSheetBody';
import type { SnapPoints } from './utils';
import { computeMaxContent, computeSnapPointBounds } from './utils';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetContext, useBottomSheetAndDropdownGlue } from './BottomSheetContext';
import { ComponentIds } from './componentIds';
import type { BottomSheetProps } from './types';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import { useBottomSheetStack } from './BottomSheetStack';

import BaseBox from '~components/Box/BaseBox';
import {
  makeMotionTime,
  assignWithoutSideEffects,
  makeSize,
  makeAccessible,
  metaAttribute,
} from '~utils';

import { useScrollLock } from '~src/hooks/useScrollLock';
import { useWindowSize } from '~src/hooks/useWindowSize';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { useTheme } from '~components/BladeProvider';
import { useId } from '~src/hooks/useId';
import { size } from '~tokens/global';

export const BOTTOM_SHEET_EASING = 'cubic-bezier(.15,0,.24,.97)';

const BottomSheetSurface = styled.div<{
  windowHeight: number;
  isDragging: boolean;
}>(({ theme, windowHeight, isDragging }) => {
  return {
    background: theme.colors.surface.background.level2.lowContrast,
    borderTopLeftRadius: makeSize(size[16]),
    borderTopRightRadius: makeSize(size[16]),
    borderColor: theme.colors.surface.border.normal.lowContrast,
    boxShadow: '0px -24px 48px -12px hsla(217, 56%, 17%, 0.18)',
    opacity: 0,
    pointerEvents: 'none',
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
    backgroundColor: theme.colors.surface.background.level2.lowContrast,
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none',
    overflow: 'hidden',
  };
});

const _BottomSheet = ({
  isOpen,
  onDismiss,
  children,
  initialFocusRef,
  snapPoints = [0.35, 0.5, 0.85],
}: BottomSheetProps): React.ReactElement => {
  const { theme } = useTheme();
  const dimensions = useWindowSize();
  const [contentHeight, setContentHeight] = React.useState(0);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [footerHeight, setFooterHeight] = React.useState(0);
  const [grabHandleHeight, setGrabHandleHeight] = React.useState(0);

  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const [positionY, _setPositionY] = React.useState(0);
  const _isOpen = bottomSheetAndDropdownGlue?.isOpen ?? isOpen;
  const [isDragging, setIsDragging] = React.useState(false);

  const preventScrollingRef = React.useRef(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const grabHandleRef = React.useRef<HTMLDivElement>(null);
  const originalFocusElement = React.useRef<HTMLElement | null>(null);
  const defaultInitialFocusRef = React.useRef<any>(null);
  const initialSnapPoint = React.useRef<number>(snapPoints[1]);
  const totalHeight = React.useMemo(() => {
    return grabHandleHeight + headerHeight + footerHeight + contentHeight;
  }, [contentHeight, footerHeight, grabHandleHeight, headerHeight]);

  const id = useId();
  const {
    stack,
    addBottomSheetToStack,
    removeBottomSheetFromStack,
    getTopOfTheStack,
    getCurrentStackIndexById,
  } = useBottomSheetStack();
  const currentStackIndex = getCurrentStackIndexById(id);
  const isOnTopOfStack = getTopOfTheStack() === id;
  const zIndex = 100 - currentStackIndex;

  const setPositionY = React.useCallback(
    (value: number, limit = true) => {
      const maxValue = computeMaxContent({
        contentHeight,
        footerHeight,
        headerHeight: headerHeight + grabHandleHeight,
        maxHeight: value,
      });
      _setPositionY(limit ? maxValue : value);
    },
    [contentHeight, footerHeight, grabHandleHeight, headerHeight],
  );

  // locks the body scroll to prevent accidental scrolling of content when we drag the sheet
  // We are ready when we calculated the height of the content
  const isReady = contentHeight > 0;
  // only lock the body when we atleast have 1 bottomsheet open
  const shouldLock = isReady && stack.length > 0;
  const scrollLockRef = useScrollLock({
    enabled: shouldLock,
    targetRef: scrollRef,
    reserveScrollBarGap: true,
  });

  // clear all body locks to avoid memory leaks & accidental body locking
  React.useEffect(() => {
    const hasNoBottomSheets = stack.length < 1;
    if (hasNoBottomSheets) {
      clearAllBodyScrollLocks();
    }
  }, [stack]);

  // take the grabHandle's height into headerHeight too
  useIsomorphicLayoutEffect(() => {
    if (!grabHandleRef.current) return;
    setGrabHandleHeight(grabHandleRef.current.getBoundingClientRect().height);
  }, [grabHandleRef.current, _isOpen]);

  // if bottomSheet height is >35% & <50% then set initial snapPoint to 35%
  useIsomorphicLayoutEffect(() => {
    const middleSnapPoint = snapPoints[1] * dimensions.height;
    const lowerSnapPoint = snapPoints[0] * dimensions.height;
    if (totalHeight > lowerSnapPoint && totalHeight < middleSnapPoint) {
      initialSnapPoint.current = snapPoints[0];
    }
  }, [dimensions.height, snapPoints, totalHeight]);

  const returnFocus = React.useCallback(() => {
    if (!originalFocusElement.current) return;
    originalFocusElement.current.focus();
    // After returning focus we will clear the original focus
    // Because if sheet can be opened up via multiple triggers
    // We want to ensure the focus returns back to the most recent triggerer
    originalFocusElement.current = null;
  }, [originalFocusElement]);

  const focusOnInitialRef = React.useCallback(() => {
    if (!initialFocusRef) {
      // focus on close button
      defaultInitialFocusRef.current?.focus();
    } else {
      // focus on the initialRef passed by the user
      initialFocusRef.current?.focus();
    }
  }, [initialFocusRef]);

  const handleOnOpen = React.useCallback(() => {
    setPositionY(dimensions.height * initialSnapPoint.current);
    scrollLockRef.current.activate();
    // initialize the original focused element
    // On first render it will be the activeElement, eg: the button trigger or select input
    // On Subsequent open operations it won't further update the original focus
    originalFocusElement.current =
      originalFocusElement.current ?? (document.activeElement as HTMLElement);
    focusOnInitialRef();
  }, [dimensions.height, focusOnInitialRef, scrollLockRef, setPositionY]);

  const handleOnClose = React.useCallback(() => {
    setPositionY(0);
    returnFocus();
  }, [returnFocus, setPositionY]);

  const close = React.useCallback(() => {
    onDismiss?.();
    bottomSheetAndDropdownGlue?.onBottomSheetDismiss();
  }, [bottomSheetAndDropdownGlue, onDismiss]);

  // sync controlled state to our actions
  React.useEffect(() => {
    if (_isOpen) {
      // open on the next frame, otherwise the animations will not run on first render
      window.setTimeout(() => {
        handleOnOpen();
      });
    } else {
      handleOnClose();
    }
  }, [_isOpen, handleOnClose, handleOnOpen]);

  // let the Dropdown component know that it's rendering a bottomsheet
  React.useEffect(() => {
    if (!bottomSheetAndDropdownGlue) return;
    bottomSheetAndDropdownGlue.setDropdownHasBottomSheet(true);
  }, [bottomSheetAndDropdownGlue]);

  const bind = useDrag(
    ({
      active,
      last,
      cancel,
      tap,
      movement: [_movementX, movementY],
      velocity: [_velocityX, velocityY],
      lastOffset: [_, lastOffsetY],
      down,
      dragging,
      args: [{ isContentDragging = false } = {}] = [],
    }) => {
      setIsDragging(Boolean(dragging));
      // lastOffsetY is the previous position user stopped dragging the sheet
      // movementY is the drag amount from the bottom of the screen, so as you drag up the movementY goes into negatives
      // and rawY is the calculated offset from the last position of the bottomsheet to current drag amount.
      const rawY = lastOffsetY - movementY;

      const lowerSnapPoint = dimensions.height * snapPoints[0];
      const upperSnapPoint = dimensions.height * snapPoints[snapPoints.length - 1];

      // predictedY is used to create velocity driven swipe
      // the faster you swipe the more distance you cover
      // this enables users to reach upper & lower snappoint with a single swipe
      const predictedDistance = movementY * (velocityY / 2);
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
        const isContentScrolledAtTop = scrollRef.current && scrollRef.current.scrollTop <= 0;
        if (lastOffsetY === upperSnapPoint && !isContentScrolledAtTop) {
          newY = upperSnapPoint;
        }
        preventScrollingRef.current = newY < upperSnapPoint;
      }

      if (last) {
        // calculate the nearest snapPoint
        const [nearest, lower] = computeSnapPointBounds(
          newY,
          snapPoints.map((point) => dimensions.height * point) as SnapPoints,
        );

        // This ensure that the lower snapPoint will always have atleast some buffer
        // When the bottomsheet total height is less than the lower snapPoint
        // Video walkthrough: https://www.loom.com/share/a9a8db7688d64194b13df8b3e25859ae
        const lowerPointBuffer = 60;
        const lowerestSnap = Math.min(lower, totalHeight) - lowerPointBuffer;

        const shouldClose = rawY < lowerestSnap;
        if (shouldClose) {
          setIsDragging(false);
          cancel();
          close();
          return;
        }

        // if we stop dragging assign snap to the nearest point
        if (!active && !tap) {
          newY = nearest;
        }
      }

      setPositionY(newY, !down);
    },
    {
      from: [0, positionY],
      filterTaps: true,
      enabled: isOnTopOfStack && _isOpen,
    },
  );

  // Here we are preventing the scrolling of the content, until the preventScrollingRef value is true
  useIsomorphicLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const preventScrolling = (e: Event) => {
      if (preventScrollingRef?.current) {
        e.preventDefault();
      }
    };

    // https://www.bram.us/2016/05/02/prevent-overscroll-bounce-in-ios-mobilesafari-pure-css/
    const preventSafariOverscroll = (e: Event) => {
      if (scrollElement.scrollTop < 0) {
        // TODO: figure this out, it doesn't seem to work >iOS12
        // requestAnimationFrame(() => {
        //   elem.style.overflow = 'hidden';
        //   elem.scrollTop = 0;
        //   elem.style.removeProperty('overflow');
        // });
        e.preventDefault();
      }
    };

    scrollElement.addEventListener('scroll', preventScrolling);
    scrollElement.addEventListener('touchmove', preventScrolling);
    scrollElement.addEventListener('touchstart', preventSafariOverscroll);
    return () => {
      scrollElement.removeEventListener('scroll', preventScrolling);
      scrollElement.removeEventListener('touchmove', preventScrolling);
      scrollElement.removeEventListener('touchstart', preventSafariOverscroll);
    };
    // Only run this hook when we know all the layout calculations are done,
    // Otherwise the scrollRef.current will be null.
    // isReady prop will ensure that we are done measuring the content height
  }, [isReady]);

  // usePresence hook waits for the animation to finish before unmounting the component
  // It's similar to framer-motions usePresence hook
  // https://www.framer.com/docs/animate-presence/#usepresence
  const { isMounted, isVisible } = usePresence(Boolean(_isOpen), {
    transitionDuration: theme.motion.duration.moderate,
  });

  const contextValue = React.useMemo(
    () => ({
      isInBottomSheet: true,
      isOpen: Boolean(isVisible),
      close,
      positionY,
      headerHeight,
      contentHeight,
      footerHeight,
      setContentHeight,
      setFooterHeight,
      setHeaderHeight,
      scrollRef,
      bind,
      defaultInitialFocusRef,
    }),
    [
      isVisible,
      close,
      positionY,
      headerHeight,
      contentHeight,
      footerHeight,
      setContentHeight,
      setFooterHeight,
      setHeaderHeight,
      scrollRef,
      bind,
      defaultInitialFocusRef,
    ],
  );

  React.useEffect(() => {
    if (isMounted) {
      addBottomSheetToStack(id);
    } else {
      removeBottomSheetFromStack(id);
    }
  }, [addBottomSheetToStack, id, isMounted, removeBottomSheetFromStack]);

  // We will need to reset these values otherwise the next time the bottomsheet opens
  // this will be populated and the animations won't run
  // why?: because how the usePresence hook works, we actually just unmount the
  // html contents not the whole <BottomSheet /> react component
  React.useEffect(() => {
    if (!isMounted) {
      setHeaderHeight(0);
      setFooterHeight(0);
      setContentHeight(0);
      setGrabHandleHeight(0);
      _setPositionY(0);
    }
  }, [isMounted, scrollLockRef]);

  // We don't want to destroy the react tree when we are rendering inside Dropdown
  // Because if we bail out early then ActionList won't render,
  // and Dropdown manages it's state based on the rendered JSX of ActionList
  // If we don't render ActionList Dropdown state will reset each time we open/close BottomSheet
  const isInsideDropdown = Boolean(bottomSheetAndDropdownGlue);
  if (!isMounted && !isInsideDropdown) {
    return <></>;
  }

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <BottomSheetBackdrop zIndex={zIndex} />
      <BottomSheetSurface
        {...metaAttribute({ name: ComponentIds.BottomSheet })}
        {...makeAccessible({ modal: true, role: 'dialog' })}
        windowHeight={dimensions.height}
        isDragging={isDragging}
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'all' : 'none',
          height: positionY,
          bottom: 0,
          top: 'auto',
          zIndex,
        }}
      >
        <BaseBox height="100%" display="flex" flexDirection="column">
          <BottomSheetGrabHandle
            ref={grabHandleRef}
            {...metaAttribute({ name: ComponentIds.BottomSheetGrabHandle })}
            {...bind()}
          />
          {children}
        </BaseBox>
      </BottomSheetSurface>
    </BottomSheetContext.Provider>
  );
};

const BottomSheet = assignWithoutSideEffects(_BottomSheet, {
  componentId: ComponentIds.BottomSheet,
});

export { BottomSheet, BottomSheetBody, BottomSheetHeader, BottomSheetFooter, BottomSheetProps };
