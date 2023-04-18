/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import styled from 'styled-components';
import { rubberbandIfOutOfBounds, useDrag } from '@use-gesture/react';
import usePresence from 'use-presence';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetFooter } from './BottomSheetFooter';
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
import { useTheme } from '~components/BladeProvider';

export const BOTTOM_SHEET_EASING = 'cubic-bezier(.15,0,.24,.97)';

const BottomSheetSurface = styled.div<{
  windowHeight: number;
  isDragging: boolean;
}>(({ theme, windowHeight, isDragging }) => {
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
  initialFocusRef,
  snapPoints = [0.35, 0.5, 0.85],
}: BottomSheetProps): React.ReactElement => {
  const { theme } = useTheme();
  const dimensions = useWindowSize();
  const [contentHeight, setContentHeight] = React.useState(0);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [footerHeight, setFooterHeight] = React.useState(0);
  const [grabHandleHeight, setGrabHandleHeight] = React.useState(0);

  const dropdownBottomSheetProps = useDropdownBottomSheetContext();
  const [posY, _setPosY] = React.useState(0);
  const _isOpen = dropdownBottomSheetProps?.isOpen ?? isOpen;
  const [isDragging, setIsDragging] = React.useState(false);

  const preventScrollingRef = React.useRef(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const grabHandleRef = React.useRef<HTMLDivElement>(null);
  const originalFocusElement = React.useRef<HTMLElement>(null);
  const defaultInitialFocusRef = React.useRef<any>(null);

  const setPosY = React.useCallback(
    (value: number, limit = true) => {
      const maxValue = computeMaxContent({
        contentHeight,
        footerHeight,
        headerHeight: headerHeight + grabHandleHeight,
        maxHeight: value,
      });
      _setPosY(limit ? maxValue : value);
    },
    [contentHeight, footerHeight, grabHandleHeight, headerHeight],
  );

  const scrollLockRef = useScrollLock({
    enabled: true,
    reserveScrollBarGap: true,
    targetRef: scrollRef,
  });

  // take the grabHandle's height into headerHeight too
  useIsomorphicLayoutEffect(() => {
    if (!grabHandleRef.current) return;
    setGrabHandleHeight(grabHandleRef.current.getBoundingClientRect().height);
  }, [grabHandleRef.current, _isOpen]);

  const returnFocus = React.useCallback(() => {
    if (!originalFocusElement.current) return;
    originalFocusElement.current.focus();
    // reset the focus after it's been returned back
    // @ts-expect-error this is a mutable ref
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

  const close = React.useCallback(() => {
    setPosY(0);
    returnFocus();
    onDismiss?.();
    // close the select dropdown as well
    dropdownBottomSheetProps?.setIsOpen(false);
    scrollLockRef.current.deactivate();
  }, [setPosY, returnFocus, dropdownBottomSheetProps, scrollLockRef, onDismiss]);

  const open = React.useCallback(() => {
    setPosY(dimensions.height * 0.5);
    scrollLockRef.current.activate();
    // @ts-expect-error this is a mutable ref
    originalFocusElement.current = originalFocusElement.current ?? document.activeElement;
    focusOnInitialRef();
  }, [dimensions.height, focusOnInitialRef, scrollLockRef, setPosY]);

  // sync controlled state to our actions
  React.useEffect(() => {
    if (isOpen === true) {
      open();
    }
    if (isOpen === false) {
      close();
    }
  }, [close, initialFocusRef, isOpen, open]);

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
        const totalHeight = grabHandleHeight + headerHeight + footerHeight + contentHeight;
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
  }, [scrollRef.current]);

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
      defaultInitialFocusRef,
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
      defaultInitialFocusRef,
    ],
  );

  // usePresence hook waits for the animation to finish before unmounting the component
  // It's similar to framer-motions usePresence hook
  // https://www.framer.com/docs/animate-presence/#usepresence
  const { isMounted, isVisible } = usePresence(Boolean(_isOpen), {
    transitionDuration: theme.motion.duration.moderate,
    exitTransitionDuration: theme.motion.duration.moderate,
  });

  // We will need to reset these values otherwise the next time the bottomsheet opens
  // this will be populated and the animations won't run
  // why?: because how the usePresence hook works, we actually just unmount the
  // html contents not the whole <BottomSheet /> react component
  React.useEffect(() => {
    if (!isMounted) {
      setHeaderHeight(0);
      setFooterHeight(0);
      setContentHeight(0);
      scrollLockRef.current.deactivate();
    }
  }, [isMounted, scrollLockRef]);

  // We don't want to destroy the react tree when we are rendering inside Dropdown
  // Because if we bail out early then ActionList won't render,
  // and Dropdown manages it's state based on the rendered JSX of ActionList
  // If we don't render ActionList Dropdown state will reset each time we open/close BottomSheet
  const isInsideDropdown = Boolean(dropdownBottomSheetProps);
  if (!isMounted && !isInsideDropdown) {
    return <></>;
  }

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <BottomSheetBackdrop />
      <BottomSheetSurface
        data-surface
        windowHeight={dimensions.height}
        isDragging={isDragging}
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'all' : 'none',
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

export { BottomSheet, BottomSheetBody, BottomSheetHeader, BottomSheetFooter, BottomSheetProps };
