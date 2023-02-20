/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { rubberbandIfOutOfBounds, useDrag } from '@use-gesture/react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetBody } from './BottomSheetBody';
import type { SnapPoints } from './utils';
import { computeMaxContent, computeSnapPointBounds } from './utils';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime, makeSpace } from '~utils';

import { useScrollLock } from '~src/hooks/useScrollLock';
import { useWindowSize } from '~src/hooks/useWindowSize';

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints: SnapPoints;
};

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
    transitionTimingFunction: theme.motion.easing.standard.revealing,
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
  };
});

const BottomSheetContext = React.createContext<{
  maxContent: number;
  minContent: number;
  headerHeight: number;
  contentHeight: number;
  footerHeight: number;
  setContentHeight: React.Dispatch<React.SetStateAction<number>>;
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
  setFooterHeight: React.Dispatch<React.SetStateAction<number>>;
  close: () => void;
  scrollRef: React.Ref<any>;
  bind: ((...args: any[]) => ReactDOMAttributes) | null;
  isOpen: boolean;
  posY: number;
}>({
  maxContent: 0,
  minContent: 0,
  headerHeight: 0,
  contentHeight: 0,
  footerHeight: 0,
  setContentHeight: () => {},
  setHeaderHeight: () => {},
  setFooterHeight: () => {},
  close: () => {},
  scrollRef: null,
  bind: null,
  isOpen: false,
  posY: 0,
});

export const useBottomSheetContext = () => {
  const state = React.useContext(BottomSheetContext);

  if (!state) {
    throw new Error('[Blade BottomSheet]: useBottomSheet must be used within BottomSheet');
  }

  return state;
};

const BottomSheet = React.forwardRef<any, BottomSheetProps>(
  ({ children, snapPoints = [0.35, 0.6, 0.85] }, ref): React.ReactElement => {
    const dimensions = useWindowSize();
    const [contentHeight, setContentHeight] = React.useState(0);
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const [footerHeight, setFooterHeight] = React.useState(0);
    const grabHandleHeight = 4 + 16; // TODO Fix
    // const totalHeight = grabHandleHeight + headerHeight + (contentHeight + 16) + footerHeight;

    const [posY, _setPosY] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const preventScrollingRef = React.useRef(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const setPosY = React.useCallback(
      (value: number) => {
        const maxValue = computeMaxContent({
          contentHeight: contentHeight + 16, // TODO: 16px padding of content
          footerHeight,
          headerHeight: headerHeight + grabHandleHeight,
          maxHeight: value,
        });
        _setPosY(maxValue);
      },
      [contentHeight, footerHeight, grabHandleHeight, headerHeight],
    );

    const scrollLockRef = useScrollLock({
      enabled: true,
      reserveScrollBarGap: true,
      targetRef: scrollRef,
    });

    React.useEffect(() => {
      if (posY > 0) {
        setIsOpen(true);
        scrollLockRef.current.activate();
      } else {
        setIsOpen(false);
        scrollLockRef.current.deactivate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posY]);

    const close = React.useCallback(() => {
      setIsOpen(false);
      setPosY(0);
    }, [setPosY]);

    const open = React.useCallback(() => {
      setIsOpen(true);
      setPosY(dimensions.height * 0.5);
    }, [dimensions.height, setPosY]);

    React.useImperativeHandle(
      ref,
      () => {
        return {
          open,
          close,
        };
      },
      [close, open],
    );

    // 1. The content should not be scrollable on lower or middle snapPoints
    // 2. If we reach the top snappoint we make the content scrolalble
    // 3. scrolling down the content will work as usual
    // 4. but if the scroll position is at top and then we drag down on the content body
    //    the bottom-sheet will start the dragging and we will set the scroll to 'none'

    // snap point note:
    // when user sets isOpen={true} we should open the bs at the minimum content height or 50% of vh
    // also: if the height of the bs content is small then the snap points can either be computed in two ways
    //       1. compute the snappoints relative to the minHeight (minHeight * 0.25, minHeight * 0.5)
    //       2. or can be computed freely with any value eg: innerHeight.
    //          in this case even if the height of the content small the bs will show whitespace
    const bind = useDrag(
      ({
        active,
        last,
        movement: [_mx, my],
        velocity: [_vx, vy],
        lastOffset: [_, lastOffsetY],
        down,
        args: [{ isContentDragging = false } = {}] = [],
      }) => {
        setIsDragging(down);
        const rawY = lastOffsetY - my;

        const lowerSnapPoint = dimensions.height * snapPoints[0];
        // const middleSnapPoint = dimensions.height * snapPoints[Math.ceil(snapPoints.length / 2)];
        const upperSnapPoint = dimensions.height * snapPoints[snapPoints.length - 1];

        const predictedDistance = my * (vy / 2);
        const predictedY = Math.max(
          lowerSnapPoint,
          Math.min(upperSnapPoint, rawY - predictedDistance * 2),
        );

        let newY = rawY;
        if (down) {
          // swipe rubber banding
          const dampening = 0.55;
          newY = rubberbandIfOutOfBounds(rawY, lowerSnapPoint /* 0 */, upperSnapPoint, dampening);
        } else {
          newY = predictedY;
        }

        const isPosLessThanLowerSnapPoint = newY <= lowerSnapPoint;
        const isPosAtUpperSnapPoint = newY >= upperSnapPoint;

        if (isContentDragging) {
          const isContentScrolledAtTop = scrollRef.current?.scrollTop! <= 0;

          if (isPosAtUpperSnapPoint) {
            newY = upperSnapPoint;
          }

          // keep the newY at upper snap point
          // until the scrollable content is not at top
          // and previously saved Y position is equal to upper snap point
          // note how using newY won't work here since we need the previous value of the newY
          // because we always keep updating the newY,
          // this is cruicial in making the scroll feel natural
          if (lastOffsetY === upperSnapPoint && !isContentScrolledAtTop) {
            newY = upperSnapPoint;
          }
          preventScrollingRef.current = newY < upperSnapPoint;
        }

        if (last) {
          // close bottomsheet
          if (isPosLessThanLowerSnapPoint) {
            newY = 0;
          }

          // calculate snappoints
          const [nearest] = computeSnapPointBounds(
            newY,
            snapPoints.map((point) => dimensions.height * point) as SnapPoints,
          );

          if (!active) {
            newY = nearest;
          }
        }

        setPosY(newY);
      },
      {
        from: [0, posY],
        filterTaps: true,
      },
    );

    React.useEffect(() => {
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

    return (
      <BottomSheetContext.Provider
        value={{
          isOpen,
          close,
          posY,
          maxContent: 0,
          minContent: 0,
          headerHeight,
          contentHeight,
          footerHeight,
          setContentHeight,
          setFooterHeight,
          setHeaderHeight,
          scrollRef,
          bind,
        }}
      >
        <BottomSheetSurface
          data-surface
          windowHeight={dimensions.height}
          isOpen={isOpen}
          isDragging={isDragging}
          style={{
            height: posY,
            transform: `translate3d(0, ${posY * -1}px, 0)`,
          }}
        >
          <BaseBox height="100%" display="flex" flexDirection="column">
            <BottomSheetGrabHandle {...bind()} />
            {children}
          </BaseBox>
        </BottomSheetSurface>
      </BottomSheetContext.Provider>
    );
  },
);

export { BottomSheet, BottomSheetBody, BottomSheetHeader, BottomSheetProps };
