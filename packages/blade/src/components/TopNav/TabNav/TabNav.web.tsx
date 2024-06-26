import React from 'react';
import styled from 'styled-components';
import { approximatelyEqual, useIsOverflow } from './utils';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import { ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { makeMotionTime, makeSize } from '~utils';
import { size } from '~tokens/global';

const GRADIENT_WIDTH = 54 as const;
const GRADIENT_OFFSET = -11 as const;
const OFFSET_BOTTOM = -12 as const;
const SCROLL_AMOUNT = 200;

type TabNavProps = {
  children: React.ReactNode;
};

const ScrollableArea = styled(BaseBox)(() => {
  return {
    '&::-webkit-scrollbar': { display: 'none' },
  };
});

const GradientOverlay = styled(BaseBox)<{ shouldShow?: boolean; variant: 'left' | 'right' }>(
  ({ theme, shouldShow, variant }) => {
    const color = theme.colors.surface.background.gray.subtle;

    return {
      position: 'absolute',
      [variant]: 0,
      pointerEvents: shouldShow ? 'auto' : 'none',
      transform: shouldShow ? 'scale(1)' : 'scale(0.5)',
      opacity: shouldShow ? 1 : 0,
      transitionTimingFunction: `${theme.motion.easing.standard.revealing}`,
      transitionDuration: `${makeMotionTime(theme.motion.duration.xquick)}`,
      transitionProperty: 'opacity, transform',
      zIndex: 1,
      ':before': {
        content: "''",
        pointerEvents: 'none',
        position: 'absolute',
        [variant]: 0,
        top: makeSize(GRADIENT_OFFSET),
        bottom: makeSize(GRADIENT_OFFSET),
        width: makeSize(GRADIENT_WIDTH),
        background: `linear-gradient(to ${variant}, transparent 0%, ${color} 30%, ${color} 100%);`,
      },
    };
  },
);

const TabNav = ({
  children,
  ...styledProps
}: TabNavProps & StyledPropsBlade): React.ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(ref);
  const [scrollStatus, setScrollStatus] = React.useState<'start' | 'end' | 'middle'>('start');

  // Check if the scroll is at start, end or middle
  const handleScrollStatus = React.useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
      const target = e.target as HTMLDivElement;
      const isAtStart = target.scrollLeft === 0;
      const isAtEnd = approximatelyEqual(
        target.scrollLeft,
        target.scrollWidth - target.offsetWidth,
      );

      if (isAtStart) {
        setScrollStatus('start');
      } else if (isAtEnd) {
        setScrollStatus('end');
      } else {
        setScrollStatus('middle');
      }
    },
    [],
  );

  const scrollRight = (): void => {
    if (!ref.current) return;
    ref.current.scrollBy({
      behavior: 'smooth',
      left: SCROLL_AMOUNT,
    });
  };

  const scrollLeft = (): void => {
    if (!ref.current) return;
    ref.current.scrollBy({
      behavior: 'smooth',
      left: -SCROLL_AMOUNT,
    });
  };

  return (
    <BaseBox
      display="flex"
      width="100%"
      alignItems="flex-end"
      position="relative"
      {...getStyledProps(styledProps)}
    >
      <GradientOverlay variant="left" shouldShow={isOverflow && scrollStatus !== 'start'}>
        <Button
          size="xsmall"
          variant="tertiary"
          icon={ChevronLeftIcon}
          accessibilityLabel="Scroll Left"
          onClick={scrollLeft}
        />
      </GradientOverlay>
      <ScrollableArea
        ref={ref}
        onScroll={handleScrollStatus}
        marginBottom={makeSize(OFFSET_BOTTOM)}
        display="flex"
        width="100%"
        position="relative"
        whiteSpace="nowrap"
        gap="spacing.0"
        overflowY="visible"
        overflowX="auto"
      >
        <BaseBox display="flex" flexDirection="row" width="max-content">
          {React.Children.map(children, (child, index) => {
            return (
              <>
                {index > 0 ? (
                  <Divider
                    margin="auto"
                    variant="muted"
                    orientation="vertical"
                    height={makeSize(size[16])}
                  />
                ) : null}
                {child}
              </>
            );
          })}
        </BaseBox>
      </ScrollableArea>
      <GradientOverlay variant="right" shouldShow={isOverflow && scrollStatus !== 'end'}>
        <Button
          size="xsmall"
          variant="tertiary"
          icon={ChevronRightIcon}
          accessibilityLabel="Scroll Right"
          onClick={scrollRight}
        />
      </GradientOverlay>
    </BaseBox>
  );
};

export { TabNav };
